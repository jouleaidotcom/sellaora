const COMPONENT_TEMPLATES = {
  navbar: {
    prompt: `Generate a modern, responsive navbar React component with Tailwind CSS. Requirements:
- Clean, minimal design with glassmorphism effects
- Responsive mobile menu with hamburger icon
- Logo, navigation links, and action buttons (login, cart)
- Sticky header with backdrop blur
- Dark/light theme support
- Smooth hover animations
- Mobile-first responsive design`,
    
    example: `import React, { useState } from 'react';
import { Menu, X, ShoppingBag, User, Search } from 'lucide-react';

const Navbar = ({ logo = "Brand", links = [], theme = "dark" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className={\`fixed top-0 w-full z-50 backdrop-blur-md transition-all duration-300 \${
      theme === 'dark' 
        ? 'bg-black/80 border-white/10 text-white' 
        : 'bg-white/80 border-black/10 text-black'
    } border-b\`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {logo[0]?.toUpperCase()}
            </div>
            <span className="text-xl font-bold tracking-tight">{logo}</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {links.map((link, index) => (
              <a 
                key={index}
                href={link.url || '#'}
                className="text-sm font-medium hover:text-blue-500 transition-colors duration-200 relative group"
              >
                {link.text}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors hidden sm:block" />
            <User className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
            <div className="relative">
              <ShoppingBag className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </div>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/20 rounded-lg mt-2 backdrop-blur-sm">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url || '#'}
                  className="block px-3 py-2 text-base font-medium hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;`
  },

  hero: {
    prompt: `Generate a stunning hero section React component with Tailwind CSS. Requirements:
- Multiple layout variants (centered, split-screen, minimal, gradient)
- Animated elements and micro-interactions
- Call-to-action buttons with hover effects
- Background image support with overlay
- Typography hierarchy with modern fonts
- Responsive design for all devices
- Glassmorphism and modern gradients`,
    
    example: `import React from 'react';
import { ArrowRight, Play, Star } from 'lucide-react';

const Hero = ({ 
  title = "Build Your Dream Store", 
  subtitle = "Create beautiful e-commerce experiences",
  primaryCTA = "Get Started",
  secondaryCTA = "Watch Demo",
  image,
  variant = "centered",
  theme = "gradient"
}) => {
  const renderContent = () => (
    <div className="text-center lg:text-left">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
        </div>
        <span className="text-sm text-gray-600">Trusted by 10,000+ businesses</span>
      </div>
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
        {subtitle}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
        <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
          {primaryCTA}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <button className="group px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2">
          <Play className="w-5 h-5" />
          {secondaryCTA}
        </button>
      </div>
    </div>
  );

  if (variant === "split") {
    return (
      <section className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {renderContent()}
            <div className="relative">
              {image && (
                <img 
                  src={image} 
                  alt="Hero" 
                  className="rounded-3xl shadow-2xl object-cover w-full h-[500px] lg:h-[600px]"
                />
              )}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                🚀
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {renderContent()}
      </div>
    </section>
  );
};

export default Hero;`
  },

  products: {
    prompt: `Generate a modern product grid component with Tailwind CSS. Requirements:
- Responsive grid layout with cards
- Product cards with hover effects and animations
- Price, rating, and quick actions
- Filter and sorting options
- Loading states and empty states
- Add to cart and wishlist functionality
- Image lazy loading and error handling
- Modern UI with gradients and shadows`,
    
    example: `import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye, Filter } from 'lucide-react';

const ProductGrid = ({ 
  products = [], 
  title = "Featured Products",
  showFilters = true 
}) => {
  const [filter, setFilter] = useState('all');
  const [wishlist, setWishlist] = useState(new Set());

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.category?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked collection of premium products
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <div className="flex items-center gap-4 bg-white rounded-2xl p-2 shadow-lg">
              <Filter className="w-5 h-5 text-gray-500" />
              {['all', 'clothing', 'accessories', 'shoes'].map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={\`px-6 py-2 rounded-xl font-medium transition-all duration-200 \${
                    filter === category 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }\`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id || index}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image || 'https://via.placeholder.com/300x300'} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className={\`w-10 h-10 rounded-full backdrop-blur-md transition-all duration-200 flex items-center justify-center \${
                      wishlist.has(product.id)
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                    }\`}
                  >
                    <Heart className="w-5 h-5" fill={wishlist.has(product.id) ? "currentColor" : "none"} />
                  </button>
                  
                  <button className="w-10 h-10 bg-white/80 text-gray-700 rounded-full backdrop-blur-md hover:bg-blue-500 hover:text-white transition-all duration-200 flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-bold rounded-full">
                    {product.badge}
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={\`w-4 h-4 \${i < (product.rating || 5) ? 'fill-current' : ''}\`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews || 0})</span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-gray-900">
                      {product.price || '$0'}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;`
  }
};

module.exports = { COMPONENT_TEMPLATES };