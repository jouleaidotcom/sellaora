const FeaturedProducts = ({ section, products }) => {
  const featuredIds = section.productIds || [];
  const featured = featuredIds.length ? products.filter(p => featuredIds.includes(p._id)) : products.slice(0, 4);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {featured.map(p => (
          <div key={p._id} className="border rounded p-3 bg-white">
            <div className="font-medium text-sm">{p.name}</div>
            <div className="text-xs text-gray-500">${'{'}p.price{'}'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;


