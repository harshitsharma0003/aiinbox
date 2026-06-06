const express = require('express');
const { supabaseAdmin } = require('../supabase');
const { apiLimiter } = require('../middleware');

const router = express.Router();

// POST /api/contact
router.post('/', apiLimiter, async (req, res) => {
  const { name, email, company, phone, interest, message } = req.body;
  if (!name || !email || !company) {
    return res.status(400).json({ error: 'name, email and company are required' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from('contact_leads')
      .insert({ name, email, company, phone: phone || null, interest: interest || null, message: message || null, source: 'website' })
      .select('id')
      .single();

    if (error) throw error;
    res.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Contact save error:', err);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

module.exports = router;
