const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { supabaseAdmin } = require('../supabase');
const { apiLimiter } = require('../middleware');

const router = express.Router();
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/aria/chat
router.post('/chat', apiLimiter, async (req, res) => {
  const { message, session_id } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }
  try {
    const response = await claude.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 200,
      system: `You are ARIA, the AI assistant for "AI in a Box" — an enterprise AI transformation consultancy based in India.

Our services:
- Free Instant AI Strategy (60 seconds, powered by Claude Opus + web search)
- Custom Strategy ($2,500 — 4-step questionnaire, org-specific)
- Function Strategy ($5,000/function — Finance, HR, Ops, Sales, IT, CX)
- Workshops: AI Accelerator Half-Day $4,200 · Board Briefing $1,800 · Design Sprint 2-day $14,500 · Innovation Lab 5-day $30,000
- C-Suite Packages: CHRO $30K · CFO $25K · COO $32K · CIO $35K · CMO $28K · CEO $40K
- Resident AI Expert: $7,200/month
- Pricing plans: Free Starter · Professional $249/mo · Enterprise $799/mo · Executive Custom

Respond in 1-3 sentences, conversational and helpful. If they ask something very specific about their business, suggest booking a free discovery call.`,
      messages: [{ role: 'user', content: message }]
    });

    const reply = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();

    // Save to Supabase (non-blocking)
    supabaseAdmin.from('aria_chats').insert({
      session_id: session_id || null,
      user_message: message,
      aria_response: reply,
      is_claude_powered: true
    }).then(() => {}).catch(console.error);

    res.json({ success: true, reply });
  } catch (err) {
    console.error('ARIA chat error:', err);
    res.status(500).json({ error: 'Chat service temporarily unavailable' });
  }
});

module.exports = router;
