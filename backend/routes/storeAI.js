const express = require('express');
const fs = require('fs');
const path = require('path');
const Store = require('../models/Store');
const authMiddleware = require('../middleware/authMiddleware');
const ownerCheckMiddleware = require('../middleware/ownerCheckMiddleware');

const router = express.Router();

// Industry-specific design templates with different structures
const DESIGN_ARCHETYPES = {
  ecommerce: {
    structure: ['hero-product', 'featured-products', 'categories', 'testimonials', 'instagram-feed', 'newsletter'],
    pages: ['Home', 'Shop', 'Product', 'Cart', 'About'],
    stylePresets: ['modern', 'minimal', 'bold'],
    layouts: ['grid-heavy', 'image-focused', 'card-based']
  },
  saas: {
    structure: ['hero-headline', 'features-grid', 'how-it-works', 'pricing-tiers', 'testimonials', 'cta-banner'],
    pages: ['Home', 'Features', 'Pricing', 'About', 'Contact'],
    stylePresets: ['professional', 'modern', 'tech'],
    layouts: ['centered-content', 'split-screen', 'floating-cards']
  },
  portfolio: {
    structure: ['hero-minimal', 'portfolio-masonry', 'about-visual', 'services', 'contact-form'],
    pages: ['Home', 'Work', 'About', 'Services', 'Contact'],
    stylePresets: ['minimal', 'bold', 'creative'],
    layouts: ['masonry', 'full-bleed', 'asymmetric']
  },
  restaurant: {
    structure: ['hero-image', 'menu-showcase', 'chef-story', 'gallery-food', 'reservations', 'location-map'],
    pages: ['Home', 'Menu', 'About', 'Reservations', 'Contact'],
    stylePresets: ['elegant', 'warm', 'luxury'],
    layouts: ['image-driven', 'menu-focused', 'story-telling']
  },
  agency: {
    structure: ['hero-bold', 'services-cards', 'case-studies', 'team', 'process-timeline', 'contact'],
    pages: ['Home', 'Services', 'Work', 'Team', 'Contact'],
    stylePresets: ['bold', 'creative', 'professional'],
    layouts: ['dynamic', 'section-breaks', 'diagonal-cuts']
  },
  blog: {
    structure: ['hero-banner', 'featured-posts', 'post-grid', 'categories', 'author-bio', 'newsletter'],
    pages: ['Home', 'Blog', 'About', 'Categories', 'Contact'],
    stylePresets: ['minimal', 'editorial', 'magazine'],
    layouts: ['magazine', 'sidebar', 'featured-first']
  },
  landing: {
    structure: ['hero-conversion', 'benefits', 'social-proof', 'faq', 'final-cta'],
    pages: ['Home'],
    stylePresets: ['high-contrast', 'conversion-focused', 'bold'],
    layouts: ['single-page', 'long-scroll', 'section-anchored']
  }
};

// Comprehensive section type library - STANDARDIZED NAMES
const SECTION_CATALOG = `
SECTION TYPES BY CATEGORY (use these exact type names):

HERO VARIATIONS:
- hero: Default hero with overlay (specify variant: "overlay", "minimal", "split", "gradient")
- Type: "hero", variant: "minimal" - Clean, centered text
- Type: "hero", variant: "split" - Split screen layout
- Type: "hero", variant: "overlay" - Full-width with overlay text

CONTENT SECTIONS:
- features: Feature grid (specify variant: "cards", "icons-row", "alternating")
- stats: Statistics showcase with numbers
- process: Step-by-step process or timeline
- about: About section with text and optional image
- textblock: Rich text content section

VISUAL SECTIONS:
- gallery: Image gallery (specify variant: "grid", "masonry", "carousel")
- video: Video embed section
- categories: Category tiles with images

SOCIAL PROOF:
- testimonials: Customer testimonials (specify variant: "cards", "slider")
- partners: Partner/client logos

COMMERCE:
- products: Product grid for e-commerce
- pricing: Pricing tiers with features
- services: Service offerings

CONVERSION:
- cta: Call-to-action section
- newsletter: Email signup form
- contact: Contact form with fields
- location: Location/map with contact info

TEAM & INFO:
- team: Team member cards
- faq: FAQ accordion

NAVIGATION:
- navbar: Navigation bar (usually auto-added)
- footer: Footer section (usually auto-added)

IMPORTANT: Use simple type names (e.g., "hero", "features", "testimonials") and use the "variant" property for variations.
Example: { "type": "hero", "variant": "split", ... }
NOT: { "type": "hero-split", ... }
`;

// Visual style variations
const STYLE_SYSTEM = `
STYLE PRESETS:
- minimal: Clean, lots of whitespace, subtle colors, simple typography
- modern: Geometric shapes, gradients, rounded corners, contemporary
- bold: High contrast, large typography, vibrant colors, dramatic
- elegant: Refined typography, muted colors, sophisticated spacing
- playful: Rounded everything, bright colors, friendly tone
- professional: Structured, corporate colors, serif fonts, formal
- luxury: Premium feel, gold accents, premium imagery
- tech: Futuristic, blue/purple tones, sharp edges, innovative
- creative: Asymmetric layouts, artistic elements, unique patterns
- editorial: Magazine-style, strong typography, image-text balance
- brutalist: Raw, stark, unconventional, experimental
- glass: Glassmorphism effects, transparency, blur, depth
- neumorphic: Soft shadows, subtle elevation, tactile feel
- gradient: Colorful gradients, vibrant, energetic
`;

const LAYOUT_PATTERNS = `
LAYOUT ARCHITECTURES:
- grid-heavy: Everything in grids, structured, organized
- image-focused: Large images dominate, minimal text
- card-based: Content in cards, clear boundaries
- centered-content: All content centered, symmetrical
- split-screen: Divided layouts, contrasting sections
- floating-cards: Cards with shadows, layered
- masonry: Pinterest-style, varying heights
- full-bleed: Edge-to-edge imagery, immersive
- asymmetric: Off-center, dynamic, interesting
- magazine: Editorial layouts, columns, typography
- single-page: All content on one page, smooth scroll
- long-scroll: Extended single page, story-driven
- sidebar: Content + sidebar navigation
- section-breaks: Clear section dividers, distinct areas
- diagonal-cuts: Angled section breaks, dynamic
- section-anchored: Jump-to sections, navigation links
`;

function buildEnhancedPrompt(userPrompt, storeContext = {}, previousAttempts = 0) {
  // Analyze prompt to detect industry/type
  const promptLower = userPrompt.toLowerCase();
  let detectedType = 'landing';
  let keywords = [];
  
  if (promptLower.includes('shop') || promptLower.includes('store') || promptLower.includes('ecommerce') || promptLower.includes('coffee') || promptLower.includes('product')) {
    detectedType = 'ecommerce';
    keywords = ['coffee', 'shop', 'product', 'menu', 'buy'];
  } else if (promptLower.includes('saas') || promptLower.includes('software') || promptLower.includes('app') || promptLower.includes('platform')) {
    detectedType = 'saas';
    keywords = ['features', 'workflow', 'automation', 'solution', 'productivity'];
  } else if (promptLower.includes('portfolio') || promptLower.includes('designer') || promptLower.includes('photographer')) {
    detectedType = 'portfolio';
    keywords = ['work', 'projects', 'creative', 'showcase'];
  } else if (promptLower.includes('restaurant') || promptLower.includes('cafe') || promptLower.includes('food') || promptLower.includes('menu')) {
    detectedType = 'restaurant';
    keywords = ['menu', 'chef', 'dining', 'cuisine'];
  } else if (promptLower.includes('agency') || promptLower.includes('marketing') || promptLower.includes('consulting')) {
    detectedType = 'agency';
    keywords = ['services', 'team', 'solutions', 'clients'];
  } else if (promptLower.includes('blog') || promptLower.includes('magazine') || promptLower.includes('news')) {
    detectedType = 'blog';
    keywords = ['articles', 'posts', 'stories', 'content'];
  }

  const archetype = DESIGN_ARCHETYPES[detectedType] || DESIGN_ARCHETYPES.landing;
  
  // Randomize style choices for variety
  const randomStyle = archetype.stylePresets[Math.floor(Math.random() * archetype.stylePresets.length)];
  const randomLayout = archetype.layouts[Math.floor(Math.random() * archetype.layouts.length)];
  
  // Add variation based on attempt number to avoid repeats
  const variationSeed = previousAttempts > 0 ? `\nVARIATION ${previousAttempts + 1}: Use a completely different visual approach than before.` : '';
  
  const randomSeed = Math.random().toString(36).substring(7);
  const timestamp = Date.now();

  return `You are an expert web designer AI creating UNIQUE, DIVERSE website designs.

${SECTION_CATALOG}

${STYLE_SYSTEM}

${LAYOUT_PATTERNS}

DETECTED WEBSITE TYPE: ${detectedType.toUpperCase()}
SUGGESTED STRUCTURE: ${archetype.structure.join(' → ')}
RECOMMENDED PAGES: ${archetype.pages.join(', ')}
STYLE DIRECTION: ${randomStyle}
LAYOUT PATTERN: ${randomLayout}
KEYWORDS TO EMPHASIZE: ${keywords.join(', ')}${variationSeed}

CRITICAL REQUIREMENTS:
1. The visual structure MUST match the website type (${detectedType})
2. DO NOT use generic hero → features → testimonials for everything
3. Each industry needs DIFFERENT section types and order
4. For ${detectedType} specifically:
   ${detectedType === 'ecommerce' ? '- Use product grids, category showcases, shopping features\n   - Include "Shop" page with product listings\n   - Use warm, inviting colors' : ''}
   ${detectedType === 'saas' ? '- Use features-grid, how-it-works, pricing tiers\n   - Include "Features" and "Pricing" pages\n   - Use modern, tech-forward colors (blues, purples)' : ''}
   ${detectedType === 'portfolio' ? '- Use masonry galleries, project showcases\n   - Include "Work" page with portfolio items\n   - Use minimal, creative styling' : ''}
   ${detectedType === 'restaurant' ? '- Use menu showcases, food galleries, reservation forms\n   - Include "Menu" page with food items\n   - Use warm, appetizing colors' : ''}
   ${detectedType === 'agency' ? '- Use service cards, case studies, team profiles\n   - Include "Services" and "Work" pages\n   - Use bold, professional styling' : ''}

USER PROMPT: "${userPrompt}"
RANDOMNESS: ${randomSeed}-${timestamp}

OUTPUT SCHEMA (JSON only, no markdown):
{
  "theme": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "backgroundColor": "#hex",
    "textColor": "#hex",
    "bannerUrl": "",
    "logoUrl": "",
    "fonts": "Font1, Font2, fallback",
    "stylePreset": "${randomStyle}",
    "borderRadius": "sm|md|lg|xl|2xl|pill",
    "shadow": "none|soft|medium|elevated|dramatic",
    "layoutPattern": "${randomLayout}"
  },
  "layout": {
    "pages": [
      {
        "name": "Page Name",
        "path": "/path",
        "description": "Purpose of this page",
        "sections": [
          {
            "type": "hero|features|products|testimonials|pricing|gallery|stats|process|about|team|faq|cta|newsletter|contact|location|categories|partners",
            "variant": "optional-variant-name",
            "id": "unique-id",
            "title": "Section Title",
            "subtitle": "Optional subtitle",
            ...type-specific-properties
          }
        ]
      }
    ]
  },
  "metadata": {
    "siteName": "Name",
    "description": "SEO description",
    "industry": "${detectedType}"
  }
}

CRITICAL SECTION RULES:
- Use SIMPLE type names: "hero", "features", "products", "testimonials", etc.
- Use "variant" property for variations: { "type": "hero", "variant": "split" }
- DO NOT use compound type names like "hero-split" or "features-grid"
- Valid types: hero, features, products, services, testimonials, pricing, gallery, stats, process, about, team, faq, cta, newsletter, contact, location, categories, partners, textblock
- Valid variants depend on type:
  * hero: "overlay", "split", "minimal", "gradient"
  * features: "cards", "icons-row", "alternating"
  * gallery: "grid", "masonry", "carousel"
  * testimonials: "cards", "slider"

PAGE RULES (MANDATORY):
- Include at least these pages: "Home", "About", "Contact", and "Products" (or "Collection").
- Use paths: "/" for Home, "/about" for About, "/contact" for Contact, and "/products" (or "/collection").
- Each page must contain meaningful sections (Home 5–7 sections; others 3–5). Do not leave any page empty.

SECTION VARIETY RULES:
- Home page: Use 5-7 different section types
- Other pages: Use 3-5 different section types
- NEVER repeat the same section type on one page unless it's intentional (like multiple CTAs)
- Mix visual and content sections
- Vary the order dramatically based on website type

COLOR PALETTE RULES:
- ${detectedType === 'ecommerce' ? 'Warm, inviting (browns, oranges, warm neutrals)' : ''}
- ${detectedType === 'saas' ? 'Modern tech (blues, purples, teals, with bright accents)' : ''}
- ${detectedType === 'portfolio' ? 'Minimal (black, white, one accent color)' : ''}
- ${detectedType === 'restaurant' ? 'Appetizing (reds, oranges, golds, earthy tones)' : ''}
- ${detectedType === 'agency' ? 'Bold professional (deep blues, blacks, vibrant accents)' : ''}
- All colors must be in hex format

CONTENT RULES:
- Use realistic content related to "${userPrompt}"
- Image URLs: https://picsum.photos/seed/{unique-keyword}-${randomSeed}/WIDTHxHEIGHT
- Make each section's content unique and contextual
- Include specific details about the business/product/service

EXAMPLE SECTION STRUCTURES:

Hero Example:
{
  "type": "hero",
  "variant": "split",
  "id": "hero-1",
  "title": "Your Main Headline",
  "subtitle": "Supporting description",
  "image": "https://picsum.photos/seed/keyword-123/1200/800",
  "cta": {
    "text": "Get Started",
    "link": "/contact"
  }
}

Products Example:
{
  "type": "products",
  "variant": "cards",
  "id": "products-1",
  "title": "Our Products",
  "products": [
    {
      "name": "Product Name",
      "description": "Product description",
      "price": "$19.99",
      "image": "https://picsum.photos/seed/product-1/400/400"
    }
  ]
}

Features Example:
{
  "type": "features",
  "variant": "cards",
  "id": "features-1",
  "title": "Key Features",
  "features": [
    {
      "icon": "⚡",
      "title": "Feature Name",
      "description": "Feature description"
    }
  ]
}

Testimonials Example:
{
  "type": "testimonials",
  "variant": "cards",
  "id": "testimonials-1",
  "title": "What Our Customers Say",
  "testimonials": [
    {
      "text": "This is amazing!",
      "name": "John Doe",
      "rating": 5,
      "avatar": "https://i.pravatar.cc/150?img=1"
    }
  ]
}

Categories Example (for e-commerce):
{
  "type": "categories",
  "id": "categories-1",
  "title": "Shop By Category",
  "categories": [
    {
      "name": "Category Name",
      "image": "https://picsum.photos/seed/category-1/400/400",
      "link": "/shop/category"
    }
  ]
}

Generate a ${detectedType} website with a completely unique structure and design now.`;
}

// Enhanced JSON extraction
function extractJsonString(s) {
  if (!s) return '';
  let t = String(s).trim();

  const fenceMatch = t.match(/```(?:json|jsonc)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    t = fenceMatch[1].trim();
  }

  const firstBrace = t.indexOf('{');
  const lastBrace = t.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    t = t.slice(firstBrace, lastBrace + 1);
  }

  return t.trim();
}

// Robust JSON parser
function tryParseJsonWithRepairs(src) {
  try {
    return JSON.parse(src);
  } catch {}

  let fixed = src.replace(/,\s*(?=[}\]])/g, '');
  try {
    return JSON.parse(fixed);
  } catch {}

  const chars = fixed.split('');
  let inStr = false;
  let escaped = false;
  const stack = [];
  
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (inStr) {
      if (escaped) {
        escaped = false;
      } else if (c === '\\') {
        escaped = true;
      } else if (c === '"') {
        inStr = false;
      }
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === '{' || c === '[') {
      stack.push(c);
    } else if (c === '}' || c === ']') {
      if (stack.length && ((c === '}' && stack[stack.length - 1] === '{') || 
          (c === ']' && stack[stack.length - 1] === '['))) {
        stack.pop();
      }
    }
  }

  let repaired = fixed;
  if (inStr) repaired += '"';
  
  for (let i = stack.length - 1; i >= 0; i--) {
    repaired += stack[i] === '{' ? '}' : ']';
  }

  try {
    return JSON.parse(repaired);
  } catch (e) {
    console.error('All JSON repair strategies failed:', e);
    throw new Error('Invalid JSON structure');
  }
}

function normalizeLayout(layout) {
  if (!layout) {
    return { pages: [] };
  }
  
  if (Array.isArray(layout.pages)) {
    return {
      pages: layout.pages.map(page => ({
        name: page.name || 'Untitled Page',
        path: page.path || '/',
        description: page.description || '',
        sections: (page.sections || []).map(section => normalizeSection(section))
      }))
    };
  }
  
  if (Array.isArray(layout.sections)) {
    return {
      pages: [{
        name: 'Home',
        path: '/',
        sections: layout.sections.map(section => normalizeSection(section))
      }]
    };
  }
  
  return { pages: [] };
}

// Ensure the core pages exist: Home, About, Contact, Products
function ensureCorePages(layout, store) {
  const pages = Array.isArray(layout?.pages) ? layout.pages.slice() : [];
  const getName = (s) => (s || '').toString().trim();
  const existsByName = (name) => pages.some(p => getName(p.name).toLowerCase() === name.toLowerCase());
  const storeName = getName(store?.storeName || store?.name || store?.metadata?.siteName || 'Store');

  const ensurePage = (name, path, sectionsBuilder) => {
    if (!existsByName(name)) {
      pages.push({
        name,
        path,
        description: `${name} page`,
        sections: sectionsBuilder().map(s => normalizeSection(s))
      });
    }
  };

  ensurePage('Home', '/', () => ([
    { type: 'hero', title: `Welcome to ${storeName}`, subtitle: 'Discover our latest products', image: `https://picsum.photos/seed/${Date.now()}-home/1200/600` }
  ]));

  ensurePage('About', '/about', () => ([
    { type: 'about', title: 'About Us', content: `${storeName} — our story and mission.`, image: `https://picsum.photos/seed/${Date.now()}-about/1000/600` }
  ]));

  ensurePage('Contact', '/contact', () => ([
    { type: 'contact', title: 'Contact Us', subtitle: 'We usually reply within 24 hours.' },
    { type: 'location', address: '123 Main St', phone: '+1 (000) 000-0000', email: 'hello@example.com' }
  ]));

  // Prefer Products; if a page named Collection exists, keep both
  if (!existsByName('Products') && !existsByName('Collection')) {
    pages.push({
      name: 'Products',
      path: '/products',
      description: 'Browse our catalog',
      sections: [
        normalizeSection({ type: 'products', title: 'Browse Our Products', items: [
          { name: 'Sample Product', price: '$19.99', image: `https://picsum.photos/seed/${Date.now()}-prod/400/300`, description: 'Great quality' }
        ] })
      ]
    });
  }

  return { pages };
}

// Ensure every page includes a navbar at the top and a footer at the bottom
function ensureNavAndFooter(layout, store) {
  const safeLayout = layout && Array.isArray(layout.pages) ? layout : { pages: [] };
  const pages = safeLayout.pages.map(p => ({ ...p, sections: Array.isArray(p.sections) ? p.sections : [] }));

  const companyName = (store?.storeName || store?.name || store?.metadata?.siteName || 'Company').toString();
  const links = pages.map(pg => ({ text: pg.name || 'Page', pageName: pg.name || 'Home', type: 'page' }));

  const withNavFooter = pages.map(pg => {
    const types = (pg.sections || []).map(s => String(s.type || '').toLowerCase());
    const hasNavbar = types.includes('navbar');
    const hasFooter = types.includes('footer');

    const newSections = [...pg.sections];

    if (!hasNavbar) {
      newSections.unshift({
        id: generateId(),
        type: 'navbar',
        logo: companyName.charAt(0).toUpperCase() + companyName.slice(1),
        links
      });
    }

    if (!hasFooter) {
      newSections.push({
        id: generateId(),
        type: 'footer',
        companyName,
        tagline: 'Powered by JouleAI',
        links: links.map(l => ({ text: l.text, url: `/${(l.pageName || l.text || '').toString().toLowerCase()}` }))
      });
    }

    return { ...pg, sections: newSections };
  });

  return { pages: withNavFooter };
}

function normalizeSection(section) {
  if (!section || typeof section !== 'object') {
    return {
      type: 'textblock',
      id: generateId(),
      heading: 'Content Block',
      content: 'Add your content here'
    };
  }
  
  return {
    id: section.id || generateId(),
    type: section.type || 'textblock',
    ...section
  };
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function attemptRepair(apiKey, modelName, originalPrompt, previous, attempt) {
  try {
    const enhancedPrompt = buildEnhancedPrompt(originalPrompt, {}, attempt + 1);

    const repairPrompt = `REPAIR REQUEST - Your previous response was incomplete or too generic.

${enhancedPrompt}

SPECIFIC ISSUES TO FIX:
- Generate COMPLETE JSON with all required fields
- Ensure each section has unique types (not just hero → features → testimonials)
- Match the website type's specific needs
- Use varied section types from the catalog

Previous attempt (DO NOT COPY THIS - make it different):
${JSON.stringify(previous, null, 2)}

Return COMPLETE, VALID, UNIQUE JSON now.`;

    const repair = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'user', content: repairPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 1.2,
        top_p: 0.95,
        max_tokens: 4096
      })
    });

    if (!repair.ok) return null;

    const repairData = await repair.json();
    const repairContent = repairData?.choices?.[0]?.message?.content || '';
    const repairedStr = extractJsonString(repairContent);
    return tryParseJsonWithRepairs(repairedStr);
  } catch (e) {
    console.error('Repair attempt failed:', e);
    return null;
  }
}

// Main AI generation endpoint
router.post('/:storeId/ai-prompt', 
  authMiddleware, 
  ownerCheckMiddleware((req) => req.params.storeId), 
  async (req, res) => {
    try {
      const { prompt, mode = 'create' } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ 
          success: false, 
          message: 'Prompt is required' 
        });
      }

      const store = req.store;
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ 
          success: false, 
          message: 'AI generation unavailable - API key not configured' 
        });
      }

      const storeContext = {
        existingTheme: store.theme,
        existingPages: store.layout?.pages || []
      };

      const systemPrompt = buildEnhancedPrompt(prompt, storeContext, 0);

      const modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini';

      console.log('🎨 Generating website for prompt:', prompt);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'user', content: systemPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 1.1,
          top_p: 0.95,
          max_tokens: 4096
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`OpenAI API error:`, response.status, errText);
        return res.status(500).json({
          success: false,
          message: 'AI service temporarily unavailable'
        });
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content || '';
      
      const jsonStr = extractJsonString(content);
      let aiResult;

      try {
        aiResult = tryParseJsonWithRepairs(jsonStr);
        console.log('✓ AI Result parsed successfully');
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        
        return res.status(500).json({ 
          success: false, 
          message: 'AI returned invalid format. Please try again.' 
        });
      }

      // Validate response structure
      const isValid = aiResult?.theme && 
                     aiResult?.layout?.pages && 
                     Array.isArray(aiResult.layout.pages) && 
                     aiResult.layout.pages.length > 0;

      if (!isValid) {
        console.warn('Incomplete AI response, attempting repair...');
        const repaired = await attemptRepair(apiKey, modelName, prompt, aiResult || {}, 0);
        
        if (repaired && repaired.theme && repaired.layout?.pages?.length > 0) {
          aiResult = repaired;
          console.log('✓ Response repaired successfully');
        } else {
          console.error('Repair failed');
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to generate valid design. Please try again.' 
          });
        }
      }

      // Log section diversity for debugging
      const sectionTypes = aiResult.layout.pages.flatMap(p => 
        p.sections.map(s => s.type)
      );
      const uniqueTypes = [...new Set(sectionTypes)];
      console.log('📊 Section variety:', {
        total: sectionTypes.length,
        unique: uniqueTypes.length,
        types: uniqueTypes
      });

      if (uniqueTypes.length < 3) {
        console.warn('⚠️  Low section variety, attempting another generation...');
        const repaired = await attemptRepair(apiKey, modelName, prompt, aiResult, 1);
        if (repaired) {
          aiResult = repaired;
          console.log('✓ Increased variety in retry');
        }
      }

      let normalizedLayout = normalizeLayout(aiResult.layout);
      // Enforce core pages first, then navbar/footer so nav links include all pages
      normalizedLayout = ensureCorePages(normalizedLayout, store);
      normalizedLayout = ensureNavAndFooter(normalizedLayout, store);

      const normalized = {
        theme: {
          primaryColor: aiResult.theme.primaryColor || '#3b82f6',
          secondaryColor: aiResult.theme.secondaryColor || '#1e40af',
          accentColor: aiResult.theme.accentColor || '#f59e0b',
          backgroundColor: aiResult.theme.backgroundColor || '#ffffff',
          textColor: aiResult.theme.textColor || '#1f2937',
          bannerUrl: aiResult.theme.bannerUrl || '',
          logoUrl: aiResult.theme.logoUrl || '',
          fonts: aiResult.theme.fonts || 'Inter, system-ui, sans-serif',
          stylePreset: aiResult.theme.stylePreset || 'modern',
          borderRadius: aiResult.theme.borderRadius || 'lg',
          shadow: aiResult.theme.shadow || 'soft',
          layoutPattern: aiResult.theme.layoutPattern || 'grid-heavy'
        },
        layout: normalizedLayout,
        metadata: aiResult.metadata || {
          siteName: store.name || 'My Store',
          description: 'AI-generated website',
          industry: 'General'
        }
      };

      const updated = await Store.findByIdAndUpdate(
        store._id,
        {
          theme: normalized.theme,
          layout: normalized.layout,
          metadata: normalized.metadata
        },
        { new: true }
      );

      console.log(`✓ Store ${store._id} updated successfully`);
      console.log(`  - Pages: ${normalizedLayout.pages.length}`);
      console.log(`  - Sections: ${sectionTypes.length}`);
      console.log(`  - Unique section types: ${uniqueTypes.length}`);
      console.log(`  - Style: ${normalized.theme.stylePreset}`);
      console.log(`  - Layout pattern: ${normalized.theme.layoutPattern}`);

      return res.json({ 
        success: true, 
        data: { 
          store: updated,
          generated: {
            pageCount: normalizedLayout.pages.length,
            sectionCount: sectionTypes.length,
            uniqueSectionTypes: uniqueTypes.length,
            stylePreset: normalized.theme.stylePreset,
            layoutPattern: normalized.theme.layoutPattern,
            pages: normalizedLayout.pages.map(p => ({ 
              name: p.name, 
              path: p.path,
              sectionCount: p.sections.length 
            }))
          }
        } 
      });

    } catch (error) {
      console.error('AI generation error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate store design. Please try again.' 
      });
    }
  }
);

module.exports = router;