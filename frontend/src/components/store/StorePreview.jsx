import React from 'react';

const Navbar = ({ logo, links = [], bgColor = '#ffffff', textColor = '#1f2937' }) => (
  <div className="mb-4 rounded border" style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="px-4 py-3 flex items-center gap-6">
      <div className="font-bold text-lg">{logo || 'Logo'}</div>
      <div className="flex gap-4 text-sm">
        {links.map((l, i) => (
          <span key={i} className="opacity-80 hover:opacity-100 cursor-default">{l.text || 'Link'}</span>
        ))}
      </div>
    </div>
  </div>
);

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

const TextBlock = ({ content, heading }) => (
  <div className="bg-white rounded-lg border p-4 mb-4">
    {heading && <h3 className="text-lg font-semibold mb-2">{heading}</h3>}
    <p className="text-gray-700 whitespace-pre-wrap">{content || 'Text content'}</p>
  </div>
);

const Features = ({ title, items = [] }) => (
  <div className="bg-white rounded-lg border p-4 mb-4">
    <h3 className="text-lg font-semibold mb-3">{title || 'Features'}</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it, j) => (
        <div key={j} className="p-3 rounded border">
          <div className="text-2xl mb-2">{it.icon || '⭐'}</div>
          <div className="font-semibold">{it.title || 'Feature'}</div>
          <div className="text-sm text-gray-600">{it.description || ''}</div>
        </div>
      ))}
    </div>
  </div>
);

const Footer = ({ companyName, tagline, links = [], bgColor = '#1f2937', textColor = '#f3f4f6' }) => (
  <div className="rounded border p-4 mb-4" style={{ backgroundColor: bgColor, color: textColor }}>
    <div className="text-center">
      <div className="font-semibold">{companyName || 'Company Name'}</div>
      {tagline && <div className="text-sm opacity-80">{tagline}</div>}
      <div className="flex gap-4 justify-center mt-3 flex-wrap text-sm">
        {links.map((l, i) => (
          <span key={i} className="hover:opacity-90 cursor-default">{l.text || 'Link'}</span>
        ))}
      </div>
    </div>
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

      {(
        Array.isArray(layout?.pages)
          ? (layout.pages[0]?.sections || [])
          : (layout?.sections || [])
      ).map((section, idx) => {
        const type = String(section.type || '').toLowerCase();
        if (type === 'navbar') {
          return (
            <Navbar
              key={idx}
              logo={section.logo}
              links={section.links}
              bgColor={section.bgColor}
              textColor={section.textColor}
            />
          );
        }
        if (type === 'hero') {
          return <HeroSection key={idx} title={section.title} subtitle={section.subtitle} imageUrl={section.image || section.imageUrl} />;
        }
        if (type === 'features' || type === 'featuredproducts') {
          return <Features key={idx} title={section.title} items={section.items || []} />;
        }
        if (type === 'textblock') {
          return <TextBlock key={idx} heading={section.heading} content={section.content} />;
        }
        if (type === 'footer') {
          return (
            <Footer
              key={idx}
              companyName={section.companyName}
              tagline={section.tagline}
              links={section.links}
              bgColor={section.bgColor}
              textColor={section.textColor}
            />
          );
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


