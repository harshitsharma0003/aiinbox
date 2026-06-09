require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const strategyRouter = require('./routes/strategy');
const contactRouter = require('./routes/contact');
const paymentsRouter = require('./routes/payments');
const dashboardRouter = require('./routes/dashboard');
const ariaRouter = require('./routes/aria');
const pptxRouter = require('./routes/pptx');

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS must come BEFORE helmet and everything else ────────
// Allow ALL origins — locks down later once domain is confirmed
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-secret');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({ origin: '*', credentials: false }));

// ── Security & Middleware ──────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));
app.use(morgan('combined'));

// Raw body for Razorpay webhook
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '2mb' }));

// ── Health check ───────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));
app.get('/', (req, res) => res.json({ name: 'AI in a Box API', version: '1.0.0' }));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/strategy', strategyRouter);
app.use('/api/contact', contactRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/aria', ariaRouter);
app.use('/api/pptx', pptxRouter);

// ── Error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI in a Box API running on port ${PORT}`);
  console.log(`   SUPABASE:   ${process.env.SUPABASE_URL ? '✓' : '✗ MISSING'}`);
  console.log(`   ANTHROPIC:  ${process.env.ANTHROPIC_API_KEY ? '✓' : '✗ MISSING'}`);
  console.log(`   RAZORPAY:   ${process.env.RAZORPAY_KEY_ID ? '✓' : '✗ MISSING'}`);
});

module.exports = app;
