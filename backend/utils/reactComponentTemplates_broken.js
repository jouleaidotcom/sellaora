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
    
    example: `
import React from 'react';
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
      
      <div className="flex items-center gap-8 mt-12">
        <div>
          <div className="text-3xl font-bold text-gray-900">500K+</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">99.9%</div>
          <div className="text-sm text-gray-600">Uptime</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">50+</div>
          <div className="text-sm text-gray-600">Countries</div>
        </div>
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
    
    example: `
import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye, Filter } from 'lucide-react';

const ProductGrid = ({ 
  products = [], 
  title = "Featured Products",
  showFilters = true 
}) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
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
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked collection of premium products
          </p>
        </div>

        {/* Filters */}
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id || index}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={product.image || 'https://via.placeholder.com/300x300'} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay Actions */}
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

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-bold rounded-full">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Product Info */}
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
                  
                  {product.colors && (
                    <div className="flex gap-1">
                      {product.colors.slice(0, 3).map((color, i) => (
                        <div 
                          key={i}
                          className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
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
  },

  testimonials: {
    prompt: `Generate a testimonials section with Tailwind CSS. Requirements:
- Card-based layout with customer photos
- Star ratings and review text
- Smooth animations and hover effects
- Responsive grid layout
- Social proof indicators
- Avatar placeholders and loading states
- Modern design with gradients`,
    
    example: `
import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = ({ 
  testimonials = [], 
  title = "What Our Customers Say" 
}) => {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              
              {/* Quote Icon */}
              <div className="relative z-10 mb-6">
                <Quote className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
              
              {/* Rating */}
              <div className="relative z-10 flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={\`w-5 h-5 \${
                      i < (testimonial.rating || 5) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }\`} 
                  />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="relative z-10 text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.text || 'Amazing product and service! Highly recommend.'}"
              </p>
              
              {/* Customer Info */}
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {testimonial.avatar ? (
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    testimonial.name?.[0]?.toUpperCase() || 'C'
                  )}
                </div>
                
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.name || 'Happy Customer'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role || 'Verified Buyer'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-black text-purple-600 mb-2">10k+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-black text-pink-600 mb-2">4.9</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-black text-purple-600 mb-2">50k+</div>
            <div className="text-gray-600">Reviews</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-black text-pink-600 mb-2">99%</div>
            <div className="text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;`
  },

  features: {
    prompt: `Generate a features section with Tailwind CSS. Requirements:
- Icon-based feature cards with hover effects
- Multiple layout variants (grid, alternating, icons-row)
- Modern icons and illustrations
- Animated counters and progress bars
- Responsive design with mobile optimizations
- Gradient backgrounds and glassmorphism
- Interactive hover states`,

    example: `
import React from 'react';
import { Zap, Shield, Rocket, Heart, Star, Smartphone } from 'lucide-react';

const Features = ({ 
  features = [], 
  title = "Why Choose Us",
  variant = "grid",
  theme = "light" 
}) => {
  const iconMap = {
    zap: Zap,
    shield: Shield,
    rocket: Rocket,
    heart: Heart,
    star: Star,
    smartphone: Smartphone
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName?.toLowerCase()] || Zap;
    return <IconComponent className="w-8 h-8" />;
  };

  if (variant === "alternating") {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              {title}
            </h2>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={\`flex flex-col \${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12\`}
              >
                <div className="flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mb-6">
                    {getIcon(feature.icon)}
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    Learn More
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl flex items-center justify-center">
                    <div className="text-6xl">
                      {feature.emoji || '🚀'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={\`py-16 \${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}\`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={\`text-4xl md:text-5xl font-black mb-4 \${
            theme === 'dark' 
              ? 'text-white' 
              : 'bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent'
          }\`}>
            {title}
          </h2>
          <p className={\`text-xl max-w-2xl mx-auto \${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}\`}>
            Discover the features that make us stand out from the competition
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={\`group p-8 rounded-3xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl \${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-750' 
                  : 'bg-white hover:shadow-blue-500/10'
              }\`}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                {getIcon(feature.icon)}
              </div>
              
              {/* Title */}
              <h3 className={\`text-2xl font-bold mb-4 \${theme === 'dark' ? 'text-white' : 'text-gray-900'}\`}>
                {feature.title || 'Feature Title'}
              </h3>
              
              {/* Description */}
              <p className={\`leading-relaxed \${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}\`}>
                {feature.description || 'Feature description goes here with compelling details.'}
              </p>
              
              {/* Stats */}
              {feature.stat && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className={\`text-3xl font-black mb-1 \${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}\`}>
                    {feature.stat}
                  </div>
                  <div className={\`text-sm \${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}\`}>
                    {feature.statLabel || 'Improvement'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;`
  },

  footer: {
    prompt: `Generate a comprehensive footer component with Tailwind CSS. Requirements:
- Multi-column layout with company info, links, and contact
- Social media icons with hover effects
- Newsletter subscription form
- Modern design with gradients and dark theme
- Responsive layout that stacks on mobile
- Legal links and copyright notice
- Contact information and location`,

    example: `
import React, { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Send,
  Heart 
} from 'lucide-react';

const Footer = ({ 
  companyName = "Your Company", 
  description = "Building amazing digital experiences",
  links = [],
  contact = {},
  theme = "dark" 
}) => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { text: 'About Us', href: '/about' },
    { text: 'Products', href: '/products' },
    { text: 'Services', href: '/services' },
    { text: 'Contact', href: '/contact' },
  ];

  const supportLinks = [
    { text: 'Help Center', href: '/help' },
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Terms of Service', href: '/terms' },
    { text: 'Refund Policy', href: '/refunds' },
  ];

  return (
    <footer className={\`\${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} relative overflow-hidden\`}>
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 opacity-10 rounded-full mix-blend-multiply filter blur-xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 opacity-10 rounded-full mix-blend-multiply filter blur-xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {companyName[0]?.toUpperCase()}
                </div>
                <span className="text-2xl font-black">{companyName}</span>
              </div>
              
              <p className={\`text-lg mb-8 leading-relaxed max-w-md \${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}\`}>
                {description}
              </p>

              {/* Newsletter Signup */}
              <div className="mb-8">
                <h4 className="text-lg font-bold mb-4">Stay Updated</h4>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={\`flex-1 px-4 py-3 rounded-xl border-2 transition-colors duration-200 \${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none\`}
                    required
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={\`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg \${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 text-gray-300 hover:text-white' 
                        : 'bg-gray-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 text-gray-600 hover:text-white'
                    }\`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className={\`transition-colors duration-200 hover:text-blue-500 \${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }\`}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Contact */}
            <div>
              <h4 className="text-lg font-bold mb-6">Support</h4>
              <ul className="space-y-4 mb-8">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className={\`transition-colors duration-200 hover:text-blue-500 \${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }\`}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="space-y-3">
                {contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className={\`\${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}\`}>
                      {contact.email}
                    </span>
                  </div>
                )}
                
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span className={\`\${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}\`}>
                      {contact.phone}
                    </span>
                  </div>
                )}
                
                {contact.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className={\`\${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}\`}>
                      {contact.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={\`border-t \${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} px-4 py-6\`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className={\`text-sm \${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2\`}>
              <span>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500" /> by our team
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="/privacy" className={\`text-sm transition-colors duration-200 hover:text-blue-500 \${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}\`}>
                Privacy
              </a>
              <a href="/terms" className={\`text-sm transition-colors duration-200 hover:text-blue-500 \${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}\`}>
                Terms
              </a>
              <a href="/cookies" className={\`text-sm transition-colors duration-200 hover:text-blue-500 \${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}\`}>
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;`
  }
};

module.exports = { COMPONENT_TEMPLATES };