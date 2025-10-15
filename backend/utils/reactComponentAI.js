const { COMPONENT_TEMPLATES } = require('./reactComponentTemplates');

const COMPONENT_GENERATION_PROMPTS = {
  navbar: (content, theme) => `
You are an expert React developer specializing in modern, beautiful UI components with Tailwind CSS.

Generate a COMPLETE, production-ready React navbar component with the following requirements:

DESIGN REQUIREMENTS:
- Modern, clean design with glassmorphism effects
- Responsive mobile menu with smooth animations
- Sticky header with backdrop blur
- ${theme === 'dark' ? 'Dark theme with subtle transparency' : 'Light theme with clean aesthetics'}
- Professional typography and spacing

FUNCTIONALITY:
- Mobile hamburger menu toggle
- Smooth hover effects and transitions
- Logo display: "${content.logo || 'Brand'}"
- Navigation links: ${JSON.stringify(content.links || [])}
- Action buttons: Search, User profile, Shopping cart
- Cart badge with item count

TECHNICAL REQUIREMENTS:
- Use React functional components with hooks
- Import Lucide React icons (Menu, X, ShoppingBag, User, Search)
- Use Tailwind CSS classes only (no custom CSS)
- Mobile-first responsive design
- Accessibility best practices
- Modern gradient effects and shadows

CONTENT:
${JSON.stringify(content, null, 2)}

Generate ONLY the complete React component code. Include all imports, the component function, and export default.
Use modern ES6+ syntax and follow React best practices.

The component should be visually stunning with:
- Subtle gradients and shadows
- Smooth animations (duration-300)
- Professional hover states
- Perfect mobile responsiveness
- Modern color palette with blues and purples
`,

  hero: (content, variant = 'centered') => `
You are an expert React developer creating stunning hero sections.

Generate a COMPLETE, modern React hero component with the following specifications:

DESIGN REQUIREMENTS:
- Layout variant: "${variant}" (centered, split-screen, minimal)
- Stunning gradient backgrounds (blue to purple spectrum)
- Modern typography with large, bold headlines
- Call-to-action buttons with hover effects
- Statistics/social proof indicators
- Professional spacing and hierarchy

CONTENT TO INCLUDE:
- Title: "${content.title || 'Build Your Dream Store'}"
- Subtitle: "${content.subtitle || 'Create beautiful e-commerce experiences'}"
- Primary CTA: "${content.primaryCTA || 'Get Started'}"
- Secondary CTA: "${content.secondaryCTA || 'Watch Demo'}"
${content.image ? `- Hero image: "${content.image}"` : ''}

TECHNICAL REQUIREMENTS:
- React functional component with hooks
- Import Lucide React icons (ArrowRight, Play, Star)
- Tailwind CSS only - no custom CSS
- Responsive design (mobile-first)
- Smooth animations and micro-interactions
- Modern gradient text effects
- Professional button designs with hover states

VISUAL EFFECTS:
- Gradient text for headlines
- Shadow effects on buttons
- Hover animations (scale, translate, shadow)
- Star ratings display
- Statistics counter section
- Professional color scheme

${variant === 'split' ? 'Create a two-column layout with content on left, image/visual on right' : 'Create a centered layout with all content in the middle'}

Generate ONLY the complete React component code with all necessary imports.
`,

  products: (content, filters = true) => `
You are an expert React developer creating modern e-commerce product grids.

Generate a COMPLETE, production-ready React product grid component with these specifications:

DESIGN REQUIREMENTS:
- Modern card-based layout with hover effects
- Responsive grid (1-4 columns based on screen size)
- Product cards with images, ratings, prices
- ${filters ? 'Filter system with categories' : 'Simple grid layout'}
- Add to cart and wishlist functionality
- Loading and empty states
- Professional shadows and animations

CONTENT:
${JSON.stringify(content, null, 2)}

CARD FEATURES:
- Product image with hover zoom effect
- Star rating system (1-5 stars)
- Product name and description
- Price display with original price strikethrough
- Add to cart button with icon
- Wishlist heart icon toggle
- Color variants display
- Hover overlay with quick actions

TECHNICAL REQUIREMENTS:
- React functional component with useState
- Import Lucide React icons (Heart, ShoppingCart, Star, Eye, Filter)
- Tailwind CSS classes only
- Responsive grid system
- State management for wishlist and filters
- Modern animation effects (transform, shadow)
- Professional color gradients (blue to purple)

INTERACTIVE FEATURES:
- Category filtering buttons
- Wishlist toggle functionality
- Hover effects on cards
- Add to cart button interactions
- Empty state with emoji and message

Generate ONLY the complete React component code with all imports and functionality.
`,

  testimonials: (content) => `
You are an expert React developer creating beautiful testimonials sections.

Generate a COMPLETE React testimonials component with these requirements:

DESIGN REQUIREMENTS:
- Card-based layout with customer photos/avatars
- Star rating displays for each testimonial
- Modern gradient backgrounds (purple to pink)
- Smooth hover animations and effects
- Responsive grid layout
- Professional typography and spacing

CONTENT:
${JSON.stringify(content, null, 2)}

CARD FEATURES:
- Customer avatar or initial placeholder
- 5-star rating system
- Testimonial text with quote styling
- Customer name and role/title
- Background decorative elements
- Hover lift effects
- Shadow animations

TECHNICAL REQUIREMENTS:
- React functional component
- Import Lucide React icons (Star, Quote)
- Tailwind CSS only
- Mobile-first responsive design
- Professional animations (duration-300)
- Modern gradient effects
- Accessibility considerations

ADDITIONAL FEATURES:
- Statistics section below testimonials (Happy Customers, Average Rating, etc.)
- Background decorative elements
- Professional color scheme (purples and pinks)
- Quote icon styling
- Customer avatar handling (image or initial)

Generate ONLY the complete React component code with all necessary imports.
`,

  features: (content, variant = 'grid') => `
You are an expert React developer creating modern feature sections.

Generate a COMPLETE React features component with these specifications:

DESIGN REQUIREMENTS:
- Layout variant: "${variant}" (grid, alternating, icons-row)
- Icon-based feature cards with hover effects
- Modern gradients and glassmorphism
- Professional animations and transitions
- Responsive design for all devices
- Clean typography hierarchy

CONTENT:
${JSON.stringify(content, null, 2)}

CARD FEATURES:
- Modern icons from Lucide React
- Feature title and description
- Optional statistics/metrics
- Gradient icon backgrounds
- Hover animations (lift, scale, glow)
- Professional spacing and alignment

TECHNICAL REQUIREMENTS:
- React functional component
- Import Lucide React icons (Zap, Shield, Rocket, Heart, Star, Smartphone)
- Icon mapping system for dynamic icons
- Tailwind CSS classes only
- Mobile-first responsive grid
- Professional animation effects
- Modern gradient colors (blue to purple)

INTERACTIVE EFFECTS:
- Card hover lift animations
- Icon scaling on hover
- Shadow effects
- Call-to-action section
- Professional button styling

${variant === 'alternating' ? 'Create alternating left-right layout with icons and content' : 'Create responsive grid layout with feature cards'}

Generate ONLY the complete React component code with all imports and functionality.
`,

  footer: (content) => `
You are an expert React developer creating comprehensive footer components.

Generate a COMPLETE React footer component with these requirements:

DESIGN REQUIREMENTS:
- Multi-column responsive layout
- Company info, quick links, support, contact
- Newsletter subscription form
- Social media icons with hover effects
- Modern dark theme with gradient accents
- Professional typography and spacing

CONTENT:
${JSON.stringify(content, null, 2)}

FEATURES TO INCLUDE:
- Company logo and description
- Newsletter signup form with email input
- Social media icons (Facebook, Twitter, Instagram, LinkedIn)
- Quick links navigation
- Support/legal links
- Contact information with icons
- Copyright notice
- Background decorative elements

TECHNICAL REQUIREMENTS:
- React functional component with useState
- Import Lucide React icons (Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Heart)
- Newsletter form with onSubmit handler
- Tailwind CSS classes only
- Mobile-first responsive layout
- Professional hover effects
- Modern gradient accents

INTERACTIVE FEATURES:
- Newsletter form submission
- Social media icon hover effects
- Link hover animations
- Background decorative elements
- Professional color scheme (dark with blue/purple accents)

Generate ONLY the complete React component code with all imports and functionality.
`
};

/**
 * Generate individual React components using OpenAI
 */
async function generateReactComponent(componentType, content = {}, options = {}) {
  const { variant, theme = 'light', apiKey, modelName = 'gpt-4o-mini' } = options;
  
  const promptFunctions = {
    navbar: () => COMPONENT_GENERATION_PROMPTS.navbar(content, theme),
    hero: () => COMPONENT_GENERATION_PROMPTS.hero(content, variant),
    products: () => COMPONENT_GENERATION_PROMPTS.products(content, options.showFilters),
    testimonials: () => COMPONENT_GENERATION_PROMPTS.testimonials(content),
    features: () => COMPONENT_GENERATION_PROMPTS.features(content, variant),
    footer: () => COMPONENT_GENERATION_PROMPTS.footer(content)
  };

  const generatePrompt = promptFunctions[componentType];
  if (!generatePrompt) {
    throw new Error(`Unsupported component type: ${componentType}`);
  }

  const prompt = generatePrompt();

  try {
    console.log(`🎨 Generating ${componentType} component...`);
    
    // Build headers for OpenAI API request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    
    if (process.env.OPENAI_PROJECT_ID) {
      headers['OpenAI-Project'] = process.env.OPENAI_PROJECT_ID;
    }
    if (process.env.OPENAI_ORG_ID) {
      headers['OpenAI-Organization'] = process.env.OPENAI_ORG_ID;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: 'You are an expert React developer who creates beautiful, modern components with Tailwind CSS. Always return ONLY the complete component code without any explanations or markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenAI API error for ${componentType}:`, response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedCode = data?.choices?.[0]?.message?.content || '';

    if (!generatedCode.trim()) {
      throw new Error(`Empty response for ${componentType} component`);
    }

    console.log(`✅ Generated ${componentType} component (${generatedCode.length} chars)`);
    return {
      type: componentType,
      code: generatedCode.trim(),
      content,
      variant,
      theme
    };

  } catch (error) {
    console.error(`❌ Failed to generate ${componentType} component:`, error.message);
    
    // Fallback to template if API fails
    const template = COMPONENT_TEMPLATES[componentType];
    if (template) {
      console.log(`🔄 Using fallback template for ${componentType}`);
      return {
        type: componentType,
        code: template.example.trim(),
        content,
        variant,
        theme,
        isTemplate: true
      };
    }
    
    throw error;
  }
}

/**
 * Generate a complete React website with multiple components
 */
async function generateReactWebsite(websiteConfig, apiKey, modelName = 'gpt-4o-mini') {
  const {
    siteName = 'Your Store',
    industry = 'ecommerce',
    theme = 'modern',
    components = ['navbar', 'hero', 'products', 'features', 'testimonials', 'footer']
  } = websiteConfig;

  console.log(`🚀 Generating React website: ${siteName} (${industry})`);
  
  const generatedComponents = {};
  const componentOrder = [];

  // Define component configurations based on industry
  const componentConfigs = {
    navbar: {
      content: {
        logo: siteName,
        links: [
          { text: 'Home', url: '/' },
          { text: 'Products', url: '/products' },
          { text: 'About', url: '/about' },
          { text: 'Contact', url: '/contact' }
        ]
      },
      options: { theme: theme === 'dark' ? 'dark' : 'light' }
    },
    
    hero: {
      content: {
        title: `Welcome to ${siteName}`,
        subtitle: industry === 'ecommerce' 
          ? 'Discover amazing products and deals' 
          : 'Building the future of digital experiences',
        primaryCTA: 'Shop Now',
        secondaryCTA: 'Learn More'
      },
      options: { variant: 'centered', theme }
    },
    
    products: {
      content: {
        title: 'Featured Products',
        products: [
          {
            id: 1,
            name: 'Premium Product',
            description: 'High-quality product with amazing features',
            price: '$99',
            originalPrice: '$129',
            image: 'https://picsum.photos/400/400',
            rating: 5,
            reviews: 128,
            badge: 'Bestseller',
            category: 'featured'
          },
          {
            id: 2,
            name: 'Popular Item',
            description: 'Customer favorite with excellent reviews',
            price: '$79',
            image: 'https://picsum.photos/401/400',
            rating: 4,
            reviews: 89,
            category: 'popular'
          },
          {
            id: 3,
            name: 'New Arrival',
            description: 'Latest addition to our collection',
            price: '$119',
            image: 'https://picsum.photos/402/400',
            rating: 5,
            reviews: 45,
            badge: 'New',
            category: 'new'
          }
        ]
      },
      options: { showFilters: true }
    },
    
    features: {
      content: {
        title: 'Why Choose Us',
        features: [
          {
            icon: 'zap',
            title: 'Fast Delivery',
            description: 'Get your orders delivered quickly with our express shipping options.',
            stat: '24h',
            statLabel: 'Average delivery'
          },
          {
            icon: 'shield',
            title: 'Secure Payment',
            description: 'Your transactions are protected with bank-level security measures.',
            stat: '100%',
            statLabel: 'Secure transactions'
          },
          {
            icon: 'heart',
            title: '24/7 Support',
            description: 'Our dedicated team is here to help you anytime you need assistance.',
            stat: '24/7',
            statLabel: 'Customer support'
          }
        ]
      },
      options: { variant: 'grid', theme }
    },
    
    testimonials: {
      content: {
        title: 'What Our Customers Say',
        testimonials: [
          {
            name: 'Sarah Johnson',
            role: 'Verified Buyer',
            text: 'Absolutely amazing products and service! Fast delivery and excellent quality.',
            rating: 5,
            avatar: 'https://i.pravatar.cc/150?img=1'
          },
          {
            name: 'Michael Chen',
            role: 'Premium Customer',
            text: 'Best shopping experience I\'ve had online. Highly recommend to everyone!',
            rating: 5,
            avatar: 'https://i.pravatar.cc/150?img=2'
          },
          {
            name: 'Emily Davis',
            role: 'Happy Customer',
            text: 'Great variety of products and competitive prices. Will definitely shop again!',
            rating: 5,
            avatar: 'https://i.pravatar.cc/150?img=3'
          }
        ]
      },
      options: {}
    },
    
    footer: {
      content: {
        companyName: siteName,
        description: `${siteName} - Your trusted partner for quality products and exceptional service.`,
        contact: {
          email: 'hello@yourstore.com',
          phone: '+1 (555) 123-4567',
          address: '123 Business St, City, ST 12345'
        }
      },
      options: { theme: 'dark' }
    }
  };

  // Generate components sequentially
  for (const componentType of components) {
    if (!componentConfigs[componentType]) {
      console.warn(`⚠️ No configuration found for component: ${componentType}`);
      continue;
    }

    try {
      const config = componentConfigs[componentType];
      const component = await generateReactComponent(
        componentType,
        config.content,
        { ...config.options, apiKey, modelName }
      );
      
      generatedComponents[componentType] = component;
      componentOrder.push(componentType);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      } catch (error) {
        console.error(`❌ Failed to generate ${componentType}:`, error.message);
        
        // Add a simplified fallback component
        const fallback = {
          type: componentType,
          code: `// Fallback ${componentType} component\nconst ${componentType.charAt(0).toUpperCase() + componentType.slice(1)} = () => <div>${componentType} component</div>;\nexport default ${componentType.charAt(0).toUpperCase() + componentType.slice(1)};`,
          content: config.content,
          theme: config.options.theme || 'light',
          isFallback: true
        };
        
        generatedComponents[componentType] = fallback;
        componentOrder.push(componentType);
        
        console.log(`🔄 Added fallback for ${componentType}`);
        // Continue with other components even if one fails
      }
  }

  console.log(`✅ Generated ${Object.keys(generatedComponents).length} components for ${siteName}`);
  
  return {
    siteName,
    industry,
    theme,
    components: generatedComponents,
    componentOrder,
    generatedAt: new Date().toISOString(),
    metadata: {
      totalComponents: Object.keys(generatedComponents).length,
      generationTime: Date.now(),
      apiModel: modelName
    }
  };
}

module.exports = {
  generateReactComponent,
  generateReactWebsite,
  COMPONENT_GENERATION_PROMPTS
};