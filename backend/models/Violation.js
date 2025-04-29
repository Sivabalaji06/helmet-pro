const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  plate: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  violation: { type: String, required: true },
  photo: { type: String, required: true }
});

module.exports = mongoose.model('Violation', violationSchema);
