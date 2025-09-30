import React from 'react';

const HeroSection = ({ title, subtitle, imageUrl }) => (
  <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden mb-4">
    {imageUrl ? (
      <img src={imageUrl} alt={title || 'Hero'} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Hero Image</div>
    )}
    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-white text-2xl font-bold">{title || 'Hero Title'}</h2>
      {subtitle && <p className="text-white/90 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const TextBlock = ({ content }) => (
  <div className="bg-white rounded-lg border p-4 mb-4">
    <p className="text-gray-700 whitespace-pre-wrap">{content || 'Text content'}</p>
  </div>
);

const FeaturedProducts = ({ productIds }) => (
  <div className="bg-white rounded-lg border p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">Featured Products</h3>
    {Array.isArray(productIds) && productIds.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {productIds.map((id) => (
          <span key={id} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">{id}</span>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-sm">No featured products selected</p>
    )}
  </div>
);

const StorePreview = ({ theme, layout }) => {
  const primary = theme?.primaryColor || '#2563eb';
  const bannerUrl = theme?.bannerUrl;
  const logoUrl = theme?.logoUrl;
  const fontFamily = theme?.fonts || 'Inter, ui-sans-serif, system-ui';

  return (
    <div className="w-full" style={{ fontFamily }}>
      <div className="mb-4 flex items-center gap-3">
        {logoUrl && <img src={logoUrl} alt="logo" className="w-10 h-10 rounded" />}
        <div className="h-8 px-3 rounded text-white flex items-center" style={{ backgroundColor: primary }}>
          Theme Primary
        </div>
      </div>

      {bannerUrl && (
        <div className="mb-4">
          <img src={bannerUrl} alt="banner" className="w-full h-40 object-cover rounded" />
        </div>
      )}

      {(layout?.sections || []).map((section, idx) => {
        if (section.type === 'hero') {
          return <HeroSection key={idx} title={section.title} subtitle={section.subtitle} imageUrl={section.imageUrl} />;
        }
        if (section.type === 'featuredProducts') {
          return <FeaturedProducts key={idx} productIds={section.productIds} />;
        }
        if (section.type === 'textBlock') {
          return <TextBlock key={idx} content={section.content} />;
        }
        return (
          <div key={idx} className="bg-white rounded-lg border p-4 mb-4 text-sm text-gray-500">
            Unsupported section type: {section.type}
          </div>
        );
      })}
    </div>
  );
};

export default StorePreview;


