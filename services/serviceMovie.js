 // services/serviceMovie.js

import axios from 'axios';

const OMDB_API_KEY = "llave"; 
const OMDB_BASE_URL = 'https://www.omdbapi.com';

/**
  
  @param {string} query 
  @returns {Array|Object} 
 */
export const searchMovies = async (query) => {
  if (!query || typeof query !== 'string') {
    return { error: 'Query inválida' };
  }

  try {
    const { data, status } = await axios.get(OMDB_BASE_URL, {
      params: { apikey: OMDB_API_KEY, s: query },
      headers: {
        'User-Agent': 'MovieApp/1.0',
        Accept: 'application/json'
      },
      timeout: 5000
    });

    

    if (data.Response === 'True') {
      return data.Search;
    } else {
      return { error: data.Error || 'No se encontraron resultados' };
    }
  } catch (err) {
    console.error('❌ searchMovies failed:', err.response?.status, err.response?.data);
    return { error: 'Error al conectar con OMDb' };
  }
};

/** 
 
  @param {string} imdbID 
  @returns {Object} 
 */
export const getMovieDetails = async (imdbID) => {
  if (!/^tt\d+$/.test(imdbID)) {
    return { error: 'Formato inválido de imdbID' };
  }

  try {
    const { data, status } = await axios.get(OMDB_BASE_URL, {
      params: { apikey: OMDB_API_KEY, i: imdbID },
      headers: {
        'User-Agent': 'MovieApp/1.0',
        Accept: 'application/json'
      },
      timeout: 5000
    });

    if (data.Response === 'True') {
      return data;
    } else {
      return { error: data.Error || 'Película no encontrada' };
    }
  } catch (err) {
    console.error('❌ getMovieDetails ha fallado:', err.response?.status, err.response?.data);
    return { error: 'Error al conectar con OMDb' };
  }
};
