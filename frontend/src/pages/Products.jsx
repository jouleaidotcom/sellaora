import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { productAPI, storeAPI } from '../utils/api';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('storeId');

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [viewMode, setViewMode] = useState('grid'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); 
  const [sortDir, setSortDir] = useState('asc'); 
  const [status, setStatus] = useState('all');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadContext = async () => {
      if (!storeId) return;
      try {
        const res = await storeAPI.getStoreById(storeId);
        if (res.success) setStore(res.data.store);
      } catch (e) {
        // Non-fatal for listing, just omit store header
      }
    };
    loadContext();
  }, [storeId]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!storeId) return;
      setLoading(true);
      setError('');
      try {
        const params = {
          page,
          limit,
          search: searchQuery || undefined,
          sortBy,
          sortDir,
          status: status === 'all' ? undefined : status,
        };
        const res = await productAPI.listByStore(storeId, params);
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
      } catch (e) {
        setError(e.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [storeId, page, limit, searchQuery, sortBy, sortDir, status]);

  // Using server-side filtering/sort/pagination; keep memo to pass-through
  const filteredSorted = useMemo(() => products, [products]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.remove(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  // Bulk selection
  const [selected, setSelected] = useState(() => new Set());
  const toggleSelect = (id) => {
    setSelected((s) => {
      const ns = new Set(s);
      if (ns.has(id)) ns.delete(id); else ns.add(id);
      return ns;
    });
  };
  const selectAllOnPage = () => {
    setSelected((s) => {
      const ns = new Set(s);
      products.forEach((p) => ns.add(p._id));
      return ns;
    });
  };
  const clearSelection = () => setSelected(new Set());
  const doBulk = async (action) => {
    if (selected.size === 0) return;
    if (action === 'delete' && !window.confirm('Delete selected products?')) return;
    try {
      await productAPI.bulkAction(action, Array.from(selected));
      // Refetch current page
      clearSelection();
      const params = { page, limit, search: searchQuery || undefined, sortBy, sortDir, status: status === 'all' ? undefined : status };
      const res = await productAPI.listByStore(storeId, params);
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      alert(e.message || 'Bulk action failed');
    }
  };

  // Currency formatting
  const formatPrice = (value) => {
    const currency = store?.currency || 'USD';
    const locale = store?.locale || (navigator.language || 'en-US');
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(value || 0));
    } catch {
      const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
      return `${symbol}${Number(value || 0).toFixed(2)}`;
    }
  };

  const getThumb = (p) => {
    const first = Array.isArray(p.images) ? p.images[0] : undefined;
    if (first && (String(first).startsWith('http') || String(first).startsWith('/'))) return first;
    // Fallback to generated initials avatar
    const seed = encodeURIComponent(p.name || 'Product');
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
  };

  // Inline editing
  const [editing, setEditing] = useState({}); // { [id]: { price, stock, saving } }
  const startEdit = (p) => setEditing((e) => ({ ...e, [p._id]: { price: p.price, stock: p.stock, saving: false } }));
  const cancelEdit = (id) => setEditing((e) => { const ne = { ...e }; delete ne[id]; return ne; });
  const commitEdit = async (id) => {
    const payload = editing[id];
    if (!payload) return;
    try {
      setEditing((e) => ({ ...e, [id]: { ...e[id], saving: true } }));
      const res = await productAPI.update(id, { price: Number(payload.price), stock: Number(payload.stock) });
      setProducts((prev) => prev.map((p) => (p._id === id ? res.data.product : p)));
      cancelEdit(id);
    } catch (e) {
      alert(e.message || 'Save failed');
      setEditing((st) => ({ ...st, [id]: { ...st[id], saving: false } }));
    }
  };

  // Layout
  if (!storeId) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <button onClick={() => navigate('/dashboard')} className="text-sm text-neutral-400 hover:text-white">← Back to Stores</button>
          </div>
          <div className="p-4 bg-amber-950/40 border border-amber-900 rounded-lg text-amber-300">
            Select a store first. Tip: open a store from the dashboard, then click Products.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="h-12 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/dashboard/store/${storeId}`)} className="text-neutral-400 hover:text-white">←</button>
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center font-bold text-white">
            {(store?.storeName?.[0] || 'S').toUpperCase()}
          </div>
          <div className="text-sm font-semibold">{store?.storeName || 'Products'}</div>
          {store?.domain && (
            <span className="px-2 py-0.5 bg-neutral-800/80 text-neutral-300 rounded text-xs border border-neutral-700/50">{store.domain}</span>
          )}
        </div>
        <div>
          <Link to={`/dashboard/products/new?storeId=${storeId}`} className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-md text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all">
            Add Product
          </Link>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Bulk actions bar */}
        {selected.size > 0 && (
          <div className="mb-4 p-3 bg-neutral-900/70 border border-neutral-800 rounded-lg flex items-center gap-2 text-sm">
            <div className="text-neutral-300">Selected: {selected.size}</div>
            <button onClick={() => doBulk('publish')} className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 rounded border border-emerald-600/30">Publish</button>
            <button onClick={() => doBulk('unpublish')} className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Unpublish</button>
            <button onClick={() => doBulk('delete')} className="px-3 py-1.5 text-red-400 rounded hover:bg-red-950/30">Delete</button>
            <button onClick={clearSelection} className="ml-auto px-3 py-1.5 text-neutral-400 hover:text-neutral-200">Clear</button>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-neutral-900/80 border border-neutral-800 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 w-72 transition-all font-medium"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="px-3 py-2.5 bg-neutral-900/80 border border-neutral-800 rounded-lg text-sm text-neutral-100"
            >
              <option value="name">Sort: Name</option>
              <option value="price">Sort: Price</option>
              <option value="stock">Sort: Stock</option>
              <option value="createdAt">Sort: Newest</option>
            </select>
            <button
              onClick={() => { setSortDir((d) => (d === 'asc' ? 'desc' : 'asc')); setPage(1); }}
              className="px-3 py-2.5 bg-neutral-900/80 border border-neutral-800 rounded-lg text-sm text-neutral-300 hover:text-white"
              title={`Toggle ${sortDir}`}
            >
              {sortDir === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            {['all','draft','published'].map((s) => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg border text-sm ${status===s ? 'bg-neutral-800 border-neutral-700 text-emerald-400' : 'border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'}`}
              >{s[0].toUpperCase()+s.slice(1)}</button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
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
          </div>
        </div>

        {/* Content */}
        {error && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : filteredSorted.length === 0 ? (
          <div className="text-center py-16 border border-neutral-800 rounded-xl bg-neutral-900/40">
            <div className="text-neutral-400 mb-2">No products found</div>
            <div className="text-neutral-500 text-sm mb-4">Create your first product to get started</div>
            <Link to={`/dashboard/products/new?storeId=${storeId}`} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold">Add Product</Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSorted.map((p) => (
              <div key={p._id} className="group bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-lg p-4 transition-all">
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <input type="checkbox" className="mt-1 accent-emerald-500" checked={selected.has(p._id)} onChange={() => toggleSelect(p._id)} />

                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
<img src={getThumb(p)} alt={p.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-100 group-hover:text-emerald-400 transition-colors truncate">{p.name}</div>
                        <div className="text-xs text-neutral-500 line-clamp-2">{p.description}</div>
                        <div className="mt-1 text-xs">
                          <span className={`px-2 py-0.5 rounded border ${p.status==='published' ? 'text-emerald-400 border-emerald-700/50 bg-emerald-600/10' : 'text-neutral-400 border-neutral-700 bg-neutral-800/50'}`}>{p.status || 'draft'}</span>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-300 font-medium">{formatPrice(p.price)}</div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                      <span>Stock: {p.stock}</span>
                    </div>

                    {/* Inline edit controls */}
                    {editing[p._id] ? (
                      <div className="flex items-center gap-2 pt-2">
<input type="number" min={0} step="0.01" value={editing[p._id].price} onChange={(e) => setEditing((st) => ({ ...st, [p._id]: { ...st[p._id], price: e.target.value } }))} onKeyDown={(e)=>{ if(e.key==='Enter') commitEdit(p._id); if(e.key==='Escape') cancelEdit(p._id); }} className="w-24 px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-sm" />
<input type="number" min={0} step={1} value={editing[p._id].stock} onChange={(e) => setEditing((st) => ({ ...st, [p._id]: { ...st[p._id], stock: e.target.value } }))} onKeyDown={(e)=>{ if(e.key==='Enter') commitEdit(p._id); if(e.key==='Escape') cancelEdit(p._id); }} className="w-24 px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-sm" />
                        <button disabled={editing[p._id].saving} onClick={() => commitEdit(p._id)} className="px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded border border-emerald-600/30 text-xs">{editing[p._id].saving ? 'Saving...' : 'Save'}</button>
                        <button onClick={() => cancelEdit(p._id)} className="px-2 py-1 text-neutral-400 hover:text-neutral-200 text-xs">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-2">
                        <button onClick={() => startEdit(p)} className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700">Inline Edit</button>
                        <Link to={`/dashboard/products/${p._id}/edit`} className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700">Edit</Link>
                        <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 text-xs text-red-400 rounded hover:bg-red-950/30">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSorted.map((p) => (
              <div key={p._id} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 flex items-center gap-4">
                <input type="checkbox" className="accent-emerald-500" checked={selected.has(p._id)} onChange={() => toggleSelect(p._id)} />
                <div className="w-12 h-12 rounded-md overflow-hidden bg-neutral-800 flex items-center justify-center text-neutral-400">
<img src={getThumb(p)} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-100 truncate">{p.name}</div>
                  <div className="text-sm text-neutral-500 line-clamp-1">{p.description}</div>
                  <div className="mt-1 text-xs">
                    <span className={`px-2 py-0.5 rounded border ${p.status==='published' ? 'text-emerald-400 border-emerald-700/50 bg-emerald-600/10' : 'text-neutral-400 border-neutral-700 bg-neutral-800/50'}`}>{p.status || 'draft'}</span>
                  </div>
                </div>
                <div className="w-32 text-right text-neutral-300 font-medium">{formatPrice(p.price)}</div>
                <div className="w-28 text-right text-neutral-400 text-sm">Stock: {p.stock}</div>
                <div className="flex items-center gap-2">
                  {editing[p._id] ? (
                    <>
<input type="number" min={0} step="0.01" value={editing[p._id].price} onChange={(e) => setEditing((st) => ({ ...st, [p._id]: { ...st[p._id], price: e.target.value } }))} onKeyDown={(e)=>{ if(e.key==='Enter') commitEdit(p._id); if(e.key==='Escape') cancelEdit(p._id); }} className="w-24 px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-sm" />
<input type="number" min={0} step={1} value={editing[p._id].stock} onChange={(e) => setEditing((st) => ({ ...st, [p._id]: { ...st[p._id], stock: e.target.value } }))} onKeyDown={(e)=>{ if(e.key==='Enter') commitEdit(p._id); if(e.key==='Escape') cancelEdit(p._id); }} className="w-24 px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-sm" />
                      <button disabled={editing[p._id].saving} onClick={() => commitEdit(p._id)} className="px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded border border-emerald-600/30 text-xs">{editing[p._id].saving ? 'Saving...' : 'Save'}</button>
                      <button onClick={() => cancelEdit(p._id)} className="px-2 py-1 text-neutral-400 hover:text-neutral-200 text-xs">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(p)} className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700">Inline Edit</button>
                      <Link to={`/dashboard/products/${p._id}/edit`} className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700">Edit</Link>
                      <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 text-xs text-red-400 rounded hover:bg-red-950/30">Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-neutral-500">Page {page} of {Math.max(1, Math.ceil(total / limit))} • {total} items</div>
          <div className="flex items-center gap-2">
            <select value={limit} onChange={(e) => { setLimit(parseInt(e.target.value) || 12); setPage(1); }} className="px-2 py-1.5 bg-neutral-900/80 border border-neutral-800 rounded text-sm text-neutral-300">
              {[6,12,24,48].map(n => <option key={n} value={n}>{n}/page</option>)}
            </select>
            <button disabled={page<=1} onClick={() => setPage((p) => Math.max(1, p-1))} className="px-3 py-1.5 bg-neutral-900/80 border border-neutral-800 rounded text-sm text-neutral-300 disabled:opacity-50">Prev</button>
            <button disabled={page>=Math.ceil(total/limit)} onClick={() => setPage((p) => p+1)} className="px-3 py-1.5 bg-neutral-900/80 border border-neutral-800 rounded text-sm text-neutral-300 disabled:opacity-50">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;


