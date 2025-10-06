const express = require('express');
const Store = require('../models/Store');
const authMiddleware = require('../middleware/authMiddleware');
const ownerCheckMiddleware = require('../middleware/ownerCheckMiddleware');

const router = express.Router();

// Fixed normalizeLayout - handles both array and object formats
function normalizeLayout(layout) {
  let sectionsArray;
  
  if (!layout) {
    sectionsArray = [];
  } else if (Array.isArray(layout)) {
    sectionsArray = layout;
  } else if (Array.isArray(layout.sections)) {
    sectionsArray = layout.sections;
  } else {
    sectionsArray = [];
  }
  
  return {
    sections: sectionsArray.map(section => {
      if (!section || typeof section !== 'object') {
        return {
          type: 'textblock',
          id: Math.random().toString(36).substr(2, 9),
          heading: 'Text Block',
          content: 'Content here'
        };
      }
      
      // Preserve all section properties and add ID if missing
      return {
        id: section.id || Math.random().toString(36).substr(2, 9),
        ...section,
        type: section.type || 'textblock'
      };
    })
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
      'You are an expert e-commerce web designer creating professional online stores.',
      'Analyze the user prompt and create a complete, conversion-optimized storefront design.',
      'Return valid JSON with EXACTLY this structure:',
      '{',
      '  "theme": {',
      '    "primaryColor": "#hexcolor",',
      '    "bannerUrl": "https://picsum.photos/seed/unique1/1200/400",',
      '    "logoUrl": "https://picsum.photos/seed/unique2/120/120",',
      '    "fonts": "Font Name, sans-serif"',
      '  },',
      '  "layout": {',
      '    "sections": [array of section objects]',
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
      'CRITICAL REQUIREMENTS:',
      '- Create 6-9 sections total',
      '- MUST include: navbar, hero, collection (products), features, cta, footer',
      '- Optional: testimonials, pricing, gallery, newsletter, textblock',
      '- Make content highly specific to the business type',
      '- Use industry-appropriate language and imagery',
      '- Return ONLY valid JSON, no markdown or explanations'
    ].join('\n');

    const randomSeed = Math.random().toString(36).substring(7);
    const timestamp = Date.now();
    const user = [
      `Business Type: "${prompt}"`,
      `Generation ID: ${randomSeed}-${timestamp}`,
      '',
      'CREATE A COMPLETE E-COMMERCE STOREFRONT with these requirements:',
      '',
      '1. PRODUCT SHOWCASE (REQUIRED):',
      '   - Include a "collection" section with 4-8 products',
      '   - Each product needs: unique name, realistic price, description, and image',
      '   - Products should match the business type exactly',
      '',
      '2. CONVERSION ELEMENTS (REQUIRED):',
      '   - Compelling hero section with clear value proposition',
      '   - Strong call-to-action buttons throughout',
      '   - Trust signals (shipping, returns, guarantees)',
      '   - Social proof if applicable',
      '',
      '3. BRAND IDENTITY:',
      '   - Choose colors that match the product category',
      '   - Use industry-appropriate language and tone',
      '   - Create a cohesive visual story',
      '',
      '4. VARIATION:',
      '   - Use different product names, prices, and descriptions than before',
      '   - Vary section order and types',
      '   - Use unique image seeds for all images',
      '',
      'Make this feel like a real, professional online store ready to sell products.'
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
          max_tokens: 3000
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