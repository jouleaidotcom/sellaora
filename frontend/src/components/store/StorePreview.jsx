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

const Collection = ({ title, items = [] }) => (
  <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-5 shadow-sm">
    <h3 className="text-lg font-semibold mb-4">{title || 'Products'}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, j) => (
        <div key={j} className="border border-neutral-200 rounded-xl p-3 hover:shadow-md transition-shadow bg-white">
          {item.image && (
            <div className="w-full h-32 mb-2 rounded-lg overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="font-medium text-sm">{item.name || 'Product'}</div>
          <div className="text-lg font-bold text-green-600">{item.price || '$0.00'}</div>
          {item.description && <div className="text-xs text-neutral-600 mt-1">{item.description}</div>}
        </div>
      ))}
    </div>
  </div>
);

const Testimonials = ({ title, items = [] }) => (
  <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-5 mb-5 shadow-sm">
    <h3 className="text-lg font-semibold mb-4 text-center">{title || 'Testimonials'}</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, j) => (
        <div key={j} className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-yellow-400 mb-2">{'⭐'.repeat(item.rating || 5)}</div>
          <p className="text-sm text-neutral-700 mb-3">"{item.text || 'Great product!'}"</p>
          <div className="flex items-center gap-2">
            {item.avatar && <img src={item.avatar} alt={item.name} className="w-6 h-6 rounded-full" />}
            <span className="text-xs font-medium">{item.name || 'Customer'}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Pricing = ({ title, items = [] }) => (
  <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-5 shadow-sm">
    <h3 className="text-lg font-semibold mb-4 text-center">{title || 'Pricing'}</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, j) => (
        <div key={j} className={`p-4 rounded-xl border-2 ${item.featured ? 'border-blue-500 bg-blue-50' : 'border-neutral-200 bg-white'}`}>
          <div className="text-center">
            <h4 className="font-semibold">{item.name || 'Plan'}</h4>
            <div className="text-2xl font-bold mt-2">{item.price || '$0'}</div>
            {item.features && (
              <ul className="text-sm text-neutral-600 mt-3 space-y-1">
                {item.features.map((feature, k) => (
                  <li key={k}>✓ {feature}</li>
                ))}
              </ul>
            )}
            <button className={`mt-4 px-4 py-2 rounded text-sm font-medium ${item.featured ? 'bg-blue-500 text-white' : 'bg-neutral-100 text-neutral-700'}`}>
              {item.buttonText || 'Choose Plan'}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CTA = ({ title, subtitle, buttonText, bgColor = '#2563eb', textColor = '#ffffff' }) => (
  <div className="rounded-xl border border-neutral-200 p-8 mb-5 shadow-sm text-center" style={{ backgroundColor: bgColor, color: textColor }}>
    <h3 className="text-xl font-bold mb-2">{title || 'Call to Action'}</h3>
    {subtitle && <p className="opacity-90 mb-4">{subtitle}</p>}
    <button className="bg-white text-neutral-800 px-6 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
      {buttonText || 'Get Started'}
    </button>
  </div>
);

const Gallery = ({ title, images = [] }) => (
  <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-5 shadow-sm">
    <h3 className="text-lg font-semibold mb-4">{title || 'Gallery'}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {images.map((img, j) => (
        <div key={j} className="aspect-square rounded-lg overflow-hidden">
          <img src={img.url || img} alt={img.caption || 'Gallery image'} className="w-full h-full object-cover" />
          {img.caption && <p className="text-xs text-neutral-600 mt-1">{img.caption}</p>}
        </div>
      ))}
    </div>
  </div>
);

const Newsletter = ({ title, subtitle, buttonText, bgColor = '#f3f4f6', textColor = '#1f2937' }) => (
  <div className="rounded-xl border border-neutral-200 p-6 mb-5 shadow-sm text-center" style={{ backgroundColor: bgColor, color: textColor }}>
    <h3 className="text-lg font-semibold mb-2">{title || 'Newsletter'}</h3>
    {subtitle && <p className="text-sm opacity-80 mb-4">{subtitle}</p>}
    <div className="flex gap-2 max-w-md mx-auto">
      <input type="email" placeholder="Enter your email" className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium">
        {buttonText || 'Subscribe'}
      </button>
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
          if (type === 'collection') {
            return <Collection key={idx} title={section.title} items={section.items || []} />;
          }
          if (type === 'testimonials') {
            return <Testimonials key={idx} title={section.title} items={section.items || []} />;
          }
          if (type === 'pricing') {
            return <Pricing key={idx} title={section.title} items={section.items || []} />;
          }
          if (type === 'cta') {
            return (
              <CTA 
                key={idx} 
                title={section.title} 
                subtitle={section.subtitle} 
                buttonText={section.buttonText}
                bgColor={section.bgColor}
                textColor={section.textColor}
              />
            );
          }
          if (type === 'gallery') {
            return <Gallery key={idx} title={section.title} images={section.images || []} />;
          }
          if (type === 'newsletter') {
            return (
              <Newsletter 
                key={idx} 
                title={section.title} 
                subtitle={section.subtitle} 
                buttonText={section.buttonText}
                bgColor={section.bgColor}
                textColor={section.textColor}
              />
            );
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


