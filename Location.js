// Location.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  vehicleId: String,
  latitude: Number,
  longitude: Number,
  timestamp: Date,
});

module.exports = mongoose.model('Location', locationSchema);
