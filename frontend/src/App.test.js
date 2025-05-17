import React, { useState } from 'react';
import './App.css';

const featuredMovie = {
  title: 'Inception',
  poster: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=400&q=80',
  description:
    'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
  trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
};

const trendingMovies = [
  {
    title: 'Interstellar',
    poster: 'https://images.unsplash.com/photo-1467987506553-8f3916508521?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'The Dark Knight',
    poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Parasite',
    poster: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  },
];

function App() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <div className="app-container enhanced">
      <header className="app-header enhanced-header">
        <div className="logo">
          <span role="img" aria-label="clapperboard">🎬</span>
          <span>MovieZone</span>
        </div>
        <nav className="nav-bar">
          {['Home', 'Trending', 'Favorites'].map(tab => (
            <button
              key={tab}
              className={`nav-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
        <input
          className="search-bar enhanced-search"
          type="text"
          placeholder="Search for movies..."
          aria-label="Search for movies"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </header>
      <main className="main-content">
        {activeTab === 'Home' && (
          <section className="featured enhanced-featured">
            <h2>Featured Movie</h2>
            <div className="movie-card enhanced-movie-card">
              <img
                src={featuredMovie.poster}
                alt="Featured Movie Poster"
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{featuredMovie.title}</h3>
                <p>{featuredMovie.description}</p>
                <button
                  className="watch-btn enhanced-watch-btn"
                  onClick={() => setShowTrailer(true)}
                >
                  Watch Trailer
                </button>
              </div>
            </div>
            {showTrailer && (
              <div className="modal-overlay" onClick={() => setShowTrailer(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/YoHD9XEInc0"
                    title="Inception Trailer"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                  <button className="close-modal" onClick={() => setShowTrailer(false)}>
                    ✕
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
        {activeTab === 'Trending' && (
          <section className="trending enhanced-trending">
            <h2>Trending Now</h2>
            <div className="movie-list">
              {trendingMovies.map(movie => (
                <div className="movie-card small" key={movie.title}>
                  <img src={movie.poster} alt={movie.title} className="movie-poster" />
                  <div className="movie-info">
                    <h4>{movie.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeTab === 'Favorites' && (
          <section className="favorites enhanced-favorites">
            <h2>Your Favorites</h2>
            <div className="empty-state">
              <span role="img" aria-label="popcorn" style={{ fontSize: 48 }}>🍿</span>
              <p>No favorites yet. Start adding movies you love!</p>
            </div>
          </section>
        )}
      </main>
      <footer className="enhanced-footer">
        <small>© 2024 MovieZone. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default App;
