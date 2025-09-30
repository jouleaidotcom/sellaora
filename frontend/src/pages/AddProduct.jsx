import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productAPI } from '../utils/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('storeId') || '';

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const fileNames = Array.from(files || []).map((f) => f.name);
      setForm((f) => ({ ...f, images: fileNames }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!storeId) {
      setError('Missing storeId');
      return;
    }
    try {
      setLoading(true);
      await productAPI.create({
        storeId,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images,
      });
      navigate(`/dashboard/products?storeId=${storeId}`);
    } catch (e) {
      setError(e.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" value={form.name} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" step="0.01" name="price" value={form.price} onChange={onChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={onChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <input type="file" name="images" multiple onChange={onChange} className="w-full" />
          <p className="text-xs text-gray-500 mt-1">MVP: stores file names only</p>
        </div>
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
};

export default AddProduct;


