// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Contact = require('./models/Contact');

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

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

// Serve static frontend (optional) - if you want to serve the HTML from same server
app.use(express.static(path.join(__dirname, 'public'))); // put your html/css/js into /public

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
