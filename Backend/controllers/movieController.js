 // controllers/movieController.js

import { searchMovies, getMovieDetails } from "../../services/serviceMovie.js";

//Buscar películas por título
export const searchMovieController = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Query inválida' });
    }

    const results = await searchMovies(query);
    if (results.error) {
      return res.status(404).json({ message: results.error });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener detalles de una película por IMDb ID
export const getMovieDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^tt\d+$/.test(id)) {
      return res.status(400).json({ message: 'Formato de IMDb ID inválido' });
    }

    const data = await getMovieDetails(id);
    if (data.error) {
      return res.status(404).json({ message: data.error });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
console.log('movieController.js cargado');
console.log({ searchMovieController, getMovieDetailsController });
