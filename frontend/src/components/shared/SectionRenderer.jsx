import React, { useState } from 'react';
import AutoSection from './AutoSection';

// Helpers (copied from StorePreview for parity)
const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#2563eb');
  if (!m) return [37, 99, 235];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
};

const tint = (hex, factor = 0.85) => {
  const [r,g,b] = hexToRgb(hex);
  const nr = Math.round(255 - (255 - r) * factor);
  const ng = Math.round(255 - (255 - g) * factor);
  const nb = Math.round(255 - (255 - b) * factor);
  return `rgb(${nr}, ${ng}, ${nb})`;
};

export const getThemeTokens = (theme = {}) => {
  const preset = (theme.stylePreset || '').toLowerCase();
  const primary = theme.primaryColor || '#2563eb';
  const secondary = theme.secondaryColor || '#1e40af';
  const accent = theme.accentColor || '#f59e0b';
  const radius = theme.borderRadius || 'lg';
  const shadow = (theme.shadow || 'soft').toLowerCase();
  
  const radiusClass = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'pill': 'rounded-full'
  }[radius] || 'rounded-lg';
  
  const shadowClass = {
    'none': '',
    'soft': 'shadow-sm',
    'medium': 'shadow-md',
    'elevated': 'shadow-lg',
    'dramatic': 'shadow-2xl'
  }[shadow] || 'shadow-sm';
  
  const pageBg = preset === 'gradient'
    ? `linear-gradient(135deg, ${tint(primary, 0.92)} 0%, ${tint(secondary, 0.85)} 100%)`
    : preset === 'bold' || preset === 'dark'
      ? '#0f172a'
      : '#ffffff';
  
  const cardBg = preset === 'bold' || preset === 'dark'
    ? 'bg-slate-800 text-slate-50 border-slate-700'
    : preset === 'glass'
      ? 'bg-white/60 backdrop-blur-lg text-neutral-900 border-white/30'
      : 'bg-white text-neutral-900 border-neutral-200';
  
  const textMuted = preset === 'bold' || preset === 'dark'
    ? 'text-slate-300'
    : 'text-neutral-600';
  
  return { 
    radiusClass, 
    shadowClass, 
    preset, 
    primary, 
    secondary, 
    accent, 
    pageBg, 
    cardBg, 
    textMuted 
  };
};

// Components (identical to StorePreview versions)
const Navbar = ({ logo, links = [], bgColor, textColor, variant = 'solid', theme }) => {
  const { radiusClass, shadowClass, preset } = getThemeTokens(theme);
  const isTransparent = variant === 'transparent' || preset === 'glass';
  
  return (
    <div 
      className={`mb-4 ${radiusClass} border ${shadowClass} ${
        isTransparent 
          ? 'bg-white/50 backdrop-blur-lg border-white/30' 
          : 'bg-white border-neutral-200'
      }`}
      style={!isTransparent && bgColor ? { backgroundColor: bgColor, color: textColor } : {}}
    >
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">{logo || 'Logo'}</div>
        <div className="flex gap-6 text-sm font-medium">
          {links.map((l, i) => (
            <span key={i} className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity">
              {l.text || l.name || `Link ${i+1}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ title, subtitle, image, imageUrl, cta, variant = 'overlay', theme }) => {
  const { radiusClass, shadowClass, preset, primary } = getThemeTokens(theme);
  const img = imageUrl || image;
  
  if (variant === 'split' || variant === 'hero-split') {
    return (
      <div className={`grid md:grid-cols-2 gap-6 mb-6 ${radiusClass} overflow-hidden ${shadowClass}`}>
        <div className={`p-8 flex flex-col justify-center ${preset === 'bold' ? 'bg-slate-800 text-white' : 'bg-white'}`}>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            {title || 'Hero Title'}
          </h1>
          {subtitle && <p className="text-lg opacity-90 mb-6">{subtitle}</p>}
          {cta && (
            <button 
              className="px-6 py-3 rounded-lg text-white font-semibold w-fit shadow-lg"
              style={{ backgroundColor: primary }}
            >
              {cta.text || 'Get Started'}
            </button>
          )}
        </div>
        <div className={`min-h-[300px] ${radiusClass} overflow-hidden`}>
          {img ? (
            <img src={img} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
          )}
        </div>
      </div>
    );
  }
  
  if (variant === 'minimal' || variant === 'hero-minimal') {
    return (
      <div className={`text-center py-16 mb-6 ${radiusClass} ${preset === 'bold' ? 'bg-slate-800 text-white' : 'bg-white'} ${shadowClass}`}>
        <h1 className="text-6xl font-extrabold tracking-tight mb-4">
          {title || 'Hero Title'}
        </h1>
        {subtitle && <p className="text-xl opacity-80 max-w-2xl mx-auto mb-6">{subtitle}</p>}
        {cta && (
          <button 
            className="px-8 py-4 rounded-lg text-white font-semibold shadow-lg"
            style={{ backgroundColor: primary }}
          >
            {cta.text || 'Get Started'}
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className={`relative h-96 ${radiusClass} overflow-hidden mb-6 ${shadowClass}`}>
      {img ? (
        <img src={img} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-neutral-300 to-neutral-400" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
          {title || 'Hero Title'}
        </h1>
        {subtitle && <p className="text-lg md:text-xl mb-6 max-w-2xl drop-shadow">{subtitle}</p>}
        {cta && (
          <div className="flex gap-3">
            <button 
              className="px-6 py-3 rounded-lg text-white font-semibold shadow-lg"
              style={{ backgroundColor: primary }}
            >
              {cta.text || 'Get Started'}
            </button>
            {cta.secondaryText && (
              <button className="px-6 py-3 rounded-lg bg-white/20 backdrop-blur text-white font-semibold">
                {cta.secondaryText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductGrid = ({ title, products = [], items = [], theme }) => {
  const { radiusClass, shadowClass, cardBg, primary } = getThemeTokens(theme);
  const productList = products.length > 0 ? products : items;
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {productList.map((product, i) => (
          <div key={i} className={`bg-white ${radiusClass} border border-neutral-200 p-4 hover:shadow-lg transition-shadow`}>
            {(product.image || product.imageUrl) && (
              <div className={`w-full h-40 mb-3 ${radiusClass} overflow-hidden`}>
                <img 
                  src={product.image || product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="font-semibold text-sm mb-1">{product.name || 'Product'}</h3>
            {product.description && <p className="text-xs text-neutral-600 mb-2">{product.description}</p>}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold" style={{ color: primary }}>
                {product.price || '$0.00'}
              </span>
              <button className="text-xs px-3 py-1 rounded bg-neutral-100 hover:bg-neutral-200">
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeaturesGrid = ({ title, features = [], items = [], variant = 'cards', theme }) => {
  const { radiusClass, shadowClass, cardBg, textMuted } = getThemeTokens(theme);
  const featureList = features.length > 0 ? features : items;
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featureList.map((feature, i) => (
          <div key={i} className={`text-center p-6 bg-white ${radiusClass} border border-neutral-200`}>
            <div className="text-4xl mb-3">{feature.icon || '⭐'}</div>
            <h3 className="font-semibold text-lg mb-2">{feature.title || feature.name || 'Feature'}</h3>
            <p className={`text-sm ${textMuted}`}>{feature.description || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialsSection = ({ title, testimonials = [], items = [], theme }) => {
  const { radiusClass, shadowClass, cardBg, textMuted } = getThemeTokens(theme);
  const testimonialList = testimonials.length > 0 ? testimonials : items;
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonialList.map((testimonial, i) => (
          <div key={i} className={`bg-white p-5 ${radiusClass} border border-neutral-200`}>
            <div className="text-yellow-400 mb-3">{'⭐'.repeat(testimonial.rating || 5)}</div>
            <p className="text-sm mb-4 italic">"{testimonial.text || testimonial.content || 'Great product!'}"</p>
            <div className="flex items-center gap-3">
              {testimonial.avatar && (
                <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full" />
              )}
              <div>
                <div className="font-semibold text-sm">{testimonial.name || 'Customer'}</div>
                {testimonial.role && <div className={`text-xs ${textMuted}`}>{testimonial.role}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PricingSection = ({ title, plans = [], items = [], theme }) => {
  const { radiusClass, shadowClass, cardBg, primary } = getThemeTokens(theme);
  const planList = plans.length > 0 ? plans : items;
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planList.map((plan, i) => (
          <div 
            key={i} 
            className={`p-6 ${radiusClass} border-2 ${
              plan.featured 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : 'border-neutral-200 bg-white'
            }`}
          >
            <div className="text-center">
              <h3 className="font-bold text-xl mb-2">{plan.name || 'Plan'}</h3>
              <div className="text-4xl font-extrabold mb-4" style={{ color: primary }}>
                {plan.price || '$0'}
              </div>
              {plan.description && <p className="text-sm text-neutral-600 mb-4">{plan.description}</p>}
              {plan.features && (
                <ul className="text-left text-sm space-y-2 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button 
                className={`w-full py-3 ${radiusClass} font-semibold ${
                  plan.featured 
                    ? 'text-white shadow-lg' 
                    : 'bg-neutral-100 text-neutral-800'
                }`}
                style={plan.featured ? { backgroundColor: primary } : {}}
              >
                {plan.buttonText || 'Choose Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GallerySection = ({ title, images = [], variant = 'grid', theme }) => {
  const { radiusClass, shadowClass, cardBg } = getThemeTokens(theme);
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className={`grid ${variant === 'masonry' ? 'md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'} gap-3`}>
        {images.map((img, i) => {
          const src = typeof img === 'string' ? img : (img.url || img.src);
          const caption = typeof img === 'object' ? img.caption : null;
          return (
            <div key={i} className={`${radiusClass} overflow-hidden`}>
              <img src={src} alt={caption || `Gallery ${i}`} className="w-full h-full object-cover" />
              {caption && <p className="text-xs text-neutral-600 mt-1">{caption}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatsSection = ({ stats = [], items = [], theme }) => {
  const { radiusClass, shadowClass, cardBg, primary } = getThemeTokens(theme);
  const statList = stats.length > 0 ? stats : items;
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statList.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl font-extrabold mb-1" style={{ color: primary }}>
              {stat.value || '0'}
            </div>
            <div className="text-sm text-neutral-600">{stat.label || 'Stat'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProcessSection = ({ title, steps = [], items = [], theme }) => {
  const { radiusClass, shadowClass, cardBg, primary } = getThemeTokens(theme);
  const stepList = steps.length > 0 ? steps : items;
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stepList.map((step, i) => (
          <div key={i} className="flex gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
              style={{ backgroundColor: primary }}
            >
              {i + 1}
            </div>
            <div>
              <h3 className="font-semibold mb-1">{step.title || `Step ${i+1}`}</h3>
              <p className="text-sm text-neutral-600">{step.description || ''}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CTASection = ({ title, subtitle, cta, buttonText, bgColor, textColor, theme }) => {
  const { radiusClass, shadowClass, primary } = getThemeTokens(theme);
  
  return (
    <div 
      className={`${radiusClass} p-8 mb-6 text-center ${shadowClass}`}
      style={{ backgroundColor: bgColor || primary, color: textColor || '#ffffff' }}
    >
      <h2 className="text-3xl font-bold mb-3">{title || 'Ready to Get Started?'}</h2>
      {subtitle && <p className="text-lg opacity-90 mb-6">{subtitle}</p>}
      <button className="px-8 py-4 rounded-lg bg-white text-neutral-900 font-semibold hover:bg-neutral-100 transition-colors">
        {(cta && cta.text) || buttonText || 'Get Started'}
      </button>
    </div>
  );
};

const AboutSection = ({ title, content, text, image, imageUrl, theme }) => {
  const { radiusClass, shadowClass, cardBg } = getThemeTokens(theme);
  const img = imageUrl || image;
  
  if (img) {
    return (
      <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass} grid md:grid-cols-2 gap-6`}>
        <div>
          {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
          <div className="prose prose-sm">{content || text || ''}</div>
        </div>
        <div className={`${radiusClass} overflow-hidden`}>
          <img src={img} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <div className="prose prose-sm max-w-none whitespace-pre-wrap">{content || text || ''}</div>
    </div>
  );
};

const FAQSection = ({ title, faqs = [], items = [], theme }) => {
  const { radiusClass, shadowClass, cardBg } = getThemeTokens(theme);
  const faqList = faqs.length > 0 ? faqs : items;
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="space-y-4">
        {faqList.map((faq, i) => (
          <div key={i} className="bg-white p-5 rounded-lg border border-neutral-200">
            <h3 className="font-semibold mb-2">{faq.q || faq.question || 'Question?'}</h3>
            <p className="text-sm text-neutral-600">{faq.a || faq.answer || 'Answer here.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsletterSection = ({ title, subtitle, buttonText, theme }) => {
  const { radiusClass, shadowClass, primary } = getThemeTokens(theme);
  
  return (
    <div className={`bg-neutral-50 ${radiusClass} border border-neutral-200 p-8 mb-6 text-center ${shadowClass}`}>
      <h2 className="text-2xl font-bold mb-2">{title || 'Stay Updated'}</h2>
      {subtitle && <p className="text-neutral-600 mb-6">{subtitle}</p>}
      <div className="flex gap-2 max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="flex-1 px-4 py-3 rounded-lg border border-neutral-300"
        />
        <button 
          className="px-6 py-3 rounded-lg text-white font-semibold"
          style={{ backgroundColor: primary }}
        >
          {buttonText || 'Subscribe'}
        </button>
      </div>
    </div>
  );
};

const FooterSection = ({ companyName, tagline, links = [], theme }) => {
  const { radiusClass, shadowClass } = getThemeTokens(theme);
  
  return (
    <div className={`bg-neutral-900 text-neutral-100 ${radiusClass} border border-neutral-800 p-8 mb-6 ${shadowClass}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold text-xl mb-2">{companyName || 'Company'}</h3>
          {tagline && <p className="text-sm text-neutral-400">{tagline}</p>}
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-6 md:justify-end">
          {links.map((link, i) => (
            <a key={i} href={link.href || '#'} className="text-sm hover:text-white transition-colors">
              {link.text || link.name || 'Link'}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoriesSection = ({ title, categories = [], items = [], theme }) => {
  const { radiusClass, shadowClass, cardBg } = getThemeTokens(theme);
  const categoryList = categories.length > 0 ? categories : items;
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categoryList.map((cat, i) => (
          <div key={i} className={`relative ${radiusClass} overflow-hidden group cursor-pointer`}>
            <div className="aspect-square">
              {(cat.imageUrl || cat.image) ? (
                <img 
                  src={cat.imageUrl || cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
              <div className="text-white">
                <h3 className="font-bold text-lg mb-1">{cat.name || 'Category'}</h3>
                {cat.description && <p className="text-sm opacity-90">{cat.description}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InstagramFeed = ({ title, handle, postCount = 6, theme }) => {
  const { radiusClass, shadowClass, cardBg } = getThemeTokens(theme);
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">{title || 'Follow Us on Instagram'}</h2>
        {handle && <a href={`https://instagram.com/${handle}`} className="text-sm text-blue-500">@{handle}</a>}
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {Array.from({ length: postCount }).map((_, i) => (
          <div key={i} className={`aspect-square ${radiusClass} overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100`}>
            <div className="w-full h-full flex items-center justify-center text-purple-300">
              📸
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamSection = ({ title, team = [], items = [], theme }) => {
  const { radiusClass, shadowClass, cardBg, textMuted } = getThemeTokens(theme);
  const teamList = team.length > 0 ? team : items;
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {teamList.map((member, i) => (
          <div key={i} className="text-center">
            <div className={`w-32 h-32 mx-auto mb-3 ${radiusClass} overflow-hidden`}>
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
            </div>
            <h3 className="font-semibold">{member.name || 'Team Member'}</h3>
            {member.role && <p className={`text-sm ${textMuted}`}>{member.role}</p>}
            {member.bio && <p className="text-xs mt-2 text-neutral-600">{member.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const LocationSection = ({ title, address, phone, email, hours, theme }) => {
  const { radiusClass, shadowClass, cardBg } = getThemeTokens(theme);
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {address && (
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <div className="font-semibold">Address</div>
                <div className="text-sm text-neutral-600">{address}</div>
              </div>
            </div>
          )}
          {phone && (
            <div className="flex items-start gap-3">
              <span className="text-xl">📞</span>
              <div>
                <div className="font-semibold">Phone</div>
                <div className="text-sm text-neutral-600">{phone}</div>
              </div>
            </div>
          )}
          {email && (
            <div className="flex items-start gap-3">
              <span className="text-xl">✉️</span>
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-neutral-600">{email}</div>
              </div>
            </div>
          )}
          {hours && (
            <div className="flex items-start gap-3">
              <span className="text-xl">🕐</span>
              <div>
                <div className="font-semibold">Hours</div>
                <div className="text-sm text-neutral-600 whitespace-pre-line">{hours}</div>
              </div>
            </div>
          )}
        </div>
        <div className={`${radiusClass} overflow-hidden bg-neutral-100 h-64 flex items-center justify-center`}>
          <span className="text-neutral-400">📍 Map</span>
        </div>
      </div>
    </div>
  );
};

const ContactForm = ({ title, subtitle, theme }) => {
  const { radiusClass, shadowClass, cardBg, primary } = getThemeTokens(theme);
  
  return (
    <div className={`${cardBg} ${radiusClass} border p-6 mb-6 ${shadowClass}`}>
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {subtitle && <p className="text-neutral-600 mb-6">{subtitle}</p>}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Name" 
            className="px-4 py-3 border border-neutral-300 rounded-lg"
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="px-4 py-3 border border-neutral-300 rounded-lg"
          />
        </div>
        <input 
          type="text" 
          placeholder="Subject" 
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg"
        />
        <textarea 
          placeholder="Message" 
          rows={5}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg"
        />
        <button 
          className="w-full py-3 rounded-lg text-white font-semibold"
          style={{ backgroundColor: primary }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

// Extensible registry for runtime additions
const externalRegistry = new Map();
export const registerSectionRenderer = (key, component) => {
  if (!key || !component) return;
  externalRegistry.set(String(key).toLowerCase().replace(/[-_]/g, ''), component);
};

// Shared renderer function
export const renderSection = (section, idx, theme) => {
  if (!section) return null;
  const type = String(section.type || '').toLowerCase().replace(/[-_]/g, '');
  const componentMap = {
    hero: HeroSection,
    herominimal: HeroSection,
    herosplit: HeroSection,
    herooverlay: HeroSection,
    herogradient: HeroSection,
    herovideo: HeroSection,
    heroproduct: HeroSection,
    heroheadline: HeroSection,
    heroillustration: HeroSection,

    features: FeaturesGrid,
    featuresgrid: FeaturesGrid,
    featuresalternating: FeaturesGrid,
    featurestabs: FeaturesGrid,
    benefitslist: FeaturesGrid,

    products: ProductGrid,
    productgrid: ProductGrid,
    productfeatured: ProductGrid,
    services: ProductGrid,
    servicescards: ProductGrid,
    collection: ProductGrid,
    portfolio: ProductGrid,
    portfolioshowcase: ProductGrid,
    casestudy: ProductGrid,
    casestudies: ProductGrid,

    categories: CategoriesSection,
    categoriesvisual: CategoriesSection,
    categorieslist: CategoriesSection,

    testimonials: TestimonialsSection,
    testimonialscards: TestimonialsSection,
    testimonialsslider: TestimonialsSection,
    reviews: TestimonialsSection,
    reviewsaggregate: TestimonialsSection,
    clientlogos: TestimonialsSection,
    successstories: TestimonialsSection,
    partners: TestimonialsSection,

    pricing: PricingSection,
    pricingcards: PricingSection,
    pricingtiers: PricingSection,
    pricingtable: PricingSection,

    gallery: GallerySection,
    gallerymasonry: GallerySection,
    gallerygrid: GallerySection,
    gallerycarousel: GallerySection,
    videoembed: GallerySection,
    video: GallerySection,

    stats: StatsSection,
    statistics: StatsSection,
    statsshowcase: StatsSection,

    process: ProcessSection,
    processsteps: ProcessSection,
    steps: ProcessSection,
    howitworks: ProcessSection,
    timeline: ProcessSection,

    about: AboutSection,
    aboutstory: AboutSection,
    textblock: AboutSection,
    content: AboutSection,

    team: TeamSection,
    teamgrid: TeamSection,
    teamspotlight: TeamSection,

    faq: FAQSection,
    faqs: FAQSection,
    faqaccordion: FAQSection,

    cta: CTASection,
    ctabanner: CTASection,
    ctainline: CTASection,
    calltoaction: CTASection,
    newsletter: NewsletterSection,
    formnewsletter: NewsletterSection,

    contact: ContactForm,
    contactform: ContactForm,
    formcontact: ContactForm,
    formbooking: ContactForm,
    location: LocationSection,
    locations: LocationSection,
    locationmap: LocationSection,
    hoursinfo: LocationSection,

    instagramfeed: InstagramFeed,
    socialfeed: InstagramFeed,

    navbar: Navbar,
    navigation: Navbar,
    footer: FooterSection,
  };

  // Prefer runtime-registered components first
  const override = externalRegistry.get(type);
  const Component = override || componentMap[type];
  if (Component) {
    return <Component key={idx} {...section} theme={theme} />;
  }

  // Fallback: heuristic, schema-agnostic renderer so ANY JSON shape still renders nicely
  return <AutoSection key={idx} section={section} theme={theme} />;
};

// Component form for convenience when rendering a single section
export const SectionRenderer = ({ section, idx = 0, theme = {} }) => {
  return renderSection(section, idx, theme);
};
