require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database (initializes tables)
require('./config/database');

// Import routes
const booksRouter = require('./routes/books');
const membersRouter = require('./routes/members');
const transactionsRouter = require('./routes/transactions');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/books', booksRouter);
app.use('/api/members', membersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/stats', statsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Library Management System API',
    version: '1.0.0',
    endpoints: {
      books: '/api/books',
      members: '/api/members',
      transactions: '/api/transactions',
      stats: '/api/stats'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Library Management System API Server                    ║
║   Server running on http://localhost:${PORT}                 ║
║   Environment: ${process.env.NODE_ENV || 'development'}                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
