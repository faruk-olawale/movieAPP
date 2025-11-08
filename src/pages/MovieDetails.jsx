import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import { useMovieContext } from '../contexts/MovieContext';
import TrailerModal from '../component/TrailerModal';
import MovieCard from '../component/MovieCard';
import '../css/MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      const data = await getMovieDetails(id);
      setMovie(data);
      setLoading(false);
    };

    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="details-loading">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="details-error">
        <h2>Movie not found</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const favorite = isFavorite(movie.id);
  const trailers = movie.videos?.results?.filter(v => v.type === 'Trailer' && v.site === 'YouTube') || [];
  const director = movie.credits?.crew?.find(person => person.job === 'Director');
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const similar = movie.similar?.results?.slice(0, 6) || [];
  const reviews = movie.reviews?.results?.slice(0, 3) || [];

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleTrailerClick = (trailer) => {
    setSelectedTrailer(trailer.key);
    setShowTrailer(true);
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="movie-details">
      {/* Hero Section with Backdrop */}
      <div 
        className="details-hero"
        style={{
          backgroundImage: movie.backdrop_path 
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
        }}
      >
        <div className="hero-overlay"></div>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="hero-content">
          <div className="hero-main">
            <div className="hero-poster">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Image'
                }
                alt={movie.title}
              />
            </div>

            <div className="hero-info">
              <h1 className="hero-title">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="hero-tagline">"{movie.tagline}"</p>
              )}

              <div className="hero-meta">
                <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                <span className="dot">•</span>
                <span>{movie.release_date?.split('-')[0]}</span>
                <span className="dot">•</span>
                <span>{formatRuntime(movie.runtime)}</span>
                <span className="dot">•</span>
                <span className="certification">PG-13</span>
              </div>

              <div className="hero-genres">
                {movie.genres?.map(genre => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="hero-actions">
                {trailers.length > 0 && (
                  <button 
                    className="action-btn action-btn-primary"
                    onClick={() => handleTrailerClick(trailers[0])}
                  >
                    <span>▶</span> Play Trailer
                  </button>
                )}
                
                <button 
                  className={`action-btn action-btn-secondary ${favorite ? 'active' : ''}`}
                  onClick={handleFavoriteClick}
                >
                  <span>{favorite ? '❤️' : '🤍'}</span>
                  {favorite ? 'In Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="details-content">
        <div className="content-grid">
          {/* Left Column - Main Content */}
          <div className="content-main">
            {/* Overview */}
            <section className="overview-section">
              <h2>Overview</h2>
              <p className="overview-text">{movie.overview}</p>
            </section>

            {/* Cast */}
            {cast.length > 0 && (
              <section className="section">
                <h2 className="section-title">Top Cast</h2>
                <div className="cast-grid">
                  {cast.map(person => (
                    <div key={person.id} className="cast-card">
                      <img
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                            : 'https://via.placeholder.com/185x278?text=No+Photo'
                        }
                        alt={person.name}
                      />
                      <div className="cast-info">
                        <p className="cast-name">{person.name}</p>
                        <p className="cast-character">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Trailers */}
            {trailers.length > 1 && (
              <section className="section">
                <h2 className="section-title">Videos & Trailers</h2>
                <div className="trailers-grid">
                  {trailers.slice(0, 4).map(trailer => (
                    <div 
                      key={trailer.id} 
                      className="trailer-card"
                      onClick={() => handleTrailerClick(trailer)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                        alt={trailer.name}
                      />
                      <div className="trailer-play-overlay">
                        <div className="play-icon-circle">▶</div>
                      </div>
                      <p className="trailer-name">{trailer.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section className="section">
                <h2 className="section-title">Reviews</h2>
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-card">
                      <div className="review-author-section">
                        <span className="review-author-name">{review.author}</span>
                        {review.author_details?.rating && (
                          <span className="review-author-rating">
                            ⭐ {review.author_details.rating}/10
                          </span>
                        )}
                      </div>
                      <p className="review-text">
                        {review.content.length > 400 
                          ? `${review.content.substring(0, 400)}...` 
                          : review.content}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar Stats */}
          <aside className="content-sidebar">
            <div className="stats-grid">
              {director && (
                <div className="stat-item">
                  <span className="stat-label">Director</span>
                  <span className="stat-value">{director.name}</span>
                </div>
              )}
              
              {movie.budget > 0 && (
                <div className="stat-item">
                  <span className="stat-label">Budget</span>
                  <span className="stat-value">{formatMoney(movie.budget)}</span>
                </div>
              )}
              
              {movie.revenue > 0 && (
                <div className="stat-item">
                  <span className="stat-label">Revenue</span>
                  <span className="stat-value">{formatMoney(movie.revenue)}</span>
                </div>
              )}

              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className="stat-value">{movie.status}</span>
              </div>

              <div className="stat-item">
                <span className="stat-label">Original Language</span>
                <span className="stat-value">{movie.original_language?.toUpperCase()}</span>
              </div>

              {movie.vote_count > 0 && (
                <div className="stat-item">
                  <span className="stat-label">Vote Count</span>
                  <span className="stat-value">{movie.vote_count.toLocaleString()}</span>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Similar Movies */}
        {similar.length > 0 && (
          <section className="section">
            <h2 className="section-title">More Like This</h2>
            <div className="similar-grid">
              {similar.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <TrailerModal 
          trailerKey={selectedTrailer} 
          onClose={() => {
            setShowTrailer(false);
            setSelectedTrailer(null);
          }} 
        />
      )}
    </div>
  );
}

export default MovieDetails;