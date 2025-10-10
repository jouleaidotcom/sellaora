import React from 'react';

// Very small, theme-aware primitives for auto rendering in the editor
const SectionCard = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const Title = ({ children }) => (
  <h3 className="text-xl font-semibold mb-3">{children}</h3>
);

const Sub = ({ children }) => (
  <p className="text-sm text-gray-600 mb-4">{children}</p>
);

const AutoSection = ({ section = {}, theme = {} }) => {
  const s = section || {};
  const t = String(s.type || '').toLowerCase();
  const title = s.title || s.heading;
  const subtitle = s.subtitle || s.subheading || s.description || s.tagline;
  const bg = s.bgColor || 'white';
  const text = s.textColor || '#111827';

  // Navbar-like
  if (Array.isArray(s.links) && (s.logo || t.includes('nav'))) {
    return (
      <div className="px-6 py-3 border-b" style={{ background: bg, color: text }}>
        <div className="flex items-center justify-between">
          <div className="font-bold">{s.logo || 'Logo'}</div>
          <div className="flex gap-4 text-sm">
            {s.links.map((l, i) => (
              <span key={i} className="opacity-80">{l.text || 'Link'}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Hero-like
  if (title && subtitle) {
    const img = s.backgroundUrl || s.imageUrl || s.image;
    return (
      <div className="text-center py-16 px-6" style={{ background: bg, color: text }}>
        {img && (
          <div className="max-w-3xl mx-auto mb-6 rounded overflow-hidden">
            <img src={img} alt={title} className="w-full h-48 object-cover" />
          </div>
        )}
        <h2 className="text-3xl font-extrabold mb-2">{title}</h2>
        <p className="opacity-80 max-w-2xl mx-auto">{subtitle}</p>
        {(s.buttonText || s.ctaButtonText) && (
          <div className="mt-6">
            <button className="px-5 py-2 bg-black text-white rounded">{s.buttonText || s.ctaButtonText}</button>
          </div>
        )}
      </div>
    );
  }

  // Collection / products
  if (Array.isArray(s.products) || (Array.isArray(s.items) && (s.items[0]?.image || typeof s.items[0]?.price !== 'undefined'))) {
    const items = Array.isArray(s.products) ? s.products : s.items;
    return (
      <SectionCard>
        {title && <Title>{title}</Title>}
        {subtitle && <Sub>{subtitle}</Sub>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(items || []).map((it, i) => (
            <div key={i} className="border rounded p-3 bg-white">
              {(it.image || it.imageUrl) && (
                <img src={it.image || it.imageUrl} alt={it.name || it.title} className="w-full h-24 object-cover rounded mb-2" />
              )}
              <div className="font-medium text-sm">{it.name || it.title || 'Item'}</div>
              {typeof it.price !== 'undefined' && (
                <div className="text-green-600 font-bold">{it.price}</div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  // Pricing
  if (Array.isArray(s.plans) || (Array.isArray(s.items) && Array.isArray(s.items[0]?.features))) {
    const plans = Array.isArray(s.plans) ? s.plans : s.items;
    return (
      <SectionCard>
        {title && <Title>{title}</Title>}
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((p, i) => (
            <div key={i} className="border rounded p-4 bg-white text-center">
              <div className="font-semibold">{p.name || 'Plan'}</div>
              <div className="text-2xl font-bold my-2">{p.price || '$0'}</div>
              <ul className="text-left text-sm text-gray-600 space-y-1">
                {(p.features || []).map((f, fi) => (
                  <li key={fi}>• {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  // Team
  if (Array.isArray(s.team)) {
    const team = s.team;
    return (
      <SectionCard>
        {title && <Title>{title}</Title>}
        {subtitle && <Sub>{subtitle}</Sub>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {team.map((m, i) => (
            <div key={i} className="bg-white border rounded p-4 text-center">
              {m.image && <img src={m.image} alt={m.name} className="w-20 h-20 mx-auto rounded-full object-cover mb-2" />}
              <div className="font-semibold">{m.name || 'Team Member'}</div>
              {m.title && <div className="text-xs text-gray-500 mb-1">{m.title}</div>}
              {m.bio && <div className="text-sm text-gray-600">{m.bio}</div>}
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  // Testimonials
  if (Array.isArray(s.testimonials) || (Array.isArray(s.items) && (s.items[0]?.text || s.items[0]?.quote))) {
    const items = Array.isArray(s.testimonials) ? s.testimonials : s.items;
    return (
      <SectionCard>
        {title && <Title>{title}</Title>}
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((it, i) => (
            <div key={i} className="border rounded p-4 bg-white">
              <div className="text-yellow-500 mb-1">{'★'.repeat(it.rating || 5)}</div>
              <div className="text-sm text-gray-700 italic">{it.text || it.quote || 'Great!'}</div>
              <div className="mt-2 text-xs text-gray-500">{it.name || it.author || 'Customer'}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  // Gallery
  if (Array.isArray(s.images)) {
    const images = s.images.map(img => (typeof img === 'string' ? img : (img.url || '')));
    return (
      <SectionCard>
        {title && <Title>{title}</Title>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <img key={i} src={src} alt="img" className="w-full h-28 object-cover rounded" />
          ))}
        </div>
      </SectionCard>
    );
  }

  // Newsletter
  if (t.includes('newsletter') || s.placeholderEmail) {
    return (
      <div className="text-center p-8" style={{ background: bg, color: text }}>
        <h3 className="text-xl font-semibold mb-2">{title || 'Newsletter'}</h3>
        {subtitle && <p className="opacity-80 mb-3">{subtitle}</p>}
        <div className="flex justify-center gap-2">
          <input disabled className="px-3 py-2 border rounded w-64" placeholder={s.placeholder || 'you@example.com'} />
          <button disabled className="px-4 py-2 bg-black text-white rounded">{s.ctaButtonText || s.buttonText || 'Subscribe'}</button>
        </div>
      </div>
    );
  }

  // Footer
  if (t.includes('footer') || s.companyName) {
    return (
      <div className="px-6 py-8 text-center border-t" style={{ background: bg, color: text }}>
        <div className="font-semibold">{s.companyName || 'Company'}</div>
        {s.tagline && <div className="text-sm opacity-80">{s.tagline}</div>}
      </div>
    );
  }

  // Text fallback
  if (s.content || s.text || subtitle || title) {
    return (
      <SectionCard>
        {title && <Title>{title}</Title>}
        <p className="text-gray-700 whitespace-pre-wrap">{s.content || s.text || subtitle}</p>
      </SectionCard>
    );
  }

  return null;
};

export default AutoSection;
