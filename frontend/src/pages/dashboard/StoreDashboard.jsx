import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { storeAPI } from '../../utils/api';

const StoreDashboard = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await storeAPI.getStoreById(storeId);
        if (res.success) {
          setStore(res.data.store);
        } else {
          setError('Failed to load store details');
        }
      } catch (e) {
        setError(e.message || 'Failed to load store');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [storeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <button onClick={() => navigate('/dashboard')} className="text-sm text-neutral-400 hover:text-white">← Back to Stores</button>
          </div>
          <div className="p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="h-12 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-neutral-400 hover:text-white">←</button>
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center font-bold text-white">{store?.storeName?.[0]?.toUpperCase() || 'S'}</div>
          <div className="text-sm font-semibold">{store?.storeName}</div>
          <span className="px-2 py-0.5 bg-neutral-800/80 text-neutral-300 rounded text-xs border border-neutral-700/50">{store?.domain}</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6">
        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">Overview</h2>
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${store?.approved ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span className="text-neutral-400">{store?.approved ? 'Active' : 'Pending approval'}</span>
              </div>
            </div>
            <p className="text-neutral-400 text-sm">Manage and monitor your store. Use quick actions to jump into tools.</p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Link to={`/dashboard/store/${storeId}/chatbox`} className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 text-center text-sm">AI Builder</Link>
              <Link to={`/dashboard/store/${storeId}/editor`} className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 text-center text-sm">Editor</Link>
              <Link to={`/dashboard/products?storeId=${storeId}`} className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 text-center text-sm">Products</Link>
              <Link to={`/dashboard/store/${storeId}/approval`} className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 text-center text-sm">Approval</Link>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3 text-neutral-200">Store Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-400">Name</span><span>{store?.storeName}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">Domain</span><span>{store?.domain}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">Status</span><span>{store?.approved ? 'Active' : 'Pending'}</span></div>
              {store?.description && (
                <div className="pt-2 border-t border-neutral-800">
                  <div className="text-neutral-400 mb-1">Description</div>
                  <div className="text-neutral-300">
                    {store.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Placeholder sections for metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-2 text-neutral-200">Getting Started</h3>
            <ol className="list-decimal list-inside text-neutral-400 text-sm space-y-1">
              <li>Open AI Builder to scaffold your theme</li>
              <li>Use Editor to customize the layout</li>
              <li>Add your first products</li>
              <li>Request approval and publish</li>
            </ol>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-2 text-neutral-200">Next Steps</h3>
            <div className="text-neutral-400 text-sm">Hook up analytics, orders, and more here.</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoreDashboard;