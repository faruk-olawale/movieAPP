const API_KEY = "621bb922744368fbe30e612721637b92";
const BASE_URL ="https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json()
    return data.results;
};

export const searchMovies = async (query) => {
    const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
    )}`
  );
    const data = await response.json();
    return data.results;
};


export const getMovieTrailer = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    const data = await response.json();
  
    const trailer = data.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    return trailer || null;
  } catch (error) {
    console.error('Error fetching trailer:', error);
    return null;
  }
};



// Add these functions to your existing api.js

// Get full movie details
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,similar,reviews`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Get movie images (posters, backdrops)
export const getMovieImages = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/images?api_key=${API_KEY}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie images:', error);
    return null;
  }
};
