import mongoose from "mongoose";
 
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
 export const Comment = mongoose.model('Comment', CommentSchema);