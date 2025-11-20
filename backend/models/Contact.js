// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String, required: true },
  address:    { type: String, required: true },
  message:    { type: String },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
