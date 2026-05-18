/**
 * Server Entry Point
 * Bootstraps Express, registers middleware, routes, and starts listening.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const config = require('./src/config');
const repoRoutes = require('./src/routes/repoRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// ─── Global Middleware ──────────────────────────────────────
app.use(cors(config.cors));
app.use(express.json());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});
app.use('/api', limiter);

// ─── API Routes ─────────────────────────────────────────────
app.use('/api', repoRoutes);

// ─── Health Check Route (for Render) ────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Repo Info Generator API is running' });
});

// ─── Error Handler (must be registered last) ────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 Repo Info Generator running at http://localhost:${config.port}`);
  console.log(`   GitHub Token: ${config.github.defaultToken ? '✅ Configured' : '❌ Not set (60 req/hr limit)'}\n`);
});
