import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storeAPI, getAuthToken } from '../../utils/api';
import StorePreview from '../../components/store/StorePreview';
import DeviceFrame from '../../components/ui/DeviceFrame';
import PreviewSkeleton from '../../components/ui/PreviewSkeleton';

const StoreChatbox = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState(null);
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const endRef = useRef(null);

  const isAuthed = !!getAuthToken();

  useEffect(() => {
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        const res = await storeAPI.getStoreById(storeId);
        if (res.success) setStore(res.data.store);
      } catch (err) {
        console.error('Failed to load store', err);
      }
    };
    load();
  }, [storeId, isAuthed, navigate]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    const userMsg = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);
    try {
      const res = await storeAPI.sendAIPrompt(storeId, userMsg.content);
      const ai = res?.data?.ai;
      const updatedStore = res?.data?.store;
      const friendly = res?.data?.message || res?.message || 'Done! I updated the preview based on your request.';
      setMessages((prev) => [...prev, { role: 'assistant', content: friendly }]);
      if (updatedStore) setStore(updatedStore);
    } catch (e2) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${e2.message || 'Failed to generate'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const theme = store?.theme || null;
  const layout = store?.layout || { sections: [] };

  const onTryAgain = () => {
    setPrompt('');
    setMessages([]);
  };

  return (
    <div className="h-screen overflow-hidden bg-neutral-950 text-neutral-100">

      {/* Hero-esque intro - only before first message */}
      {messages.length === 0 && (
        <div className="max-w-4xl mx-auto pt-16 pb-6 px-6 text-center">
          <div className="inline-block mb-3 px-3 py-1.5 bg-emerald-900/30 border border-emerald-800 rounded-full text-emerald-300 text-xs">Introducing Sellaora</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Build in minutes & sell to Millions</h1>
          <p className="text-base md:text-lg text-neutral-400">Create websites by chatting with AI. Describe what you want—see a live preview instantly.</p>
        </div>
      )}

      {/* Chat Input (hero) — visible only before first message) */}
      {messages.length === 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-8 flex justify-center">
          <form onSubmit={onSubmit} className="bg-neutral-900 rounded-2xl shadow border border-neutral-800 overflow-hidden w-full">
            <div className="flex items-center gap-3 px-4 py-3">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(e); } }}
                placeholder="Describe your site (e.g., ‘A clean shop with a hero, features, and a footer’)…"
                className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400 rounded-full text-sm outline-none focus:ring-2 focus:ring-neutral-700"
              />
              <button 
                type="submit"
                disabled={loading}
                className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-neutral-900 hover:bg-neutral-200 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            {/* Prompt chips */}
            <div className="px-5 pb-4 flex flex-wrap items-center justify-center gap-2 text-neutral-400">
              {['Landing page for coffee brand','Add a product grid','Dark theme footer','About + Contact sections'].map((t) => (
                <button key={t} type="button" onClick={() => setPrompt(t)} className="px-2.5 py-1.5 text-xs rounded-full border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700">
                  {t}
                </button>
              ))}
            </div>
          </form>
        </div>
      )}

      {/* Messages & Preview */}
      {messages.length > 0 && (
        <div className="w-full h-full px-6 py-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full">
            {/* Chat */}
            <div className="bg-neutral-900 rounded-2xl shadow border border-neutral-800 p-6 h-full overflow-hidden">
              <div className="mb-4">
                <h2 className="font-semibold text-neutral-100">Chat</h2>
                <p className="text-xs text-neutral-400">Store ID: {storeId}</p>
              </div>
              <div className="space-y-3 mb-4 h-[calc(100%-150px)] overflow-y-auto pr-1">
                {messages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div className={`inline-block px-4 py-2 rounded-2xl text-sm ${
                      m.role === 'user' 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-neutral-800/50 text-neutral-200'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && <div className="text-sm text-neutral-400">Generating...</div>}
                <div ref={endRef} />
              </div>
              {/* Composer inside chat — visible after we have messages */}
              <form onSubmit={onSubmit} className="flex items-center gap-2 pt-4 border-t border-neutral-800 mt-2">
                <div className="flex-1 flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-full px-3">
                  <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(e); } }}
                    placeholder="Tell the AI what to change… (e.g., ‘make the hero darker’)"
                    className="flex-1 px-2 py-2 text-sm bg-transparent outline-none text-neutral-100 placeholder-neutral-400"
                  />
                  <button 
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-neutral-900 hover:bg-neutral-200 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                <button 
                  type="button"
                  onClick={onTryAgain}
                  className="px-3 py-2 text-sm border border-neutral-700 rounded-lg hover:bg-neutral-800"
                >
                  Reset
                </button>
                <button 
                  type="button"
                  onClick={async () => {
                    try {
                      const chosenThemeId = store?.theme?.id || store?.theme?.themeId || 'theme-1';
                      await storeAPI.chooseTheme(storeId, chosenThemeId);
                      localStorage.setItem('editorStoreId', storeId);
                      navigate(`/dashboard/store/${storeId}/editor`);
                    } catch (e) {
                      console.error('Choose theme failed', e);
                      alert('Failed to choose theme');
                    }
                  }}
                  className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                >
                  Open in editor
                </button>
              </form>
            </div>

            {/* Preview */}
            <div className="bg-transparent h-full overflow-hidden">
              <DeviceFrame device={device}>
                <div className="relative h-full">
                  {loading && (
                    <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-start justify-start rounded-xl">
                      <PreviewSkeleton />
                    </div>
                  )}
                  <div className={`p-4 h-full overflow-auto ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <StorePreview storeId={storeId} theme={theme} layout={layout} />
                    {!theme && (
                      <div className="text-sm text-neutral-400">No theme yet</div>
                    )}
                  </div>
                </div>
              </DeviceFrame>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreChatbox;