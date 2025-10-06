const express = require('express');
const Store = require('../models/Store');
const authMiddleware = require('../middleware/authMiddleware');
const ownerCheckMiddleware = require('../middleware/ownerCheckMiddleware');

const router = express.Router();

// Updated normalizeLayout - handles both single-page and multi-page layouts
function normalizeLayout(layout) {
  if (!layout) {
    return { pages: [] };
  }
  
  // If layout has pages array, it's a multi-page layout
  if (Array.isArray(layout.pages)) {
    return {
      pages: layout.pages.map(page => ({
        name: page.name || 'Untitled Page',
        path: page.path || '/',
        sections: (page.sections || []).map(section => normalizeSection(section))
      }))
    };
  }
  
  // If layout has sections array, convert to single-page format
  if (Array.isArray(layout.sections)) {
    return {
      pages: [{
        name: 'Home',
        path: '/',
        sections: layout.sections.map(section => normalizeSection(section))
      }]
    };
  }
  
  // If layout is an array, treat as sections for home page
  if (Array.isArray(layout)) {
    return {
      pages: [{
        name: 'Home',
        path: '/',
        sections: layout.map(section => normalizeSection(section))
      }]
    };
  }
  
  // Fallback
  return { pages: [] };
}

// Helper function to normalize individual sections
function normalizeSection(section) {
  if (!section || typeof section !== 'object') {
    return {
      type: 'textblock',
      id: Math.random().toString(36).substr(2, 9),
      heading: 'Text Block',
      content: 'Content here'
    };
  }
  
  return {
    id: section.id || Math.random().toString(36).substr(2, 9),
    ...section,
    type: section.type || 'textblock'
  };
}

router.post('/:storeId/ai-prompt', authMiddleware, ownerCheckMiddleware((req) => req.params.storeId), async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const store = req.store;
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        message: 'AI generation unavailable - API key not configured' 
      });
    }

    const system = [
      'You are an expert e-commerce web designer creating professional multi-page online stores.',
      'Analyze the user prompt and create a complete, conversion-optimized storefront design with multiple pages.',
      'Return valid JSON with EXACTLY this structure:',
      '{',
      '  "theme": {',
      '    "primaryColor": "#hexcolor",',
      '    "bannerUrl": "https://picsum.photos/seed/unique1/1200/400",',
      '    "logoUrl": "https://picsum.photos/seed/unique2/120/120",',
      '    "fonts": "Font Name, sans-serif"',
      '  },',
      '  "layout": {',
      '    "pages": [',
      '      {',
      '        "name": "Home",',
      '        "path": "/",',
      '        "sections": [array of section objects]',
      '      },',
      '      {',
      '        "name": "Products",',
      '        "path": "/products",',
      '        "sections": [array of section objects]',
      '      },',
      '      // ... more pages',
      '    ]',
      '  }',
      '}',
      '',
      'AVAILABLE SECTION TYPES FOR E-COMMERCE:',
      '1. navbar: { type: "navbar", logo: "Brand Name", links: [{text, url}], bgColor, textColor }',
      '2. hero: { type: "hero", title: "Headline", subtitle: "Description", buttonText: "Shop Now", buttonLink: "#products", bgColor, textColor, image: "url" }',
      '3. features: { type: "features", title: "Why Shop With Us", items: [{icon: "emoji", title, description}], bgColor, textColor }',
      '4. collection: { type: "collection", title: "Featured Products", items: [{name, price, image, description}], bgColor, textColor }',
      '5. testimonials: { type: "testimonials", title: "Customer Reviews", items: [{name, rating, text, avatar}], bgColor, textColor }',
      '6. pricing: { type: "pricing", title: "Plans", items: [{name, price, features: [], buttonText, featured: bool}], bgColor, textColor }',
      '7. cta: { type: "cta", title: "Call to Action", subtitle: "Description", buttonText, buttonLink, bgColor, textColor }',
      '8. gallery: { type: "gallery", title: "Gallery", images: [{url, caption}], bgColor, textColor }',
      '9. textblock: { type: "textblock", heading: "About", content: "Text", bgColor, textColor, alignment: "left" }',
      '10. newsletter: { type: "newsletter", title: "Stay Updated", subtitle: "Subscribe", buttonText: "Subscribe", bgColor, textColor }',
      '11. footer: { type: "footer", companyName, tagline, links: [{text, url}], bgColor, textColor }',
      '',
      'E-COMMERCE BEST PRACTICES:',
      '- ALWAYS include a "collection" section with at least 4-6 products',
      '- Product images: https://picsum.photos/seed/[product-name]/400/400',
      '- Include realistic prices with currency symbol (e.g., "$29.99", "€45.00")',
      '- Add testimonials section for social proof',
      '- Create clear CTAs throughout (Shop Now, Add to Cart, etc.)',
      '- Use trust signals in features (Free Shipping, Secure Checkout, Money Back Guarantee)',
      '',
      'DESIGN GUIDELINES:',
      '- primaryColor: Match the brand/product type (e.g., #10b981 eco/organic, #f59e0b luxury/premium, #3b82f6 tech)',
      '- Use contrasting colors for different sections (alternate light/dark backgrounds)',
      '- Hero should have strong visual impact with product imagery',
      '- Features should highlight USPs (3-4 key benefits)',
      '- Products must have: realistic names, prices, brief descriptions, unique image seeds',
      '',
      'MULTI-PAGE STRUCTURE REQUIREMENTS:',
      '- Create 3-5 pages total for a complete e-commerce experience',
      '- REQUIRED PAGES:',
      '  1. Home Page ("/"): Hero, features, featured products, testimonials, CTA',
      '  2. Products/Shop Page ("/products"): Full product collection, categories, filters info',
      '  3. About Page ("/about"): Company story, mission, team, textblocks',
      '- OPTIONAL PAGES (choose 1-2):',
      '  4. Contact Page ("/contact"): Contact form, location, business hours',
      '  5. Services Page ("/services"): Service offerings, pricing plans',
      '  6. Gallery Page ("/gallery"): Product gallery, portfolio, showcase',
      '',
      'PAGE-SPECIFIC GUIDELINES:',
      '- HOME PAGE: Must include navbar, hero, features, collection, testimonials, cta, footer (7-8 sections)',
      '- PRODUCTS PAGE: navbar, hero/banner, collection(s), filters info, footer (4-5 sections)',
      '- ABOUT PAGE: navbar, hero/banner, textblocks with company info, team, footer (4-5 sections)',
      '- CONTACT/SERVICES/GALLERY: navbar, hero/banner, relevant content sections, footer (4-5 sections)',
      '',
      'NAVIGATION REQUIREMENTS:',
      '- Every page MUST start with the same navbar section',
      '- Navbar links should match the pages you create (Home, Products, About, etc.)',
      '- Every page MUST end with the same footer section',
      '',
      'CONTENT REQUIREMENTS:',
      '- Make content highly specific to the business type',
      '- Use industry-appropriate language and imagery',
      '- Ensure each page has a clear purpose and unique content',
      '- Products should be consistent across pages but presented differently',
      '- Return ONLY valid JSON, no markdown or explanations'
    ].join('\n');

    const randomSeed = Math.random().toString(36).substring(7);
    const timestamp = Date.now();
    const user = [
      `Business Type: "${prompt}"`,
      `Generation ID: ${randomSeed}-${timestamp}`,
      '',
      'CREATE A COMPLETE MULTI-PAGE E-COMMERCE WEBSITE with these requirements:',
      '',
      '1. MULTI-PAGE STRUCTURE (REQUIRED):',
      '   - Generate 3-5 complete pages with unique content for each',
      '   - Home page: showcase, features, social proof, conversion focus',
      '   - Products page: comprehensive product catalog, organized collections',
      '   - About page: company story, mission, values, team information',
      '   - Optional: Contact, Services, or Gallery page based on business type',
      '',
      '2. CONSISTENT NAVIGATION (REQUIRED):',
      '   - Same navbar on every page with links to all pages',
      '   - Same footer on every page with company info and links',
      '   - Ensure navbar links match the pages you create',
      '',
      '3. PAGE-SPECIFIC CONTENT (REQUIRED):',
      '   - Each page must have unique, relevant content',
      '   - Products should appear differently on Home vs Products page',
      '   - About page should tell the company story with multiple text sections',
      '   - Use appropriate sections for each page type',
      '',
      '4. PRODUCT SHOWCASE (REQUIRED):',
      '   - Home page: 3-4 featured/bestseller products',
      '   - Products page: 8-12 products in full collection',
      '   - Each product needs: unique name, realistic price, description, and image',
      '   - Products should match the business type exactly',
      '',
      '5. CONVERSION & TRUST ELEMENTS:',
      '   - Compelling heroes with clear value propositions',
      '   - Strong call-to-action buttons throughout',
      '   - Trust signals (shipping, returns, guarantees)',
      '   - Social proof (testimonials, reviews)',
      '',
      '6. BRAND CONSISTENCY:',
      '   - Choose colors that match the product category',
      '   - Use consistent industry-appropriate language across all pages',
      '   - Create a cohesive visual story throughout the site',
      '',
      '7. TECHNICAL REQUIREMENTS:',
      '   - Use different product names, prices, and descriptions than before',
      '   - Use unique image seeds for all images across all pages',
      '   - Ensure proper page paths (/products, /about, etc.)',
      '',
      'Make this feel like a real, comprehensive e-commerce website with multiple pages that work together to tell a complete brand story and drive sales.'
    ].join('\n');

    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
          ],
          temperature: 0.9,
          max_tokens: 4000
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error('OpenAI API error:', resp.status, errText);
        return res.status(500).json({ 
          success: false, 
          message: 'AI service temporarily unavailable' 
        });
      }

      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      let jsonStr = content.trim();
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      
      let aiResult;
      try {
        aiResult = JSON.parse(jsonStr);
        console.log('AI Result:', JSON.stringify(aiResult, null, 2)); // Debug log
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Content received:', content.substring(0, 500));
        return res.status(500).json({ 
          success: false, 
          message: 'AI returned invalid format' 
        });
      }

      if (!aiResult?.theme || !aiResult?.layout) {
        console.error('Invalid AI response structure:', aiResult);
        return res.status(500).json({ 
          success: false, 
          message: 'AI response missing required fields' 
        });
      }

      // Validate layout structure for multi-page
      if (!aiResult.layout.pages && !aiResult.layout.sections) {
        console.error('Invalid layout structure - missing pages or sections:', aiResult.layout);
        return res.status(500).json({ 
          success: false, 
          message: 'AI response has invalid layout structure' 
        });
      }

      const normalized = {
        theme: {
          primaryColor: aiResult.theme.primaryColor || '#3b82f6',
          bannerUrl: aiResult.theme.bannerUrl || '',
          logoUrl: aiResult.theme.logoUrl || '',
          fonts: aiResult.theme.fonts || 'Inter, ui-sans-serif, system-ui'
        },
        layout: normalizeLayout(aiResult.layout)
      };

      const updated = await Store.findByIdAndUpdate(
        store._id, 
        {
          theme: normalized.theme,
          layout: normalized.layout
        }, 
        { new: true }
      );

      return res.json({ 
        success: true, 
        data: { store: updated, ai: normalized } 
      });

    } catch (error) {
      console.error('AI generation error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate store design' 
      });
    }

  } catch (error) {
    console.error('AI prompt handler error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;