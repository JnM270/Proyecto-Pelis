 const express = require('express');
const Comment = require('../models/Comment');
const { searchMovies, getMovieDetails } = require('../services/movieService'); // Solo importamos funciones compatibles
const router = express.Router();

// Validación de ID de OMDb 
const validateOMDbId = (id) => {
  if (!id.startsWith('tt')) {
    throw new Error('ID debe comenzar con "tt"');
  }
};

// Endpoint para buscar películas 
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'El parámetro "query" es obligatorio' });
    }
    const movies = await searchMovies(query);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al buscar películas',
      error: error.message 
    });
  }
});

// Endpoint para detalles de película
router.get('/details/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    validateOMDbId(movieId); // Validar formato 
    const movie = await getMovieDetails(movieId);
    res.json(movie);
  } catch (error) {
    res.status(400).json({ 
      message: error.message.includes('ID debe') ? 'ID de película inválido' : 'Error al obtener',
      details: error.message
    });
  }
});

// Endpoint para calificar y comentar 
router.post('/rate', async (req, res) => {
  const { movieId, rating, comment } = req.body;

  try {
    // Validaciones
    if (!movieId || !rating) {
      return res.status(400).json({ message: 'Se requieren movieId y rating' });
    }
    validateOMDbId(movieId);
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'El rating debe ser entre 1 y 5' });
    }

    const newComment = new Comment({
      movieId,
      rating: Number(rating),
      comment: comment || '',
    });

    await newComment.save();
    res.status(201).json({ 
      message: 'Comentario guardado',
      data: {
        id: newComment._id,
        movieId: newComment.movieId,
        rating: newComment.rating
      }
    });
  } catch (error) {
    const statusCode = error.message.includes('ID debe') ? 400 : 500;
    res.status(statusCode).json({ 
      message: 'Error al guardar',
      error: error.message 
    });
  }
});

module.exports = router;