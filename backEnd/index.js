const express = require('express');
const path = require('path');
require('dotenv').config();

// Safe optional requires with fallback
let cors;
try {
  cors = require('cors');
} catch (e) {
  cors = () => (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  };
}

let helmet;
try {
  helmet = require('helmet');
} catch (e) {
  helmet = () => (req, res, next) => next();
}

let morgan;
try {
  morgan = require('morgan');
} catch (e) {
  morgan = () => (req, res, next) => next();
}

let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch (e) {
  rateLimit = () => (req, res, next) => next();
}

const connectDB = require('./config/db');
const v1Router = require('./routes/v1');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
// Default to Port 8080 for MyAnatomy SandboxPro compatibility
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Security Middleware (Helmet with safe fallback)
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// CORS Configuration supporting MyAnatomy SandboxPro domains
app.use(cors({
  origin: true,
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests, please try again shortly.' }
});
app.use('/api/', limiter);

// Request Parsing & Logging
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(morgan('dev'));

// Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes on BOTH /api/v1 and /api so all request formats work
app.use('/api/v1', v1Router);
app.use('/api', v1Router);

// Root Health & Welcome
app.get('/', (req, res) => {
  res.json({
    name: 'ClauseIQ Backend API',
    status: 'active',
    port: PORT,
    endpoints: {
      auth: '/api/auth/login',
      authV1: '/api/v1/auth/login',
      contracts: '/api/contracts',
      health: '/api/health'
    },
    version: '1.0.0'
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found. ClauseIQ API available at /api or /api/v1`
  });
});

// Central Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 ClauseIQ Backend API active on Port ${PORT}`);
  console.log(`📦 API Routes available at both /api and /api/v1`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

module.exports = { app, server };
