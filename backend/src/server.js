require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Routes
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const zoneRoutes = require('./routes/zone.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const ticketRoutes = require('./routes/ticket.routes');
const checkinRoutes = require('./routes/checkin.routes');
const staffRoutes = require('./routes/staff.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Background Jobs
const { startExpirationJob } = require('./jobs/expiration');

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiter for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // maks 100 request per windowMs
  message: {
    success: false,
    message: 'Terlalu banyak percobaan autentikasi. Silakan coba lagi beberapa saat.',
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'event-ticket-pass-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events', zoneRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', paymentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rute ${req.method} ${req.url} tidak ditemukan.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal server.',
  });
});

// Start Background Jobs & Server
if (process.env.NODE_ENV !== 'test') {
  startExpirationJob(60000); // Check expired orders every minute

  app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`  Event & Ticket Pass — Backend API Server`);
    console.log(`  Running on: http://localhost:${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`================================================`);
  });
}

module.exports = app;
