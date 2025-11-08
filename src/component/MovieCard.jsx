import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovieTrailer } from '../services/api';
import { useMovieContext } from '../contexts/MovieContext';
import TrailerModal from './TrailerModal';
import '../css/MovieCard.css';

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const favorite = isFavorite(movie.id);

  // Click poster to view details
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleWatchTrailer = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    const trailer = await getMovieTrailer(movie.id);
    
    if (trailer) {
      setTrailerKey(trailer.key);
      setShowModal(true);
    } else {
      alert('No trailer available for this movie ');
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
      <div className="movie-card" onClick={handleCardClick}>
        <div className="movie-poster">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'
            }
            alt={movie.title}
          />
          
          {/* Favorite Button */}
          <button 
            className={`favorite-btn ${favorite ? 'active' : ''}`}
            onClick={onFavoriteClick}
          >
            {favorite ? '❤️' : '🤍'}
          </button>

          {/* Hover overlay with "View Details" button */}
          <div className="movie-overlay">
            <button className="details-btn">
              View Details
            </button>
          </div>
        </div>
        
        {/* Info: Only name and rating */}
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-rating">⭐ {movie.vote_average?.toFixed(1)}</div>
        </div>
      </div>

      {showModal && <TrailerModal trailerKey={trailerKey} onClose={closeModal} />}
    </>
  );
}

export default MovieCard;