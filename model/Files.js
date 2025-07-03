const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  Category: {
      type: String,
      required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'verifying'
  }
});

const collectionF = mongoose.model('Files', fileSchema);
module.exports = mongoose.model('Files', fileSchema);