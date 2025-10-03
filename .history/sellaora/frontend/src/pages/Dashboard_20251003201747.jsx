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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* User Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Account</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-gray-800">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stores Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Your Stores</h2>
              <p className="text-gray-600">Manage your online stores</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showCreateForm ? 'Cancel' : 'Create Store'}
            </button>
          </div>

          {/* Create Store Form */}
          {showCreateForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Store</h3>
              <form onSubmit={handleCreateStore} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      value={newStore.storeName}
                      onChange={(e) => setNewStore({ ...newStore, storeName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="My Awesome Store"
                      disabled={createStoreLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                      Domain
                    </label>
                    <input
                      type="text"
                      id="domain"
                      value={newStore.domain}
                      onChange={(e) => setNewStore({ ...newStore, domain: e.target.value.toLowerCase() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="mystore"
                      disabled={createStoreLoading}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={newStore.description}
                    onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your store..."
                    disabled={createStoreLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={createStoreLoading}
                  className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createStoreLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Store...
                    </span>
                  ) : (
                    'Create Store'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Stores List */}
          {stores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't created any stores yet.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Create your first store
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {stores.map((store) => (
                <div key={store._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <button
                        onClick={() => navigate(`/dashboard/products?storeId=${store._id}`)}
                        className="text-left text-lg font-semibold text-blue-600 hover:underline"
                      >
                        {store.storeName}
                      </button>
                      <p className="text-gray-600 mb-2">
                        Domain: <span className="font-mono text-sm">{store.domain}</span>
                      </p>
                      {store.description && (
                        <p className="text-gray-600 text-sm mb-2">{store.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created: {new Date(store.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${store.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                          {store.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteStore(store._id)}
                        className="text-red-600 hover:text-red-800 text-sm px-3 py-1 hover:bg-red-50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
navigate("/editor", { state: { storeName: newStore.storeName } });

export default Dashboard