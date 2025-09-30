import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI } from '../utils/api';

const Products = () => {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('storeId');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!storeId) return;
      setLoading(true);
      setError('');
      try {
        const res = await productAPI.listByStore(storeId);
        setProducts(res.data.products || []);
      } catch (e) {
        setError(e.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [storeId]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productAPI.remove(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link to={`/dashboard/products/new?storeId=${storeId || ''}`} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Product
        </Link>
      </div>
      {!storeId && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">Select a store to view products.</div>
      )}
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border rounded p-4 bg-white">
              <div className="font-medium text-lg">{p.name}</div>
              <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-gray-800">${p.price} • Stock: {p.stock}</span>
                <div className="space-x-2">
                  <Link to={`/dashboard/products/${p._id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && storeId && (
            <div className="text-gray-600">No products yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;


