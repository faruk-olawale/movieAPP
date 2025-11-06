import { useState } from 'react';
import { getMovieTrailer } from '../services/api';
import { useMovieContext } from '../contexts/MovieContext';
import TrailerModal from './TrailerModal';
import '../css/MovieCard.css';

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const favorite = isFavorite(movie.id);

  const handleWatchTrailer = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    const trailer = await getMovieTrailer(movie.id);
    
    if (trailer) {
      setTrailerKey(trailer.key);
      setShowModal(true);
    } else {
      alert('No trailer available for this movie 😔');
    }
    setIsLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setTrailerKey(null);
  };

  const onFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <>
      <div className="movie-card">
        <div className="movie-poster">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'
            }
            alt={movie.title}
          />
          
          {/* Favorite Button - Top Right */}
          <button 
            className={`favorite-btn ${favorite ? 'active' : ''}`}
            onClick={onFavoriteClick}
          >
            {favorite ? '❤️' : '🤍'}
          </button>

          {/* Trailer Button - Center on Hover */}
          <div className="movie-overlay">
            <button 
              className="trailer-btn"
              onClick={handleWatchTrailer}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <>
                  <span className="play-icon">▶</span>
                  Watch Trailer
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-details">
            <span className="movie-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
            <span className="movie-year">
              {movie.release_date?.split('-')[0]}
            </span>
          </div>
        </div>
      </div>

      {showModal && <TrailerModal trailerKey={trailerKey} onClose={closeModal} />}
    </>
  );
}

export default MovieCard;