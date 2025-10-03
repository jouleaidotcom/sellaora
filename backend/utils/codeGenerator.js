const fs = require('fs');
const path = require('path');

/**
 * Generates React component code from JSON layout
 * @param {Object} jsonLayout - The JSON layout structure
 * @returns {string} - Generated React code
 */
function generateReactCode(jsonLayout) {
  if (!jsonLayout || !jsonLayout.pages) {
    throw new Error('Invalid JSON layout: missing pages');
  }

  // Generate imports
  const imports = `import React from 'react';
import './App.css';

`;

  // Generate components for each section type
  const components = generateComponents(jsonLayout);
  
  // Generate main App component
  const appComponent = generateAppComponent(jsonLayout);
  
  // Generate CSS
  const css = generateCSS(jsonLayout);
  
  return {
    appJs: imports + components + appComponent,
    appCss: css,
    packageJson: generatePackageJson(jsonLayout.name || 'my-store')
  };
}

/**
 * Generates individual React components
 */
function generateComponents(jsonLayout) {
  let components = '';
  
  // Hero Section Component
  components += `
// Hero Section Component
const HeroSection = ({ content, styles = {} }) => {
  return (
    <section className="hero-section" style={styles}>
      <div className="hero-content">
        <h1 className="hero-title">{content?.title || 'Welcome to Our Store'}</h1>
        <p className="hero-description">{content?.description || 'Discover amazing products'}</p>
        {content?.buttonText && (
          <button className="hero-button">{content.buttonText}</button>
        )}
      </div>
      {content?.backgroundImage && (
        <div 
          className="hero-background" 
          style={{backgroundImage: \`url(\${content.backgroundImage})\`}}
        />
      )}
    </section>
  );
};

`;

  // Product Grid Component
  components += `
// Product Grid Component
const ProductGrid = ({ content, styles = {} }) => {
  const products = content?.products || [];
  
  return (
    <section className="product-grid" style={styles}>
      <div className="container">
        {content?.title && <h2 className="section-title">{content.title}</h2>}
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

`;

  // Footer Component
  components += `
// Footer Component
const Footer = ({ content, styles = {} }) => {
  return (
    <footer className="footer" style={styles}>
      <div className="footer-content">
        <div className="footer-section">
          <h4>{content?.companyName || 'My Store'}</h4>
          <p>{content?.description || 'Your trusted online store'}</p>
        </div>
        {content?.links && (
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {content.links.map((link, index) => (
                <li key={index}><a href={link.url}>{link.text}</a></li>
              ))}
            </ul>
          </div>
        )}
        {content?.contact && (
          <div className="footer-section">
            <h4>Contact</h4>
            <p>{content.contact.email}</p>
            <p>{content.contact.phone}</p>
          </div>
        )}
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 {content?.companyName || 'My Store'}. All rights reserved.</p>
      </div>
    </footer>
  );
};

`;

  // Text Section Component
  components += `
// Text Section Component
const TextSection = ({ content, styles = {} }) => {
  return (
    <section className="text-section" style={styles}>
      <div className="container">
        {content?.title && <h2 className="section-title">{content.title}</h2>}
        {content?.content && (
          <div className="text-content" dangerouslySetInnerHTML={{__html: content.content}} />
        )}
      </div>
    </section>
  );
};

`;

  return components;
}

/**
 * Generates the main App component
 */
function generateAppComponent(jsonLayout) {
  const page = jsonLayout.pages[0] || {}; // Use first page
  const sections = page.sections || [];
  
  let appComponent = `
// Main App Component
function App() {
  return (
    <div className="App">
`;

  sections.forEach((section, index) => {
    const componentName = getComponentName(section.type);
    appComponent += `      <${componentName} content={${JSON.stringify(section.content)}} styles={${JSON.stringify(section.styles || {})}} />\n`;
  });

  appComponent += `    </div>
  );
}

export default App;
`;

  return appComponent;
}

/**
 * Maps section type to React component name
 */
function getComponentName(sectionType) {
  const typeMap = {
    'hero': 'HeroSection',
    'products': 'ProductGrid',
    'footer': 'Footer',
    'text': 'TextSection'
  };
  
  return typeMap[sectionType] || 'TextSection';
}

/**
 * Generates CSS styles
 */
function generateCSS(jsonLayout) {
  return `
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
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

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
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

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .products-container {
    grid-template-columns: 1fr;
  }
}
`;
}

/**
 * Generates package.json for the generated React app
 */
function generatePackageJson(storeName) {
  // Sanitize name for npm package requirements (similar to Vercel but stricter)
  const sanitizedName = storeName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')  // Replace invalid chars with dash
    .replace(/-+/g, '-')           // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, '')       // Remove leading/trailing dashes
    .substring(0, 100);            // Reasonable length limit
  
  const finalName = sanitizedName || 'my-store';
  
  return JSON.stringify({
    "name": finalName,
    "version": "1.0.0",
    "private": true,
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-scripts": "5.0.1"
    },
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    },
    "eslintConfig": {
      "extends": [
        "react-app"
      ]
    },
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    }
  }, null, 2);
}

/**
 * Creates a complete React project structure in a temporary directory
 */
async function createReactProject(storeId, jsonLayout, storeName) {
  const buildDir = path.join(__dirname, `../../builds/${storeId}`);
  
  // Create directory structure
  const dirs = [
    buildDir,
    path.join(buildDir, 'src'),
    path.join(buildDir, 'public')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Generate code
  const { appJs, appCss, packageJson } = generateReactCode(jsonLayout);
  
  // Write files
  fs.writeFileSync(path.join(buildDir, 'package.json'), packageJson);
  fs.writeFileSync(path.join(buildDir, 'src', 'App.js'), appJs);
  fs.writeFileSync(path.join(buildDir, 'src', 'App.css'), appCss);
  
  // Create index.js
  const indexJs = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`;
  fs.writeFileSync(path.join(buildDir, 'src', 'index.js'), indexJs);
  
  // Create index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="${storeName} - Online Store" />
    <title>${storeName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;
  fs.writeFileSync(path.join(buildDir, 'public', 'index.html'), indexHtml);
  
  return buildDir;
}

module.exports = {
  generateReactCode,
  createReactProject
};