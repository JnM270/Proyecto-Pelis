 const axios = require('axios');
const apiKey = process.env.API_KEY; 


const searchMovies = async (query) => {
  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: apiKey,  
        s: query,        
        type: 'movie'    
      }
    });
    return response.data.Search || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

const getMovieDetails = async (movieId) => {
  try {
    if (!movieId.startsWith('tt')) {
      throw new Error('ID debe comenzar con "tt"');
    }
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: apiKey,
        i: movieId,      // Parámetro de ID OMDb
        plot: 'full'     // Obtener sinopsis completa
      }
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

module.exports = { searchMovies, getMovieDetails };