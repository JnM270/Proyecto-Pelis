 const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  movieId: { 
    type: String, 
    required: true,
    match: /^tt\d+$/, // Validación para IDs de OMDb 
    trim: true
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String, 
    required: false,
    trim: true,
    maxlength: 500 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Comment', CommentSchema);