const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database — this one trigger the making of table in db
const db = require('./database/db');

// Import routes
const api = require ('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', api);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Notable Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});