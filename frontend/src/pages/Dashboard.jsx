import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, storeAPI, removeAuthToken } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createStoreLoading, setCreateStoreLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStore, setNewStore] = useState({
    storeName: '',
    domain: '',
    description: '',
  });

  useEffect(() => {
    fetchUserData();
    fetchStores();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setError('Failed to load user data. Please try logging in again.');
      removeAuthToken();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await storeAPI.getUserStores();
      if (response.success) {
        setStores(response.data.stores);
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setError('Failed to load stores');
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setError('');

    if (!newStore.storeName || !newStore.domain) {
      setError('Please provide store name and domain');
      return;
    }

    try {
      setCreateStoreLoading(true);
      const response = await storeAPI.createStore(newStore);
      
      if (response.success) {
        const created = response.data.store;
        setStores([created, ...stores]);
        setNewStore({ storeName: '', domain: '', description: '' });
        setShowCreateForm(false);
        navigate(`/dashboard/store/${created._id}/chatbox`);
      } else {
        setError('Failed to create store');
      }
    } catch (err) {
      setError(err.message || 'Failed to create store');
    } finally {
      setCreateStoreLoading(false);
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store?')) {
      return;
    }

    try {
      await storeAPI.deleteStore(storeId);
      setStores(stores.filter(store => store._id !== storeId));
    } catch (err) {
      setError(err.message || 'Failed to delete store');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="h-14 border-b bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="font-semibold">Sellaora</div>
          <div className="text-gray-400">|</div>
          <div className="text-sm text-gray-600">Dashboard</div>
        </div>
        <button onClick={handleLogout} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
          Logout
        </button>
      </div>

      {/* Shell */}
      <div className="flex">
        {/* Icon rail (like Supabase) */}
        <div className="w-12 border-r bg-white min-h-[calc(100vh-56px)] flex flex-col items-center py-3 space-y-4 text-gray-500">
          <button title="Home" onClick={() => navigate('/dashboard')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">🏠</button>
          <button title="Projects" onClick={() => navigate('/dashboard')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">📦</button>
          <button title="Usage" className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">📈</button>
          <button title="Settings" className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">⚙️</button>
        </div>

        {/* Sidebar */}
        <aside className="w-60 border-r bg-white min-h-[calc(100vh-56px)] p-3">
          <div className="text-xs uppercase text-gray-400 px-2 mb-2">Navigation</div>
          <nav className="space-y-1">
            <button onClick={() => navigate('/dashboard')} className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-sm">Overview</button>
            <div className="text-xs uppercase text-gray-400 px-2 mt-4 mb-2">Stores</div>
            {stores.map((s) => (
              <div key={s._id} className="px-2 py-1">
                <div className="text-sm font-medium">{s.storeName}</div>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  <button onClick={() => navigate(`/dashboard/store/${s._id}/chatbox`)} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100">AI Builder</button>
                  <button onClick={() => { localStorage.setItem('editorStoreId', s._id); navigate(`/dashboard/store/${s._id}/editor`); }} className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100">Editor</button>
                  <button onClick={() => navigate(`/dashboard/products?storeId=${s._id}`)} className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-700 hover:bg-gray-100 col-span-2">Products</button>
                </div>
              </div>
            ))}
          </nav>
          <div className="mt-4">
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
              {showCreateForm ? 'Cancel' : 'Create Store'}
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Projects header controls */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Projects</h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input placeholder="Search for a store" className="pl-8 pr-3 py-2 border rounded text-sm w-64" onChange={() => {}} />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
              </div>
              <button title="Grid" className="px-2 py-2 border rounded text-sm">▥</button>
              <button title="List" className="px-2 py-2 border rounded text-sm">≡</button>
              <button onClick={() => setShowCreateForm(!showCreateForm)} className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm">+ New project</button>
            </div>
          </div>

          {/* Create Store Form */}
          {showCreateForm && (
            <div className="mb-6 p-4 bg-white border rounded">
              <h3 className="text-lg font-medium mb-3">Create New Store</h3>
              <form onSubmit={handleCreateStore} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Store Name</label>
                    <input type="text" value={newStore.storeName} onChange={(e) => setNewStore({ ...newStore, storeName: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="My Awesome Store" disabled={createStoreLoading} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Domain</label>
                    <input type="text" value={newStore.domain} onChange={(e) => setNewStore({ ...newStore, domain: e.target.value.toLowerCase() })} className="w-full px-3 py-2 border rounded" placeholder="mystore" disabled={createStoreLoading} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                  <textarea rows={3} value={newStore.description} onChange={(e) => setNewStore({ ...newStore, description: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Brief description of your store..." disabled={createStoreLoading} />
                </div>
                <button type="submit" disabled={createStoreLoading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                  {createStoreLoading ? 'Creating...' : 'Create Store'}
                </button>
              </form>
            </div>
          )}

          {/* Overview cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {stores.map((store) => (
              <div key={store._id} className="bg-white border rounded p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold">{store.storeName}</div>
                    <div className="text-xs text-gray-500">{store.domain}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/dashboard/store/${store._id}/chatbox`)} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100">AI Builder</button>
                    <button onClick={() => { localStorage.setItem('editorStoreId', store._id); navigate(`/dashboard/store/${store._id}/editor`); }} className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100">Editor</button>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <span className="mr-2">Created: {new Date(store.createdAt).toLocaleDateString?.() || '-'}</span>
                  <span>Approved: {store.approved ? 'Yes' : 'No'}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => navigate(`/dashboard/products?storeId=${store._id}`)} className="px-3 py-1 text-sm border rounded">Products</button>
                  <button onClick={() => handleDeleteStore(store._id)} className="px-3 py-1 text-sm border rounded text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;