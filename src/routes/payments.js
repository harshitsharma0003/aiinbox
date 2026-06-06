const express = require('express');
const crypto = require('crypto');
const { supabaseAdmin } = require('../supabase');
const { apiLimiter } = require('../middleware');

const router = express.Router();

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('REPLACE')) {
    return null;
  }
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// POST /api/payments/create-order  — creates Razorpay order
router.post('/create-order', apiLimiter, async (req, res) => {
  const { plan_name, amount_inr, billing_cycle, customer_name, customer_email, customer_company } = req.body;
  if (!plan_name || !amount_inr || !customer_email) {
    return res.status(400).json({ error: 'plan_name, amount_inr and customer_email are required' });
  }
  try {
    const rzp = getRazorpay();
    let rzpOrderId = null;

    if (rzp) {
      const rzpOrder = await rzp.orders.create({
        amount: Math.round(amount_inr * 100), // paise
        currency: 'INR',
        notes: { plan_name, customer_email }
      });
      rzpOrderId = rzpOrder.id;
    }

    // Save pending order to Supabase
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        plan_name,
        plan_amount_usd: Math.round(amount_inr / 84),
        billing_cycle: billing_cycle || 'one-time',
        customer_name: customer_name || null,
        customer_email,
        customer_company: customer_company || null,
        razorpay_order_id: rzpOrderId,
        payment_status: 'pending',
        currency: 'INR',
        amount_inr
      })
      .select('id')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      order_id: data.id,
      razorpay_order_id: rzpOrderId,
      amount_inr,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_NOT_CONFIGURED'
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// POST /api/payments/verify  — verify Razorpay payment signature
router.post('/verify', apiLimiter, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
  if (!razorpay_payment_id) {
    return res.status(400).json({ error: 'Missing payment details' });
  }
  try {
    let isValid = false;
    if (process.env.RAZORPAY_KEY_SECRET && razorpay_order_id && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
      isValid = expected === razorpay_signature;
    } else {
      isValid = true; // Dev mode — skip verification
    }

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update order status
    const updateData = {
      payment_status: 'paid',
      razorpay_payment_id,
      razorpay_signature: razorpay_signature || '',
      updated_at: new Date().toISOString()
    };
    if (razorpay_order_id) updateData.razorpay_order_id = razorpay_order_id;

    await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', order_id);

    res.json({ success: true, verified: true });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// POST /api/payments/webhook  — Razorpay webhook (raw body)
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (process.env.RAZORPAY_KEY_SECRET && signature) {
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(req.body)
        .digest('hex');
      if (expected !== signature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = JSON.parse(req.body.toString());
    const entity = event?.payload?.payment?.entity;

    if (event.event === 'payment.captured' && entity) {
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'paid', razorpay_payment_id: entity.id, updated_at: new Date().toISOString() })
        .eq('razorpay_order_id', entity.order_id);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
