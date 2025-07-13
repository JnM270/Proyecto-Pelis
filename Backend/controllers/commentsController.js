
// controllers/commentsController.js

import { Comment } from '../models/commentModels.js';

//Obtener todos los comentarios
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener comentarios por movieId
export const getCommentsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const comments = await Comment.find({ movieId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Crear nuevo comentario
export const createComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Eliminar comentario
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
