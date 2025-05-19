// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\pages\HomePage.js
import React, { useState, useEffect } from 'react';
import './HomePage.css';
import ExclusiveContent from '../components/ExclusiveContent';
import Footer from '../components/Footer';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Hero Banner Component
const HeroBanner = () => (
  <section className="hero-banner" style={{
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(120deg, #1e293b 0%, #6366f1 100%)',
    color: '#fff',
    textAlign: 'center',
    padding: '4rem 1rem',
    borderRadius: '32px',
    marginBottom: '3rem',
    boxShadow: '0 8px 32px rgba(99,102,241,0.13)',
    animation: 'fadeInUp 1s',
  }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
      Discover Movies Like Never Before
    </h1>
    <p style={{ fontSize: '1.25rem', maxWidth: 600, marginBottom: '2rem' }}>
      Explore exclusive content, trending movies, and your personalized watchlist—all in one place.
    </p>
    <button
      style={{
        background: 'linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '999px',
        padding: '1rem 2.5rem',
        fontSize: '1.1rem',
        fontWeight: 700,
        boxShadow: '0 4px 24px rgba(99,102,241,0.18)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
      }}
      onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      Browse Now
    </button>
  </section>
);

// Movie Card Component
const MovieCard = ({ movie }) => (
  <div
    className="movie-card"
    tabIndex={0}
    style={{
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
      margin: '1rem',
      animation: 'fadeInUp 0.7s',
    }}
  >
    <img
      src={movie.poster}
      alt={movie.title}
      style={{
        width: 120,
        height: 180,
        objectFit: 'cover',
        borderRadius: 12,
        marginBottom: 12,
      }}
    />
    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0.5rem 0' }}>{movie.title}</h3>
    <div style={{ color: '#ffcc33', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
      <FaStar style={{ marginRight: 4 }} /> {movie.rating}
    </div>
    <span style={{ color: '#a5b4fc', fontSize: '0.95rem', marginBottom: 10 }}>{movie.genre}</span>
    <Link to={`/movies/${movie._id || movie.id}`}
      style={{
        background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)',
        color: '#fff',
        borderRadius: '999px',
        padding: '8px 18px',
        fontWeight: 700,
        fontSize: '1rem',
        border: 'none',
        boxShadow: '0 2px 12px rgba(0,206,201,0.10)',
        cursor: 'pointer',
        transition: 'background 0.2s, transform 0.1s',
      }}
      onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      Watch Now
    </Link>
  </div>
);

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies')
      .then(res => {
        setMovies(res.data);
        if (res.data.length > 0) setFeaturedMovie(res.data[0]);
      })
      .catch(() => setMovies([]));
  }, []);

  return (
    <div className="homepage-container" style={{ background: 'linear-gradient(120deg, #232526 0%, #414345 100%)', minHeight: '100vh' }}>
      <div
        className="max-w-7xl mx-auto px-4"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2vw",
          width: "100%",
        }}
      >
        <HeroBanner />

        {/* Featured Movie Section */}
        <section className="featured-section" style={{
          margin: '3rem 0',
          padding: '2rem 0',
          background: 'rgba(35,41,58,0.95)',
          borderRadius: '24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          animation: 'fadeInUp 0.7s',
        }}>
          <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Featured Movie</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {featuredMovie && <MovieCard movie={featuredMovie} />}
          </div>
        </section>

        {/* Now Showing Section */}
        <section className="section" id="now-showing" style={{
          margin: '3rem 0',
          padding: '2rem 0',
          background: 'rgba(35,41,58,0.95)',
          borderRadius: '24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          animation: 'fadeInUp 0.7s',
        }}>
          <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', color: '#fff' }}>Now Showing</h2>
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '2rem',
            paddingBottom: '1rem',
          }}>
            {movies.map(movie => (
              <MovieCard movie={movie} key={movie._id || movie.id} />
            ))}
          </div>
        </section>

        {/* Exclusive Content Section */}
        <section className="section" id="exclusive" style={{
          margin: '3rem 0',
          padding: '2rem 0',
          background: 'rgba(35,41,58,0.95)',
          borderRadius: '24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          animation: 'fadeInUp 0.7s',
        }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#fff' }}>Exclusive Content</h2>
            <a href="#exclusive" className="see-all-link" style={{ color: '#00b894', fontWeight: 600 }}>See All</a>
          </div>
          <ExclusiveContent />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
