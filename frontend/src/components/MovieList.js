// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\components\MovieList.js
import React, { useState, useMemo } from 'react';
import './MovieList.css';
import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://via.placeholder.com/200x300?text=No+Image';

const MovieCard = ({ movie }) => (
  <div className="movie-card" tabIndex={0} style={{
    background: '#232526',
    borderRadius: 18,
    boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
    padding: '1.2rem',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.18s, box-shadow 0.18s',
    minWidth: 220,
    margin: '1rem'
  }}>
    <img src={movie.poster} alt={movie.title} style={{
      width: 120,
      height: 180,
      objectFit: 'cover',
      borderRadius: 12,
      marginBottom: 12
    }} />
    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0.5rem 0' }}>{movie.title}</h3>
    <div style={{ color: '#ffcc33', fontWeight: 600, marginBottom: 8 }}>⭐ {movie.rating}</div>
    <button className="navbar-cta" style={{ padding: '8px 18px', fontSize: '1rem' }}>Watch Now</button>
  </div>
);

const MovieList = ({ movies }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulate refresh (for demo)
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  // Filter movies by search
  const filteredMovies = useMemo(() => {
    return movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase()) ||
        (movie.genre && movie.genre.toLowerCase().includes(search.toLowerCase()))
    );
  }, [movies, search]);

  return (
    <div className="movie-list-container enhanced-ui">
      <header className="movie-list-header">
        <h2>
          <span role="img" aria-label="clapperboard">🎬</span> Available Movies
        </h2>
        <p className="movie-list-subtitle">
          Browse and enjoy the latest blockbusters!
        </p>
        <div className="movie-list-actions">
          <input
            className="movie-search-input"
            type="text"
            placeholder="Search movies..."
            aria-label="Search movies"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <button
            className={`movie-refresh-btn${loading ? ' loading' : ''}`}
            title="Refresh list"
            onClick={handleRefresh}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span className="spinner" aria-label="Loading"></span>
            ) : (
              <span role="img" aria-label="refresh">🔄</span>
            )}
          </button>
        </div>
      </header>
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
        {filteredMovies.length === 0 && (
          <div className="no-movies enhanced-empty">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No movies"
              className="no-movies-img"
              width={120}
              height={120}
            />
            <p>
              {search
                ? "No movies match your search. Try a different keyword!"
                : "No movies available at the moment. Please check back later!"}
            </p>
          </div>
        )}
      </div>
      <footer className="movie-list-footer">
        <p>
          <span role="img" aria-label="popcorn">🍿</span> MovieZone &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default MovieList;