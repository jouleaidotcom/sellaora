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
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
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
        navigate(`/editor/${created._id}`, {state : {storeName: created.storeName}});
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

  const filteredStores = stores.filter(store => 
    store.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Top Navigation */}
      <div className="h-12 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">S</div>
            <span className="font-bold text-base tracking-tight">Sellaora</span>
          </div>
          <div className="w-px h-4 bg-neutral-700"></div>
          <div className="text-sm text-neutral-400 font-medium">{user?.organizationName || 'Your Organization'}</div>
          <span className="px-2.5 py-1 bg-neutral-800/80 text-neutral-300 rounded-md text-xs font-semibold border border-neutral-700/50">Free</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800/60 rounded-md text-sm font-medium transition-all">Feedback</button>
          <button className="w-8 h-8 rounded-md bg-neutral-800/60 hover:bg-neutral-700/80 border border-neutral-700/50 flex items-center justify-center transition-all group">
            <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-md bg-neutral-800/60 hover:bg-neutral-700/80 border border-neutral-700/50 flex items-center justify-center transition-all group">
            <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
          <button onClick={handleLogout} className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-52 border-r border-neutral-800 bg-neutral-900/30 min-h-[calc(100vh-48px)] p-3">
          <nav className="space-y-0.5">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-neutral-800/80 text-white border border-neutral-700/50 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Store</span>
            </button>
            <button onClick={() => navigate('/dashboard/team')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Team</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              <span>Integrations</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Usage</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Billing</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Organization settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-950/50 border border-red-900 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-1 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Stores</h1>
            <p className="text-neutral-500 text-sm font-medium">Manage and monitor your stores</p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search for a project"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-neutral-900/80 border border-neutral-800 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 w-80 transition-all font-medium"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="p-2.5 hover:bg-neutral-800 rounded-lg border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-all group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg border transition-all ${viewMode === 'grid' ? 'bg-neutral-800 border-neutral-700 text-emerald-400 shadow-sm' : 'border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 3H3v7h7V3zm11 0h-7v7h7V3zM10 14H3v7h7v-7zm11 0h-7v7h7v-7z" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg border transition-all ${viewMode === 'list' ? 'bg-neutral-800 border-neutral-700 text-emerald-400 shadow-sm' : 'border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>New store</span>
              </button>
            </div>
          </div>

          {/* Create Store Form */}
          {showCreateForm && (
            <div className="mb-6 p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl shadow-2xl">
              <h3 className="text-xl font-bold mb-1">Create New Store</h3>
              <p className="text-neutral-500 text-sm mb-5">Set up your new e-commerce project</p>
              <form onSubmit={handleCreateStore} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-300">Store Name</label>
                    <input 
                      type="text" 
                      value={newStore.storeName} 
                      onChange={(e) => setNewStore({ ...newStore, storeName: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium" 
                      placeholder="My Awesome Store" 
                      disabled={createStoreLoading} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-300">Domain</label>
                    <input 
                      type="text" 
                      value={newStore.domain} 
                      onChange={(e) => setNewStore({ ...newStore, domain: e.target.value.toLowerCase() })} 
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium" 
                      placeholder="mystore" 
                      disabled={createStoreLoading} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-neutral-300">Description (Optional)</label>
                  <textarea 
                    rows={3} 
                    value={newStore.description} 
                    onChange={(e) => setNewStore({ ...newStore, description: e.target.value })} 
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium resize-none" 
                    placeholder="Brief description of your store..." 
                    disabled={createStoreLoading} 
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit" 
                    disabled={createStoreLoading} 
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
                  >
                    {createStoreLoading ? 'Creating...' : 'Create Store'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-5 py-2.5 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 border border-neutral-700 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects Grid */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filteredStores.map((store) => (
              <div 
                key={store._id} 
                className="group bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-lg p-5 transition-all cursor-pointer"
                onClick={() => navigate(`/dashboard/store/${store._id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-sm font-bold">
                      {store.storeName[0]?.toUpperCase() || 'S'}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-100 group-hover:text-emerald-400 transition-colors">{store.storeName}</div>
                      <div className="text-xs text-neutral-500 flex items-center gap-2">
                        <span>0 Products</span>
                        <span>|</span>
                        <span>{store.domain}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/store/${store._id}`);
                    }}
                    className="text-neutral-500 hover:text-neutral-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-neutral-500 text-xs">
                    <div className={`w-2 h-2 rounded-full ${store.approved ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    <span>{store.approved ? 'Project is active' : 'Project is paused'}</span>
                  </div>
                  <button className="text-neutral-500 hover:text-neutral-300 ml-auto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                <div className="flex gap-2 pt-3 border-t border-neutral-800" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/store/${store._id}/chatbox`);
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-emerald-600/10 text-emerald-400 rounded hover:bg-emerald-600/20 border border-emerald-600/20"
                  >
                    AI Builder
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem('editorStoreId', store._id);
                      navigate(`/dashboard/store/${store._id}/editor`);
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
                  >
                    Editor
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Route to products page for this store so users can add products
                      navigate(`/dashboard/products?storeId=${store._id}`);
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
                  >
                    Products
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStore(store._id);
                    }}
                    className="px-3 py-1.5 text-xs text-red-400 rounded hover:bg-red-950/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-12">
              <div className="text-neutral-500 mb-2">No projects found</div>
              <p className="text-neutral-600 text-sm">Create your first store to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;