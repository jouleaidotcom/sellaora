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
    switch (type) {
      case 'navbar':
        return (
          <nav style={{ padding: '1rem 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: textColor, margin: 0 }}>{content.logo}</h2>
              <div style={{ display: 'flex', gap: '2rem' }}>
                {content.links?.map((link, index) => {
                  const isPage = link?.type === 'page' || !!link?.pageName;
                  const href = isPage ? ('#/' + toSlug(link.pageName || link.text || '')) : (link?.url || '#');
                  return (
                    <a key={index} href={href} style={{ color: textColor, textDecoration: 'none' }}>
                      {link.text}
                    </a>
                  );
                })}
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
              <a href={content.buttonLink || '#'} style={{
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
                    const isPage = link?.type === 'page' || !!link?.pageName;
                    const href = isPage ? ('#/' + toSlug(link.pageName || link.text || '')) : (link?.url || '#');
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
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <pre style={{ color: textColor }}>{
JSON.stringify(content, null, 2)
}</pre>
          </div>
        );
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
    : [{ name: 'Home', sections: Array.isArray(jsonLayout?.sections) ? jsonLayout.sections : [] }];

  const pagesLiteral = JSON.stringify(pages, null, 2);

  const appComponent = `import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Section from './components/Section';
import './App.css';

const toSlug = (name = '') => String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const PAGES = ${pagesLiteral};

const Page = ({ sections = [] }) => (
  <div className="App">
    {sections.map((section, idx) => (
      <Section key={idx} section={section} />
    ))}
  </div>
);

function App() {
  const home = PAGES[0];
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to={'/' + toSlug(home?.name || 'home')} replace />} />
        {PAGES.map((p, i) => (
          <Route
            key={i}
            path={'/' + toSlug(p?.name || ('page-' + (i + 1)))}
            element={<Page sections={Array.isArray(p?.sections) ? p.sections : []} />}
          />
        ))}
        <Route path="*" element={<Navigate to={'/' + toSlug(home?.name || 'home')} replace />} />
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