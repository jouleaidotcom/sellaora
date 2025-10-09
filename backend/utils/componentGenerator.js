const fs = require('fs');
const path = require('path');

/**
 * Generates individual React component files for Vite project
 * @param {string} buildDir - Build directory path
 * @param {Object} jsonLayout - JSON layout structure
 */
function generateComponents(buildDir, jsonLayout) {
  const componentsDir = path.join(buildDir, 'src', 'components');
  
  // Ensure components directory exists
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  // Generate universal section component that can handle any layout
  generateUniversalSectionComponent(componentsDir);
  
  // Generate App.jsx
  generateAppComponent(buildDir, jsonLayout);
  
  // Generate component styles
  generateComponentStyles(buildDir);
}

/**
 * Generate Navbar component
 */
function generateNavbarComponent(componentsDir) {
  const navbarComponent = `import React from 'react';

const Navbar = ({ content = {}, styles = {} }) => {
  const {
    logo = 'Logo',
    links = [],
    bgColor = '#ffffff',
    textColor = '#1f2937'
  } = content;

  return (
    <nav className="navbar" style={{ backgroundColor: bgColor, color: textColor, ...styles }}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <h2 style={{ color: textColor }}>{logo}</h2>
        </div>
        <div className="navbar-links">
          {links.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              className="navbar-link"
              style={{ color: textColor }}
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
`;
  fs.writeFileSync(path.join(componentsDir, 'Navbar.jsx'), navbarComponent);
}

/**
 * Generate Universal Section component that can render any section type
 */
function generateUniversalSectionComponent(componentsDir) {
  const universalComponent = `import React from 'react';

const toSlug = (name = '') => String(name)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const toHashPath = (p = '/') => {
  const path = String(p || '/').startsWith('/') ? p : '/' + String(p || '/');
  return '#' + path;
};

const linkToHref = (link) => {
  if (!link) return '#/';
  if (link.pageName) return toHashPath('/' + toSlug(link.pageName));
  if (typeof link.url === 'string') {
    if (link.url.startsWith('/')) return toHashPath(link.url);
    return link.url; // external http(s) or anchors
  }
  return '#/';
};

const Section = ({ section }) => {
  const {
    type,
    bgColor,
    textColor,
    ...content
  } = section;

  const sectionStyle = {
    backgroundColor: bgColor,
    color: textColor,
    padding: '2rem 0',
    minHeight: type === 'hero' ? '500px' : 'auto',
    display: type === 'hero' ? 'flex' : 'block',
    alignItems: type === 'hero' ? 'center' : 'normal',
    justifyContent: type === 'hero' ? 'center' : 'normal',
    textAlign: type === 'hero' ? 'center' : 'left',
    backgroundImage: content.image ? \`url(\${content.image})\` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  const renderContent = () => {
    switch ((type || '').toLowerCase()) {
      case 'navbar':
        return (
          <nav style={{ background: '#000', color: '#fff', padding: '1rem 0', borderBottom: '1px solid #374151' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 32, height: 32, background: '#fff', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                  {content.logo?.[0]?.toUpperCase() || 'S'}
                </div>
                <h2 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '18px' }}>{content.logo || 'Store'}</h2>
              </div>
              <div style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: 500 }}>
                {content.links?.map((link, index) => {
                  const href = linkToHref(link) || '#/';
                  return (
                    <a key={index} href={href} style={{ color: '#fff', textDecoration: 'none', textTransform: 'uppercase' }}>
                      {link.text}
                    </a>
                  );
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 20, height: 20, cursor: 'pointer' }}>👤</div>
                <div style={{ width: 20, height: 20, cursor: 'pointer' }}>🔍</div>
                <div style={{ width: 20, height: 20, cursor: 'pointer' }}>🛒</div>
              </div>
            </div>
          </nav>
        );
      
      case 'hero':
        return (
          <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: textColor }}>
              {content.title}
            </h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: textColor }}>
              {content.subtitle}
            </p>
            {content.buttonText && (
              <a href={linkToHref({ url: content.buttonLink })} style={{
                display: 'inline-block',
                backgroundColor: '#ff6b6b',
                color: 'white',
                padding: '12px 30px',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '1.1rem'
              }}>
                {content.buttonText}
              </a>
            )}
          </div>
        );
      
      case 'features':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: textColor }}>
              {content.title}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {content.items?.map((item, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: textColor }}>{item.title}</h3>
                  <p style={{ color: textColor }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'collection':
      case 'products': {
        const items = Array.isArray(content.items) ? content.items : (Array.isArray(content.products) ? content.products : []);
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            {content.title && (
              <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '2rem', color: textColor }}>{content.title}</h2>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {items.map((p, i) => {
                const slug = toSlug(p.slug || p.name || 'product-'+i);
                return (
<a key={i} href={'#/product/' + slug} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
                      {p.image && <img src={p.image} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
                      <div style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
                        {p.description && <div style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>{p.description}</div>}
                        <div style={{ marginTop: 8, fontWeight: 600, color: '#111827' }}>{p.price}</div>
                        <div style={{ marginTop: 10, background: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', textAlign: 'center' }}>View</div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        );
      }

      case 'testimonials': {
        const items = Array.isArray(content.items) ? content.items : [];
        return (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
            {content.title && <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem', color: textColor }}>{content.title}</h2>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {items.map((t, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 10, padding: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {t.avatar && <img src={t.avatar} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />}
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                  </div>
                  <div style={{ marginTop: 8, color: '#374151' }}>{t.text}</div>
                  {t.rating && <div style={{ marginTop: 6, color: '#f59e0b' }}>{'★'.repeat(Math.max(1, Math.min(5, Number(t.rating) || 5)))}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'pricing': {
        const items = Array.isArray(content.items) ? content.items : [];
        return (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
            {content.title && <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem', color: textColor }}>{content.title}</h2>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {items.map((plan, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 10, padding: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: plan.featured ? '2px solid #10b981' : '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{plan.name}</div>
                  <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700 }}>{plan.price}</div>
                  <ul style={{ marginTop: 8, paddingLeft: 18, color: '#4b5563' }}>
                    {(plan.features || []).map((f, idx) => (<li key={idx}>{f}</li>))}
                  </ul>
                  {plan.buttonText && <a href={linkToHref({ url: plan.buttonLink })} style={{ display: 'inline-block', marginTop: 10, background: '#111827', color: '#fff', padding: '8px 12px', borderRadius: 6, textDecoration: 'none' }}>{plan.buttonText}</a>}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'cta':
        return (
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: '2rem', color: textColor }}>{content.title}</h2>
            {content.subtitle && <p style={{ marginTop: 8, color: textColor }}>{content.subtitle}</p>}
            {content.buttonText && (
              <a href={linkToHref({ url: content.buttonLink })} style={{ display: 'inline-block', marginTop: 16, background: '#10b981', color: '#000', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>{content.buttonText}</a>
            )}
          </div>
        );

      case 'gallery': {
        const images = Array.isArray(content.images) ? content.images : [];
        return (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
            {content.title && <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem', color: textColor }}>{content.title}</h2>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {images.map((img, i) => (
                <figure key={i} style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  <img src={img.url} alt={img.caption || 'Image'} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  {img.caption && <figcaption style={{ padding: '0.5rem 0.75rem', color: '#4b5563' }}>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        );
      }

      case 'newsletter':
        return (
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto', padding: '0 20px' }}>
            <h3 style={{ fontSize: '1.5rem', color: textColor }}>{content.title || 'Stay Updated'}</h3>
            {content.subtitle && <p style={{ marginTop: 6, color: textColor }}>{content.subtitle}</p>}
            <form onSubmit={(e) => e.preventDefault()} style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <input type="email" required placeholder="you@example.com" style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 6, minWidth: 240 }} />
              <button type="submit" style={{ background: '#111827', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>{content.buttonText || 'Subscribe'}</button>
            </form>
          </div>
        );
      
      case 'textblock':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            {content.heading && (
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: textColor }}>
                {content.heading}
              </h2>
            )}
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: textColor }}>
              {content.content}
            </p>
          </div>
        );
      
      case 'footer':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '1rem', color: textColor }}>{content.companyName}</h4>
                <p style={{ color: textColor }}>{content.tagline}</p>
              </div>
              {content.links && (
                <div>
                  <h4 style={{ marginBottom: '1rem', color: textColor }}>Links</h4>
                  {content.links.map((link, index) => {
                    const href = linkToHref(link) || '#/';
                    return (
                      <div key={index} style={{ marginBottom: '0.5rem' }}>
                        <a href={href} style={{ color: textColor, textDecoration: 'none' }}>
                          {link.text}
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        // For unknown section types, render nothing to avoid raw JSON output
        return null;
    }
  };

  return (
    <section style={sectionStyle}>
      {renderContent()}
    </section>
  );
};

export default Section;
`;
  fs.writeFileSync(path.join(componentsDir, 'Section.jsx'), universalComponent);
}

/**
 * Generate Universal Section component that can render any section type (LEGACY)
 */
function generateNavbarComponent(componentsDir) {
  const navbarComponent = `import React from 'react';

const Navbar = ({ content = {}, styles = {} }) => {
  const {
    logo = 'Logo',
    links = [],
    bgColor = '#ffffff',
    textColor = '#1f2937'
  } = content;

  return (
    <nav className="navbar" style={{ backgroundColor: bgColor, color: textColor, ...styles }}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <h2 style={{ color: textColor }}>{logo}</h2>
        </div>
        <div className="navbar-links">
          {links.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              className="navbar-link"
              style={{ color: textColor }}
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
`;
  fs.writeFileSync(path.join(componentsDir, 'Navbar.jsx'), navbarComponent);
}

/**
 * Generate Hero component
 */
function generateHeroComponent(componentsDir) {
  const heroComponent = `import React from 'react';

const HeroSection = ({ content = {}, styles = {} }) => {
  const {
    title = 'Welcome to Our Store',
    subtitle = 'Discover amazing products',
    buttonText,
    buttonLink,
    image,
    bgColor = '#667eea',
    textColor = '#ffffff'
  } = content;

  const heroStyle = {
    backgroundColor: bgColor,
    color: textColor,
    backgroundImage: image ? \`url(\${image})\` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: image ? 'overlay' : undefined,
    ...styles
  };

  return (
    <section className="hero-section" style={heroStyle}>
      <div className="hero-content">
        <h1 className="hero-title" style={{ color: textColor }}>{title}</h1>
        <p className="hero-description" style={{ color: textColor }}>{subtitle}</p>
        {buttonText && (
          <a href={buttonLink || '#'} className="hero-button" style={{ color: textColor }}>
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
`;
  fs.writeFileSync(path.join(componentsDir, 'HeroSection.jsx'), heroComponent);
}

/**
 * Generate Features component
 */
function generateFeaturesComponent(componentsDir) {
  const featuresComponent = `import React from 'react';

const Features = ({ content = {}, styles = {} }) => {
  const {
    title = 'Features',
    items = [],
    bgColor = '#f9fafb',
    textColor = '#111827'
  } = content;

  return (
    <section className="features-section" style={{ backgroundColor: bgColor, color: textColor, ...styles }}>
      <div className="container">
        {title && <h2 className="features-title" style={{ color: textColor }}>{title}</h2>}
        <div className="features-grid">
          {items.map((item, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">{item.icon}</div>
              <h3 className="feature-title" style={{ color: textColor }}>{item.title}</h3>
              <p className="feature-description" style={{ color: textColor }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
`;
  fs.writeFileSync(path.join(componentsDir, 'Features.jsx'), featuresComponent);
}

/**
 * Generate ProductGrid component
 */
function generateProductGridComponent(componentsDir) {
  const productComponent = `import React from 'react';

const ProductGrid = ({ content = {}, styles = {} }) => {
  const { products = [], title } = content;
  
  return (
    <section className="product-grid" style={styles}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        <div className="products-container">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              {product.image && (
                <img src={product.image} alt={product.name} className="product-image" />
              )}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">\${product.price}</p>
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
`;
  fs.writeFileSync(path.join(componentsDir, 'ProductGrid.jsx'), productComponent);
}

/**
 * Generate TextBlock component
 */
function generateTextBlockComponent(componentsDir) {
  const textBlockComponent = `import React from 'react';

const TextBlock = ({ content = {}, styles = {} }) => {
  const {
    heading,
    content: textContent,
    bgColor = '#ffffff',
    textColor = '#374151',
    alignment = 'left'
  } = content;

  return (
    <section className="textblock-section" style={{ backgroundColor: bgColor, color: textColor, ...styles }}>
      <div className="container">
        <div className="textblock-content" style={{ textAlign: alignment }}>
          {heading && <h2 className="textblock-heading" style={{ color: textColor }}>{heading}</h2>}
          {textContent && <p className="textblock-text" style={{ color: textColor }}>{textContent}</p>}
        </div>
      </div>
    </section>
  );
};

export default TextBlock;
`;
  fs.writeFileSync(path.join(componentsDir, 'TextBlock.jsx'), textBlockComponent);
}

/**
 * Generate Footer component
 */
function generateFooterComponent(componentsDir) {
  const footerComponent = `import React from 'react';

const Footer = ({ content = {}, styles = {} }) => {
  const {
    companyName = 'My Store',
    description = 'Your trusted online store',
    links = [],
    contact
  } = content;

  return (
    <footer className="footer" style={styles}>
      <div className="footer-content">
        <div className="footer-section">
          <h4>{companyName}</h4>
          <p>{description}</p>
        </div>
        {links && links.length > 0 && (
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {links.map((link, index) => (
                <li key={index}>
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {contact && (
          <div className="footer-section">
            <h4>Contact</h4>
            {contact.email && <p>{contact.email}</p>}
            {contact.phone && <p>{contact.phone}</p>}
          </div>
        )}
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 {companyName}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
`;
  fs.writeFileSync(path.join(componentsDir, 'Footer.jsx'), footerComponent);
}

/**
 * Generate TextSection component
 */
function generateTextSectionComponent(componentsDir) {
  const textComponent = `import React from 'react';

const TextSection = ({ content = {}, styles = {} }) => {
  const { title, content: textContent } = content;

  return (
    <section className="text-section" style={styles}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {textContent && (
          <div 
            className="text-content" 
            dangerouslySetInnerHTML={{__html: textContent}} 
          />
        )}
      </div>
    </section>
  );
};

export default TextSection;
`;
  fs.writeFileSync(path.join(componentsDir, 'TextSection.jsx'), textComponent);
}

/**
 * Generate App.jsx with proper imports and layout
 */
function generateAppComponent(buildDir, jsonLayout) {
  console.log('🔍 Debug: jsonLayout received:', JSON.stringify(jsonLayout, null, 2));

  const pages = Array.isArray(jsonLayout?.pages) && jsonLayout.pages.length
    ? jsonLayout.pages
    : [{ name: 'Home', path: '/', sections: Array.isArray(jsonLayout?.sections) ? jsonLayout.sections : [] }];

  const pagesLiteral = JSON.stringify(pages, null, 2);

const appComponent = `import React from 'react';
import { HashRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import Section from './components/Section';
import './App.css';

const toSlug = (name = '') => String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const normalizePath = (p, name) => {
  if (typeof p === 'string' && p.trim()) {
    const v = p.trim();
    return v.startsWith('/') ? v : '/' + v;
  }
  const slug = '/' + toSlug(name || 'page');
  return slug;
};

const parsePriceNumber = (price) => {
  if (typeof price === 'number') return price;
  const m = String(price || '').replace(/[^0-9.]/g, '');
  const n = parseFloat(m);
  return Number.isFinite(n) ? n : 0;
};

const PAGES = ${pagesLiteral};

const CATALOG = (() => {
  const map = new Map();
  for (const p of PAGES) {
    for (const s of (p.sections || [])) {
      const type = (s.type || '').toLowerCase();
      if (type === 'collection' || type === 'products') {
        const items = Array.isArray(s.items) ? s.items : (Array.isArray(s.products) ? s.products : []);
        for (const item of items) {
          const slug = toSlug(item.slug || item.name || Math.random().toString(36).slice(2));
          if (!map.has(slug)) {
            map.set(slug, {
              slug,
              name: item.name,
              image: item.image,
              description: item.description,
              price: item.price,
              priceNumber: parsePriceNumber(item.price),
              sizes: Array.isArray(item.sizes) && item.sizes.length ? item.sizes : ['S','M','L','XL'],
            });
          }
        }
      }
    }
  }
  return map;
})();

const Page = ({ sections = [] }) => (
  <div className=\"App\">
    {sections.map((section, idx) => (
      <Section key={idx} section={section} />
    ))}
  </div>
);

// Product detail page
function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = CATALOG.get(slug);
  const [size, setSize] = React.useState(product?.sizes?.[0] || 'M');
  const [qty, setQty] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Product Not Found</h1>
          <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} style={{ background: '#fff', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>← Back to Store</button>
        </div>
      </div>
    );
  }

  const buyNow = () => {
    const checkout = {
      items: [{ slug: product.slug, name: product.name, price: product.priceNumber, image: product.image, size, qty }],
      subtotal: product.priceNumber * qty,
      currency: /€|EUR/i.test(product.price) ? 'EUR' : /£|GBP/i.test(product.price) ? 'GBP' : 'USD',
      createdAt: Date.now(),
    };
    try { localStorage.setItem('checkout', JSON.stringify(checkout)); } catch {}
    navigate('/checkout/address');
  };

  const images = [product.image].filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      {/* Navigation */}
      <nav style={{ background: '#000', borderBottom: '1px solid rgba(55, 65, 81, 0.5)', padding: '20px 0', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #fff, #f1f5f9)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)' }}>S</div>
            <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em' }}>Store</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', fontSize: '13px', fontWeight: 600 }}>
            <a href="#/" style={{ color: '#fff', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s ease' }}>HOME</a>
            <a href="#/" style={{ color: '#fff', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s ease' }}>COLLECTION</a>
            <a href="#/" style={{ color: '#fff', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s ease' }}>ABOUT</a>
            <a href="#/" style={{ color: '#fff', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s ease' }}>CONTACT</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: 20, height: 20, cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s ease' }}>♥</div>
            <div style={{ width: 20, height: 20, cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s ease' }}>⚲</div>
            <div style={{ width: 20, height: 20, cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s ease', position: 'relative' }}>
              🛒
              <span style={{ position: 'absolute', top: -8, right: -8, width: 16, height: 16, background: '#dc2626', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Product Detail */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'start' }}>
          {/* Product Images */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px', fontWeight: 500 }}>1 / 1</div>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#111827', aspectRatio: '1/1' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button style={{ position: 'absolute', top: 20, right: 20, width: 44, height: 44, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>♡</button>
            </div>
          </div>

          {/* Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingTop: '8px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 20px 0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{product.name}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
                <span style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)' }}>LAUNCHING SALE</span>
                <span style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '6px 14px', borderRadius: '20px', letterSpacing: '0.3px', boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)' }}>Hurry up! Only few left</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{product.price}</span>
              </div>
              
              <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>ALL TAXES ARE INCLUDED IN MRP, SHIPPING AND DUTIES CALCULATED AT CHECKOUT</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>SIZE: <span style={{ fontWeight: 800 }}>{size}</span></span>
                <button style={{ fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500, transition: 'color 0.2s ease' }}>SIZING GUIDE</button>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
                {product.sizes.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setSize(s)} 
                    style={{ 
                      padding: '14px 20px', 
                      borderRadius: '12px', 
                      border: s === size ? '2px solid #fff' : '2px solid #374151', 
                      background: s === size ? '#fff' : 'transparent', 
                      color: s === size ? '#000' : '#fff', 
                      fontWeight: 700, 
                      cursor: 'pointer', 
                      fontSize: '14px',
                      minWidth: '60px',
                      transition: 'all 0.2s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                onClick={buyNow} 
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(135deg, #fff, #f8f9fa)', 
                  color: '#000', 
                  border: 'none', 
                  padding: '18px 32px', 
                  borderRadius: '14px', 
                  fontSize: '16px', 
                  fontWeight: 800, 
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.15)'
                }}
              >
                BUY NOW
              </button>
              <button 
                onClick={() => alert('Added to cart (demo)')} 
                style={{ 
                  width: '100%', 
                  background: 'transparent', 
                  color: '#fff', 
                  border: '2px solid #374151', 
                  padding: '18px 32px', 
                  borderRadius: '14px', 
                  fontSize: '16px', 
                  fontWeight: 800, 
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s ease'
                }}
              >
                ADD TO CART
              </button>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1), rgba(59, 130, 246, 0.1))', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(8px)' }}>
              <h4 style={{ fontWeight: 800, color: '#93c5fd', marginBottom: '12px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AVAILABLE OFFERS</h4>
              <p style={{ color: '#bfdbfe', fontSize: '14px', lineHeight: '1.6', fontWeight: 500 }}>OUR LAUNCHING SALE IS LIVE NOW WITH FLAT 25% OFF. GET YOUR FAVOURITE TEES NOW.</p>
            </div>

            <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(55, 65, 81, 0.5)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PRODUCT DETAILS</h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '15px', fontWeight: 400 }}>
                {product.description || "A wearable saga of gothic art and defiant spirit. Step into a world where history and art collide. The " + product.name + " is a powerful statement piece designed for those who forge their own legacy. This premium tee features striking gothic designs, including an inverted classical bust on the back, a bold 'conqueror' script on the front, and intricate symbolic graphics woven into the fabric. It's a blend of ancient myth and modern street style, crafted for comfort and built to last."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutAddress() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: '' });
  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => {
    try { localStorage.setItem('checkout_address', JSON.stringify(form)); } catch {}
    navigate('/checkout/payment');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h2>Shipping Address</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <input placeholder="Full name" value={form.name} onChange={(e)=>onChange('name', e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input placeholder="Email" value={form.email} onChange={(e)=>onChange('email', e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input placeholder="Phone" value={form.phone} onChange={(e)=>onChange('phone', e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input placeholder="Address" value={form.address} onChange={(e)=>onChange('address', e.target.value)} style={{ gridColumn: '1 / span 2', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input placeholder="City" value={form.city} onChange={(e)=>onChange('city', e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input placeholder="State" value={form.state} onChange={(e)=>onChange('state', e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input placeholder="ZIP" value={form.zip} onChange={(e)=>onChange('zip', e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input placeholder="Country" value={form.country} onChange={(e)=>onChange('country', e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        <button onClick={()=>history.back()} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e5e7eb' }}>Back</button>
        <button onClick={next} style={{ background: '#10b981', color: '#000', padding: '10px 16px', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Continue to Payment</button>
      </div>
    </div>
  );
}

function CheckoutPayment() {
  const navigate = useNavigate();
  let checkout = null;
  try { checkout = JSON.parse(localStorage.getItem('checkout') || 'null'); } catch {}
  let address = null;
  try { address = JSON.parse(localStorage.getItem('checkout_address') || 'null'); } catch {}

  if (!checkout) return <div style={{ padding: 20 }}>No checkout in progress.</div>;

  const pay = (method) => {
    const orderId = Math.random().toString(36).slice(2, 10).toUpperCase();
    try { localStorage.setItem('checkout_order', JSON.stringify({ orderId, method })); } catch {}
    navigate('/checkout/success');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h2>Payment</h2>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div>
          <h4>Order Summary</h4>
          {checkout.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid #e5e7eb', padding: '8px 0' }}>
              <img src={it.image} alt={it.name} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{it.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Size: {it.size} • Qty: {it.qty}</div>
              </div>
<div style={{ fontWeight: 700 }}>{'$' + (it.price * it.qty).toFixed(2)}</div>
            </div>
          ))}
          <div style={{ textAlign: 'right', marginTop: 8 }}>
<div>Subtotal: <b>{'$' + checkout.subtotal.toFixed(2)}</b></div>
            <div>Shipping: <b>Free</b></div>
<div style={{ fontSize: 18, marginTop: 6 }}>Total: <b>{'$' + checkout.subtotal.toFixed(2)}</b></div>
          </div>
        </div>
        <div>
          <h4>Pay</h4>
          <button onClick={()=>pay('cod')} style={{ width: '100%', marginTop: 8, padding: '10px 16px', borderRadius: 8, border: '1px solid #e5e7eb' }}>Cash on Delivery</button>
          <button onClick={()=>pay('card-mock')} style={{ width: '100%', marginTop: 8, background: '#111827', color: '#fff', padding: '10px 16px', border: 'none', borderRadius: 8 }}>Pay with Card (Mock)</button>
          {address && (
            <div style={{ marginTop: 16, fontSize: 12, color: '#6b7280' }}>
              Shipping to: {address.name}, {address.address}, {address.city}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckoutSuccess() {
  let order = null;
  try { order = JSON.parse(localStorage.getItem('checkout_order') || 'null'); } catch {}
  React.useEffect(()=>{
    // Clear after success (keep order id visible)
    try {
      localStorage.removeItem('checkout');
      localStorage.removeItem('checkout_address');
    } catch {}
  }, []);
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20, textAlign: 'center' }}>
      <h2>Thank you! 🎉</h2>
      <p>Your order has been placed successfully.</p>
      {order?.orderId && <p style={{ marginTop: 8 }}>Order ID: <b>{order.orderId}</b></p>}
      <a href="#/" style={{ display: 'inline-block', marginTop: 16, background: '#10b981', color: '#000', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Continue shopping</a>
    </div>
  );
}

function App() {
  const home = PAGES[0];
  const homePath = normalizePath(home?.path, home?.name);
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to={homePath} replace />} />
        {PAGES.map((p, i) => {
          const routePath = normalizePath(p?.path, p?.name || ('page-' + (i + 1)));
          return (
            <Route
              key={i}
              path={routePath}
              element={<Page sections={Array.isArray(p?.sections) ? p.sections : []} />}
            />
          );
        })}
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/checkout/address" element={<CheckoutAddress />} />
        <Route path="/checkout/payment" element={<CheckoutPayment />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="*" element={<Navigate to={homePath} replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
`;

  fs.writeFileSync(path.join(buildDir, 'src', 'App.jsx'), appComponent);
}

/**
 * Maps section type to React component name
 */
function getComponentName(sectionType) {
  const typeMap = {
    'navbar': 'Navbar',
    'hero': 'HeroSection', 
    'features': 'Features',
    'products': 'ProductGrid',
    'textblock': 'TextBlock',
    'footer': 'Footer',
    'text': 'TextSection'
  };
  
  return typeMap[sectionType?.toLowerCase()] || 'TextSection';
}

/**
 * Generate App.css with component styles
 */
function generateComponentStyles(buildDir) {
  const appCss = `/* Navbar */
.navbar {
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo h2 {
  margin: 0;
  font-size: 1.5rem;
}

.navbar-links {
  display: flex;
  gap: 2rem;
}

.navbar-link {
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.navbar-link:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .navbar-links {
    gap: 1rem;
    font-size: 0.9rem;
  }
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.hero-content {
  z-index: 1;
  max-width: 600px;
  padding: 2rem;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-description {
    font-size: 1rem;
  }
}

.hero-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.hero-button:hover {
  background: #ff5252;
}

/* Product Grid */
.product-grid {
  padding: 4rem 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .products-container {
    grid-template-columns: 1fr;
  }
}

.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.product-price {
  font-size: 1.5rem;
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.add-to-cart-btn {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
  width: 100%;
}

.add-to-cart-btn:hover {
  background: #45b7af;
}

/* Text Section */
.text-section {
  padding: 3rem 0;
}

.text-content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #555;
  max-width: 800px;
  margin: 0 auto;
}

/* Footer */
.footer {
  background: #2c3e50;
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #34495e;
  color: #bdc3c7;
}
`;

  fs.writeFileSync(path.join(buildDir, 'src', 'App.css'), appCss);
}

module.exports = {
  generateComponents
};