const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
  wish: String,
  startTime: Number,
  duration: Number,
  token: String,
});

module.exports = mongoose.model('Timer', timerSchema);
