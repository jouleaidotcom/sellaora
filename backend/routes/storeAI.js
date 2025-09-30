const express = require('express');
const Store = require('../models/Store');
const authMiddleware = require('../middleware/authMiddleware');
const ownerCheckMiddleware = require('../middleware/ownerCheckMiddleware');

const router = express.Router();

// POST /api/store/:storeId/ai-prompt
router.post('/:storeId/ai-prompt', authMiddleware, ownerCheckMiddleware((req) => req.params.storeId), async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const store = req.store;
    let aiResult = null;

    const example = {
      theme: {
        primaryColor: '#FFD700',
        bannerUrl: 'https://picsum.photos/seed/kids-banner/1200/400',
        logoUrl: 'https://picsum.photos/seed/kids-logo/120/120',
        fonts: 'Comic Sans MS, Comic Sans, cursive'
      },
      layout: {
        sections: [
          { type: 'hero', title: 'Welcome to Fun Kids Store', subtitle: 'Toys, Books & More', imageUrl: 'https://picsum.photos/seed/hero/1200/400' },
          { type: 'featuredProducts', productIds: [] },
          { type: 'textBlock', content: 'About Us: Fun, playful, and safe toys for kids.' }
        ]
      }
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const system = `You are an AI that designs storefront themes and section layout JSON for a small ecommerce site. Output strict JSON with keys theme and layout. theme must include primaryColor, bannerUrl, logoUrl, fonts. layout must include sections array. Avoid prose.`;
        const user = `Create a playful store based on this prompt: ${prompt}. Return only JSON.`;

        // Use OpenAI Responses API (fallback minimal compatibility)
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
            temperature: 0.7
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

    const update = {
      theme: aiResult.theme,
      layout: aiResult.layout
    };

    const updated = await Store.findByIdAndUpdate(store._id, update, { new: true });

    return res.json({ success: true, data: { store: updated, ai: aiResult } });
  } catch (error) {
    console.error('AI prompt error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate store from AI' });
  }
});

module.exports = router;


