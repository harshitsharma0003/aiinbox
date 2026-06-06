const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { supabaseAdmin } = require('../supabase');
const { claudeLimiter } = require('../middleware');

const router = express.Router();
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── POST /api/strategy/instant ─────────────────────────────
router.post('/instant', claudeLimiter, async (req, res) => {
  const { company_name, industry, company_size, session_id } = req.body;
  if (!company_name || !industry) {
    return res.status(400).json({ error: 'company_name and industry are required' });
  }
  const t0 = Date.now();
  try {
    const szCtx = company_size ? ` Company size: ${company_size}.` : '';
    const prompt = `You are a senior AI strategy consultant. Generate a COMPREHENSIVE AI transformation strategy for ${company_name} in the ${industry} industry.${szCtx}

Search the web for 2025-2026 AI trends in ${industry}, then produce a board-ready strategy with these numbered sections:
1. EXECUTIVE SUMMARY (specific AI opportunity for this company)
2. INDUSTRY AI LANDSCAPE (live trends, competitor activity, proven applications in ${industry})
3. TOP 5 AI USE CASES FOR ${company_name.toUpperCase()} (Name · Description · Expected Benefit · Effort: HIGH/MED/LOW · Timeline · Indicative ROI)
4. AI READINESS CONSIDERATIONS (data, talent, technology challenges)
5. 18-MONTH ROADMAP (Phase 1: Quick wins 0-6mo · Phase 2: Core 6-12mo · Phase 3: Scale 12-18mo)
6. INVESTMENT FRAMEWORK (specific ranges and ROI benchmarks for ${industry})
7. NEXT 30 DAYS (3 specific, actionable steps)

Note: this is a high-level free strategy. A Custom Strategy ($2,500) provides an in-depth, organisation-specific plan.`;

    const response = await claude.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2500,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }]
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    const ms = Date.now() - t0;
    const tokens = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    // Save to Supabase
    const { data: saved, error } = await supabaseAdmin
      .from('strategy_generations')
      .insert({
        session_id: session_id || null,
        company_name,
        industry,
        strategy_type: 'instant',
        prompt_used: prompt,
        result_text: text,
        model_used: 'claude-opus-4-5',
        tokens_used: tokens,
        generation_time_ms: ms
      })
      .select('id')
      .single();

    if (error) console.error('Supabase save error:', error);

    res.json({ success: true, strategy: text, id: saved?.id, tokens, ms });
  } catch (err) {
    console.error('Instant strategy error:', err);
    res.status(500).json({ error: err.message || 'Strategy generation failed' });
  }
});

// ── POST /api/strategy/custom ──────────────────────────────
router.post('/custom', claudeLimiter, async (req, res) => {
  const { answers, session_id } = req.body;
  if (!answers || !answers.co || !answers.ind) {
    return res.status(400).json({ error: 'Company name and industry are required in answers' });
  }
  const t0 = Date.now();
  try {
    const ctx = Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join('\n');
    const prompt = `You are a senior AI strategy consultant. Generate a CUSTOM, POINTED AI strategy - not generic. Reference questionnaire answers throughout.

ORGANISATION PROFILE:
${ctx}

Sections:
1. EXECUTIVE BRIEF (reference their size, revenue, stated goals specifically)
2. AI READINESS DIAGNOSIS (honest gaps and strengths based on their maturity answers)
3. STRATEGIC PRIORITY: ${answers.goal || 'efficiency'} (deep dive on their primary driver)
4. TOP 5 USE CASES for ${answers.fn || 'core functions'} (Name · Why it fits THEIR readiness · Expected benefit · Effort · Timeline · ROI)
5. INVESTMENT PLAN for ${answers.budget || 'their budget'} (quarterly allocation)
6. 18-MONTH ROADMAP addressing barrier: ${answers.barrier || 'key challenge'}
7. RISK ASSESSMENT (4+ specific risks for their situation)
8. 30-DAY ACTION PLAN for a ${answers.role || 'executive'} (3 specific steps this week)

Be highly specific. No generic content.`;

    const response = await claude.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 3000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }]
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    const ms = Date.now() - t0;
    const tokens = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    // Save strategy + answers
    const { data: saved } = await supabaseAdmin
      .from('strategy_generations')
      .insert({
        session_id: session_id || null,
        company_name: answers.co,
        industry: answers.ind,
        strategy_type: 'custom',
        prompt_used: prompt,
        result_text: text,
        model_used: 'claude-opus-4-5',
        tokens_used: tokens,
        generation_time_ms: ms
      })
      .select('id')
      .single();

    // Save individual answers
    if (saved?.id) {
      const answerRows = Object.entries(answers).map(([key, val]) => ({
        strategy_id: saved.id,
        question_key: key,
        answer_value: String(val)
      }));
      await supabaseAdmin.from('custom_strategy_answers').insert(answerRows);
    }

    res.json({ success: true, strategy: text, id: saved?.id, tokens, ms });
  } catch (err) {
    console.error('Custom strategy error:', err);
    res.status(500).json({ error: err.message || 'Strategy generation failed' });
  }
});

// ── POST /api/strategy/function ────────────────────────────
router.post('/function', claudeLimiter, async (req, res) => {
  const { company_name, industry, function_name, answers, session_id } = req.body;
  if (!company_name || !function_name) {
    return res.status(400).json({ error: 'company_name and function_name are required' });
  }
  const t0 = Date.now();
  try {
    const ctx = answers ? Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join('\n') : '';
    const prompt = `You are a senior AI strategy consultant specialising in ${function_name}. Generate a FUNCTION-SPECIFIC AI strategy for ${company_name}.

FUNCTION CONTEXT:
${ctx}

Sections:
1. FUNCTION AI OPPORTUNITY SUMMARY
2. CURRENT STATE ASSESSMENT for ${function_name} at ${company_name}
3. TOP 8 AI USE CASES ranked by ROI and data readiness (Name · Description · Benefit · Effort · Timeline · Vendors)
4. DATA REQUIREMENTS per use case
5. TECHNOLOGY STACK RECOMMENDATIONS for ${function_name}
6. 12-MONTH IMPLEMENTATION ROADMAP
7. QUICK WINS (deployable in under 30 days)
8. KPIs AND SUCCESS METRICS

Be very specific to ${function_name} function. Include vendor names, tool names, and specific process improvements.`;

    const response = await claude.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2500,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }]
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    const ms = Date.now() - t0;
    const tokens = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    await supabaseAdmin.from('strategy_generations').insert({
      session_id: session_id || null,
      company_name,
      industry: industry || function_name,
      strategy_type: 'function',
      function_name,
      prompt_used: prompt,
      result_text: text,
      model_used: 'claude-opus-4-5',
      tokens_used: tokens,
      generation_time_ms: ms
    });

    res.json({ success: true, strategy: text, tokens, ms });
  } catch (err) {
    console.error('Function strategy error:', err);
    res.status(500).json({ error: err.message || 'Strategy generation failed' });
  }
});

module.exports = router;
