const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database
const db = require('./src/db');

// Import routes
const api = require('./src/routes/api');

// Import rate limiter
const { generalLimiter } = require('./src/utils/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Routes
app.use('/api', api);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Notable Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
