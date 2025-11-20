// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const Contact = require('./models/Contact');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Basic config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not set. Set it in your environment variables.');
  process.exit(1);
}

// Connect to MongoDB (modern usage; removed deprecated options)
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // fail fast if unreachable
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message || err);
    process.exit(1);
  });

// Health endpoint
app.get('/healthz', (req, res) => res.status(200).json({ ok: true }));

// API route to receive contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address, message } = req.body;

    // Basic validation
    if (!first_name || !last_name || !email || !phone || !address) {
      return res.status(400).json({ ok: false, error: 'Fill required fields' });
    }

    const contact = new Contact({
      first_name, last_name, email, phone, address, message
    });

    await contact.save();
    return res.status(201).json({ ok: true, message: 'Contact saved' });
  } catch (error) {
    console.error('Error saving contact:', error);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Serve static frontend if public folder exists (only useful when bundling frontend here)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Fallback to index.html for SPA (only if the file exists)
app.get('*', (req, res, next) => {
  const indexFile = path.join(publicPath, 'index.html');
  if (req.method === 'GET' && require('fs').existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }
  next();
});

// Start server and keep reference for graceful shutdown
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await mongoose.disconnect();
      console.log('❌ MongoDB disconnected, exiting.');
      process.exit(0);
    } catch (err) {
      console.error('Error during disconnect', err);
      process.exit(1);
    }
  });

  // Force exit if not closed in 10s
  setTimeout(() => {
    console.error('Could not close connections in time, forcing exit.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unexpected errors
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // try to exit to allow restart with a clean state
});
