const express = require('express');
const Store = require('../models/Store');
const authMiddleware = require('../middleware/authMiddleware');
const ownerCheckMiddleware = require('../middleware/ownerCheckMiddleware');

const router = express.Router();

// Helper: normalize AI layout to editor schema
function normalizeLayout(layout) {
  const out = { sections: [] };
  const sections = Array.isArray(layout?.sections) ? layout.sections : [];
  for (const raw of sections) {
    if (!raw || typeof raw !== 'object') continue;
    let type = String(raw.type || '').toLowerCase();
    // Map common variants to canonical editor types
    if (type === 'textblock' || type === 'text-block' || type === 'text') type = 'textblock';
    if (type === 'textBlock') type = 'textblock';
    if (type === 'featuredproducts' || type === 'featured_products' || type === 'products' || type === 'feature') type = 'features';
    if (type === 'hero-section') type = 'hero';

    if (type === 'navbar') {
      const links = Array.isArray(raw.links) ? raw.links : [
        { text: 'Home', url: '#' },
        { text: 'Products', url: '#' },
        { text: 'About', url: '#' },
      ];
      out.sections.push({
        type: 'navbar',
        logo: raw.logo || 'Logo',
        links: links.map(l => ({ text: l.text || 'Link', url: l.url || '#' })),
        bgColor: raw.bgColor || '#ffffff',
        textColor: raw.textColor || '#1f2937',
      });
      continue;
    }

    if (type === 'hero') {
      out.sections.push({
        type: 'hero',
        title: raw.title || 'New Hero Section',
        subtitle: raw.subtitle || 'Add your subtitle here',
        buttonText: raw.buttonText || 'Click Me',
        buttonLink: raw.buttonLink || '#',
        bgColor: raw.bgColor || '#3b82f6',
        textColor: raw.textColor || '#ffffff',
        image: raw.image || raw.imageUrl || '',
      });
      continue;
    }

    if (type === 'features') {
      const items = Array.isArray(raw.items) ? raw.items : Array.isArray(raw.features) ? raw.features : [];
      const normItems = items.map(it => ({
        icon: it.icon || '⭐',
        title: it.title || 'Feature',
        description: it.description || 'Description here',
      }));
      out.sections.push({
        type: 'features',
        title: raw.title || 'Features Section',
        items: normItems.length ? normItems : [
          { icon: '⭐', title: 'Feature 1', description: 'Description here' },
          { icon: '🎯', title: 'Feature 2', description: 'Description here' },
          { icon: '🚀', title: 'Feature 3', description: 'Description here' },
        ],
        bgColor: raw.bgColor || '#f9fafb',
        textColor: raw.textColor || '#111827',
      });
      continue;
    }

    if (type === 'footer') {
      const links = Array.isArray(raw.links) ? raw.links : [
        { text: 'Home', url: '#' },
        { text: 'About', url: '#' },
        { text: 'Contact', url: '#' },
      ];
      out.sections.push({
        type: 'footer',
        companyName: raw.companyName || 'Company Name',
        tagline: raw.tagline || 'Your company tagline',
        links: links.map(l => ({ text: l.text || 'Link', url: l.url || '#' })),
        bgColor: raw.bgColor || '#1f2937',
        textColor: raw.textColor || '#f3f4f6',
      });
      continue;
    }

    // Default to textblock, map common fields
    out.sections.push({
      type: 'textblock',
      heading: raw.heading || raw.title || 'Text Block Heading',
      content: raw.content || raw.text || 'Add your content here. This is a flexible text block that you can customize.',
      bgColor: raw.bgColor || '#ffffff',
      textColor: raw.textColor || '#374151',
      alignment: raw.alignment || 'left',
    });
  }
  return out;
}

// POST /api/store/:storeId/ai-prompt
router.post('/:storeId/ai-prompt', authMiddleware, ownerCheckMiddleware((req) => req.params.storeId), async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const store = req.store;
    let aiResult = null;

    // Editor schema example used for fallback and few-shot guidance
    const example = {
      theme: {
        primaryColor: '#3b82f6',
        bannerUrl: 'https://picsum.photos/seed/banner/1200/400',
        logoUrl: 'https://picsum.photos/seed/logo/120/120',
        fonts: 'Inter, ui-sans-serif, system-ui'
      },
      layout: {
        sections: [
          { type: 'navbar', logo: 'My Shop', links: [{ text: 'Home', url: '#' }, { text: 'Products', url: '#' }] , bgColor: '#ffffff', textColor: '#1f2937' },
          { type: 'hero', title: 'Welcome', subtitle: 'Great products for everyone', image: 'https://picsum.photos/seed/hero/1200/400', buttonText: 'Shop Now', buttonLink: '#', bgColor: '#3b82f6', textColor: '#ffffff' },
          { type: 'features', title: 'Why choose us', items: [ { icon: '⭐', title: 'Quality', description: 'Top quality' }, { icon: '🚀', title: 'Fast', description: 'Quick delivery' }, { icon: '💬', title: 'Support', description: 'We help' } ], bgColor: '#f9fafb', textColor: '#111827' },
          { type: 'textblock', heading: 'About', content: 'We started in 2024...', bgColor: '#ffffff', textColor: '#374151', alignment: 'left' },
          { type: 'footer', companyName: 'My Shop Inc.', tagline: 'We care', links: [{ text: 'Home', url: '#' }], bgColor: '#1f2937', textColor: '#f3f4f6' }
        ]
      }
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const system = [
          'You design storefront themes as structured JSON for a no-code editor.',
          'Return STRICT JSON with exactly two top-level keys: theme and layout.',
          'theme must include: primaryColor (hex), bannerUrl (url), logoUrl (url), fonts (string).',
          'layout must include: sections (array). Each section.type must be one of: navbar, hero, features, textblock, footer.',
          'Section schemas:',
          '- navbar: { type, logo, links:[{text,url}], bgColor, textColor }',
          '- hero: { type, title, subtitle, buttonText, buttonLink, bgColor, textColor, image }',
          '- features: { type, title, items:[{icon,title,description}], bgColor, textColor }',
          '- textblock: { type, heading, content, bgColor, textColor, alignment }',
          '- footer: { type, companyName, tagline, links:[{text,url}], bgColor, textColor }',
          'Avoid prose. Do not wrap in markdown. Output only JSON.'
        ].join('\n');
        const user = `Create a storefront based on: ${prompt}. Style and content should reflect the prompt. Output only JSON.`;

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
              { role: 'user', content: JSON.stringify({ instruction: user, schema_example: example }) }
            ],
            temperature: 0.5
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          const content = data.choices?.[0]?.message?.content || '';
          try {
            aiResult = JSON.parse(content);
          } catch (e) {
            aiResult = example;
          }
        } else {
          aiResult = example;
        }
      } catch (_e) {
        aiResult = example;
      }
    } else {
      aiResult = example;
    }

    // Normalize to editor schema defensively
    const normalized = {
      theme: {
        primaryColor: aiResult?.theme?.primaryColor || '#3b82f6',
        bannerUrl: aiResult?.theme?.bannerUrl || '',
        logoUrl: aiResult?.theme?.logoUrl || '',
        fonts: aiResult?.theme?.fonts || 'Inter, ui-sans-serif, system-ui'
      },
      layout: normalizeLayout(aiResult?.layout)
    };

    const update = {
      theme: normalized.theme,
      layout: normalized.layout
    };

    const updated = await Store.findByIdAndUpdate(store._id, update, { new: true });

    return res.json({ success: true, data: { store: updated, ai: normalized } });
  } catch (error) {
    console.error('AI prompt error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate store from AI' });
  }
});

module.exports = router;


