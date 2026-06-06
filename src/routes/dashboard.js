const express = require('express');
const { supabaseAdmin } = require('../supabase');
const { requireAdmin } = require('../middleware');

const router = express.Router();

// All dashboard routes require admin auth
router.use(requireAdmin);

// GET /api/dashboard/overview — summary stats
router.get('/overview', async (req, res) => {
  try {
    const [
      { count: totalLeads },
      { count: totalStrategies },
      { count: totalOrders },
      { count: paidOrders },
      { count: ariaChats }
    ] = await Promise.all([
      supabaseAdmin.from('contact_leads').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('strategy_generations').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid'),
      supabaseAdmin.from('aria_chats').select('*', { count: 'exact', head: true })
    ]);

    // Revenue
    const { data: revenueData } = await supabaseAdmin
      .from('orders')
      .select('amount_inr')
      .eq('payment_status', 'paid');

    const totalRevenue = (revenueData || []).reduce((sum, r) => sum + (Number(r.amount_inr) || 0), 0);

    // Strategy breakdown
    const { data: stratBreakdown } = await supabaseAdmin
      .from('strategy_generations')
      .select('strategy_type')
      .order('created_at', { ascending: false });

    const byType = (stratBreakdown || []).reduce((acc, s) => {
      acc[s.strategy_type] = (acc[s.strategy_type] || 0) + 1;
      return acc;
    }, {});

    // Recent activity (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [{ count: newLeads7d }, { count: newStrategies7d }] = await Promise.all([
      supabaseAdmin.from('contact_leads').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
      supabaseAdmin.from('strategy_generations').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo)
    ]);

    res.json({
      overview: {
        total_leads: totalLeads || 0,
        total_strategies: totalStrategies || 0,
        total_orders: totalOrders || 0,
        paid_orders: paidOrders || 0,
        aria_chats: ariaChats || 0,
        total_revenue_inr: totalRevenue,
        total_revenue_usd: Math.round(totalRevenue / 84)
      },
      strategies_by_type: byType,
      last_7_days: {
        new_leads: newLeads7d || 0,
        new_strategies: newStrategies7d || 0
      }
    });
  } catch (err) {
    console.error('Dashboard overview error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/leads
router.get('/leads', async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (page - 1) * limit;
  try {
    let query = supabaseAdmin
      .from('contact_leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);

    const { data, count, error } = await query;
    if (error) throw error;
    res.json({ data, count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/dashboard/leads/:id  — update lead status
router.patch('/leads/:id', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from('contact_leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/strategies
router.get('/strategies', async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;
  const offset = (page - 1) * limit;
  try {
    let query = supabaseAdmin
      .from('strategy_generations')
      .select('id, company_name, industry, strategy_type, function_name, model_used, tokens_used, generation_time_ms, downloaded_pdf, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) query = query.eq('strategy_type', type);

    const { data, count, error } = await query;
    if (error) throw error;
    res.json({ data, count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/strategies/:id  — full strategy with result
router.get('/strategies/:id', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('strategy_generations')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/orders
router.get('/orders', async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (page - 1) * limit;
  try {
    let query = supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('payment_status', status);

    const { data, count, error } = await query;
    if (error) throw error;
    res.json({ data, count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/chats
router.get('/chats', async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { data, count, error } = await supabaseAdmin
      .from('aria_chats')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    res.json({ data, count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
