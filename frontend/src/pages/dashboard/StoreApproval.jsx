import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { storeAPI } from '../../utils/api';
import LivePreview from '../../components/editor/LivePreview';

const StoreApproval = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await storeAPI.getEditorData(storeId);
        if (res.success) {
          setStore(res.data.store);
          setProducts(res.data.products || []);
        } else {
          setError('Failed to load store');
        }
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [storeId]);

  const handleApprove = async () => {
    try {
      await storeAPI.approveStore(storeId);
      navigate(`/dashboard/store/${storeId}/editor`);
    } catch (e) {
      setError(e.message || 'Failed to approve');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white p-4 space-y-4">
        <h2 className="text-xl font-semibold">Approval</h2>
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 rounded">{error}</div>
        )}
        <div className="space-y-2">
          <button onClick={handleApprove} className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Approve & Edit</button>
          <Link to={`/dashboard/store/${storeId}/chatbox`} className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">Try Again</Link>
        </div>
        {/* Optional summary */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">AI Summary</h3>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Sections: {Array.isArray(store?.layout?.sections) ? store.layout.sections.length : 0}</li>
            <li>Products: {products.length}</li>
            <li>Theme: {store?.theme ? 'Custom' : 'Default'}</li>
          </ul>
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <LivePreview store={store} products={products} />
        </div>
      </div>
    </div>
  );
};

export default StoreApproval;


