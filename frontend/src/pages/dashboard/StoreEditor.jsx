import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storeAPI } from '../../utils/api';
import Sidebar from '../../components/editor/Sidebar';
import LivePreview from '../../components/editor/LivePreview';

const StoreEditor = () => {
  const { storeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await storeAPI.getEditorData(storeId);
        if (res.success) {
          setStore(res.data.store);
          setProducts(res.data.products || []);
        } else {
          setError('Failed to load editor data');
        }
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [storeId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { layout: store?.layout, theme: store?.theme };
      const res = await storeAPI.saveEditorUpdate(storeId, payload);
      if (res.success) {
        setStore(res.data.store);
        setProducts(res.data.products || []);
      } else {
        setError('Failed to save changes');
      }
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {!collapsed && (
        <Sidebar store={store} products={products} onChange={setStore} onSave={handleSave} />
      )}

      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">{store?.storeName}</div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCollapsed(!collapsed)} className="px-3 py-1 bg-gray-100 rounded">{collapsed? 'Expand Sidebar':'Collapse Sidebar'}</button>
              <button disabled={saving} onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50">{saving? 'Saving...':'Save'}</button>
            </div>
          </div>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded">{error}</div>
          )}
          <LivePreview store={store} products={products} />
        </div>
      </div>
    </div>
  );
};

export default StoreEditor;


