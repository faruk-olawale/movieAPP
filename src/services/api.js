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
    
    // Find the first YouTube trailer
    const trailer = data.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    return trailer || null;
  } catch (error) {
    console.error('Error fetching trailer:', error);
    return null;
  }
};
