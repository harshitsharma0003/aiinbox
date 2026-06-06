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

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security & Middleware ──────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(morgan('combined'));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    /\.vercel\.app$/,
    /\.netlify\.app$/,
    /\.railway\.app$/,
  ],
  credentials: true
}));

// Raw body for Razorpay webhook signature verification
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

// ── Error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI in a Box API running on port ${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
