import React from 'react';

// Note: The surrounding browser chrome is now provided by DeviceFrame.
// Keep this component minimal (no outer borders) to avoid double frames.
const Navbar = ({ logo, links = [], bgColor = '#ffffff', textColor = '#1f2937' }) => (
  <div className="mb-4 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-sm" style={{ color: textColor }}>
    <div className="px-5 py-3 flex items-center justify-between">
      <div className="font-semibold text-base" style={{ color: textColor }}>{logo || 'Logo'}</div>
      <div className="flex gap-5 text-sm">
        {links.map((l, i) => (
          <span key={i} className="opacity-80 hover:opacity-100 cursor-default" style={{ color: textColor }}>{l.text || 'Link'}</span>
        ))}
      </div>
    </div>
    <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
  </div>
);

const HeroSection = ({ title, subtitle, imageUrl }) => (
  <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden mb-5 shadow-sm">
    {imageUrl ? (
      <img src={imageUrl} alt={title || 'Hero'} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-neutral-400">Hero Image</div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-white text-3xl font-bold drop-shadow-sm">{title || 'Hero Title'}</h2>
      {subtitle && <p className="text-white/90 mt-2 max-w-xl">{subtitle}</p>}
    </div>
  </div>
);

const TextBlock = ({ content, heading }) => (
  <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-5 shadow-sm">
    {heading && <h3 className="text-lg font-semibold mb-2">{heading}</h3>}
    <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">{content || 'Text content'}</p>
  </div>
);

const Features = ({ title, items = [] }) => (
  <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-5 shadow-sm">
    <h3 className="text-lg font-semibold mb-4">{title || 'Features'}</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it, j) => (
        <div key={j} className="p-4 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow bg-white">
          <div className="text-2xl mb-1">{it.icon || '⭐'}</div>
          <div className="font-semibold">{it.title || 'Feature'}</div>
          <div className="text-sm text-neutral-600">{it.description || ''}</div>
        </div>
      ))}
    </div>
  </div>
);

const Footer = ({ companyName, tagline, links = [], bgColor = '#1f2937', textColor = '#f3f4f6' }) => (
  <div className="rounded-xl border border-neutral-200 p-5 mb-5 shadow-sm" style={{ backgroundColor: bgColor, color: textColor }}>
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
      <div className="p-4">
        <div className="mb-4 flex items-center gap-3">
          {logoUrl && <img src={logoUrl} alt="logo" className="w-10 h-10 rounded" />}
          <div className="h-8 px-3 rounded text-white flex items-center shadow" style={{ backgroundColor: primary }}>
            Theme Primary
          </div>
        </div>

        {bannerUrl && (
          <div className="mb-5 rounded-xl overflow-hidden shadow-sm">
            <img src={bannerUrl} alt="banner" className="w-full h-40 object-cover" />
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
            <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-4 mb-5 text-sm text-neutral-500">
              Unsupported section type: {section.type}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StorePreview;


