import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storeAPI, getAuthToken } from '../../utils/api';
import StorePreview from '../../components/store/StorePreview';

const StoreChatbox = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState(null);
  const endRef = useRef(null);

  const isAuthed = !!getAuthToken();

  useEffect(() => {
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    // fetch store for initial preview if exists
    const load = async () => {
      try {
        const res = await storeAPI.getStoreById(storeId);
        if (res.success) setStore(res.data.store);
      } catch (_) {}
    };
    load();
  }, [storeId]);

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
      if (ai) {
        setMessages((prev) => [...prev, { role: 'assistant', content: JSON.stringify(ai, null, 2) }]);
      }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border shadow-sm flex flex-col h-[80vh]">
          <div className="px-4 py-3 border-b">
            <h1 className="text-lg font-semibold">AI Prompt Chatbox</h1>
            <p className="text-xs text-gray-500">Store ID: {storeId}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-sm text-gray-500">Describe your desired store vibe and content. Example: "I want my website to look childish because I’m selling kids’ products."</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} inline-block px-3 py-2 rounded-lg whitespace-pre-wrap text-sm max-w-[90%]`}>{m.content}</div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Generating...</div>}
            <div ref={endRef} />
          </div>
          <form onSubmit={onSubmit} className="p-3 border-t flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your theme, colors, sections..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">Submit</button>
          </form>
          <div className="p-3 border-t flex gap-2">
            <button onClick={onTryAgain} className="text-sm px-3 py-2 rounded border">Try again / Change prompt</button>
            <button 
              onClick={async () => {
                try {
                  await storeAPI.approveStore(storeId);
                } catch (_) {}
                navigate(`/dashboard/store/${storeId}/editor`);
              }} 
              className="text-sm px-3 py-2 rounded bg-green-600 text-white"
            >
              Continue with this theme
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-4 h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Live Preview</h2>
          <StorePreview theme={theme} layout={layout} />
          {!theme && (
            <div className="text-xs text-gray-500 mt-4">No AI theme yet. Submit a prompt to generate one.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreChatbox;


