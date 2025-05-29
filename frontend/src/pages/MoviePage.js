// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\pages\MoviePage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MoviePlayer from '../components/MoviePlayer';
import axios from 'axios';
import { UserContext } from '../context/UserContext'; // Make sure this path is correct

const shimmerStyle = {
  background: 'linear-gradient(90deg, #232526 25%, #2c2c2c 50%, #232526 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite linear',
};

const MoviePage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext); // Get user info
  const navigate = useNavigate();
  const location = useLocation();

  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [paying, setPaying] = useState(false);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch movie data
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/movies/${id}`)
      .then(res => {
        setMovieData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Check payment status
  useEffect(() => {
    if (user && movieData) {
      axios.get(`http://localhost:5000/api/payments/hasPaid/${movieData._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(res => setHasPaid(res.data.hasPaid))
      .catch(() => setHasPaid(false));
    }
  }, [user, movieData, location.search]); // location.search to re-check after returning from payment

  // Handle payment: navigate to PaymentPage
  const handlePay = () => {
    navigate(`/payment?movieId=${movieData._id}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#232526', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...shimmerStyle, width: 200, height: 30, borderRadius: 8 }} />
      </div>
    );
  }

  if (!movieData) {
    return (
      <div style={{ minHeight: '100vh', background: '#232526', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Movie not found.</h2>
      </div>
    );
  }

  const shortDesc = movieData.description.slice(0, 120) + (movieData.description.length > 120 ? '...' : '');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 60% 20%, #232526 0%, #181818 100%)',
        color: '#fff',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        padding: 0,
        margin: 0,
        transition: 'background 0.3s',
      }}
    >
      <style>
        {`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .movie-poster:hover {
          transform: scale(1.04) rotate(-1deg);
          box-shadow: 0 12px 40px 0 rgba(229,9,20,0.18);
        }
        .favorite-btn:active {
          transform: scale(0.97);
        }
        .fade-in {
          animation: fadeIn 0.7s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: none;}
        }
        .chip {
          display: inline-block;
          background: #292929;
          color: #ffb400;
          border-radius: 16px;
          padding: 3px 14px;
          font-size: 14px;
          margin-right: 8px;
          margin-bottom: 6px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        `}
      </style>
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '40px 18px 0 18px',
        }}
      >
        <div
          className="fade-in"
          style={{
            display: 'flex',
            gap: 40,
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            background: 'rgba(30,30,30,0.85)',
            borderRadius: 24,
            boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
            padding: 32,
            marginBottom: 32,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blurred background */}
          <img
            src={movieData.poster}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -40,
              left: -40,
              width: 320,
              height: 480,
              objectFit: 'cover',
              filter: 'blur(60px) brightness(0.5) saturate(1.5)',
              opacity: 0.18,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
          <img
            src={movieData.poster}
            alt={movieData.title}
            className="movie-poster"
            style={{
              width: 240,
              height: 360,
              objectFit: 'cover',
              borderRadius: 18,
              boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
              zIndex: 1,
              transition: 'transform 0.18s, box-shadow 0.18s',
              background: '#232526',
            }}
          />
          <div style={{ flex: 1, minWidth: 260, zIndex: 1 }}>
            <h1 style={{ fontSize: 38, margin: '0 0 10px 0', fontWeight: 700, letterSpacing: 0.5 }}>
              {movieData.title}{' '}
              <span style={{ fontWeight: 400, fontSize: 24, color: '#aaa' }}>
                ({movieData.year})
              </span>
            </h1>
            <div style={{ marginBottom: 14, color: '#ccc', fontSize: 17 }}>
              {movieData.genre.split(',').map((g) => (
                <span className="chip" key={g.trim()}>{g.trim()}</span>
              ))}
              <span style={{ color: '#aaa', marginLeft: 8 }}>{movieData.duration}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
              <span
                style={{
                  background: 'linear-gradient(90deg,#ffb400 60%,#ff7c00 100%)',
                  color: '#222',
                  borderRadius: 10,
                  padding: '3px 13px',
                  fontWeight: 700,
                  marginRight: 12,
                  fontSize: 17,
                  boxShadow: '0 2px 8px rgba(255,180,0,0.12)',
                  letterSpacing: 0.2,
                }}
              >
                ★ {movieData.rating}
              </span>
              <button
                onClick={() => setIsFavorite((prev) => !prev)}
                className="favorite-btn"
                style={{
                  background: isFavorite
                    ? 'linear-gradient(90deg,#e50914 60%,#b0060f 100%)'
                    : '#292929',
                  color: isFavorite ? '#fff' : '#ffb400',
                  border: 'none',
                  borderRadius: 10,
                  padding: '7px 22px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 16,
                  transition: 'background 0.2s, color 0.2s, transform 0.1s',
                  marginLeft: 8,
                  boxShadow: isFavorite
                    ? '0 2px 12px 0 rgba(229,9,20,0.13)'
                    : '0 1px 4px 0 rgba(0,0,0,0.08)',
                  outline: isFavorite ? '2px solid #e50914' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <span style={{ fontSize: 18 }}>
                  {isFavorite ? '♥' : '♡'}
                </span>
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>
            </div>
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 17, lineHeight: 1.7, margin: 0, color: '#eaeaea' }}>
                {showDesc || movieData.description.length <= 120
                  ? movieData.description
                  : shortDesc}
                {movieData.description.length > 120 && (
                  <button
                    onClick={() => setShowDesc((v) => !v)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffb400',
                      fontWeight: 500,
                      fontSize: 15,
                      marginLeft: 6,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    {showDesc ? 'Show less' : 'Read more'}
                  </button>
                )}
              </p>
            </div>
            <div style={{ fontSize: 15.5, color: '#bbb', marginBottom: 7 }}>
              <strong>Director:</strong> {movieData.director}
            </div>
            <div style={{ fontSize: 15.5, color: '#bbb', marginBottom: 7 }}>
              <strong>Cast:</strong>{' '}
              {movieData.cast.map((actor, idx) => (
                <span key={actor}>
                  {actor}
                  {idx < movieData.cast.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="fade-in" style={{ margin: '0 0 40px 0' }}>
          <h2 style={{ fontSize: 27, marginBottom: 18, fontWeight: 600, letterSpacing: 0.2 }}>
            Watch Now
          </h2>
          <div
            style={{
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
              background: '#111',
              border: '1.5px solid #232526',
              transition: 'box-shadow 0.2s',
            }}
          >
            {!hasPaid ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <button
                  onClick={handlePay}
                  disabled={paying}
                  style={{
                    background: '#00b894',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '14px 38px',
                    fontWeight: 700,
                    fontSize: 20,
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(0,206,201,0.10)',
                    marginTop: 20,
                  }}
                >
                  {paying ? 'Processing...' : 'Pay and Watch'}
                </button>
              </div>
            ) : (
              <MoviePlayer 
               movieUrl={`http://localhost:5000${movieData.movieUrl}`} username={user?.username || 'User'} />
            )}
          </div>
        </div>
        {/* Suggestions/Related Movies (placeholder) */}
        <div className="fade-in" style={{ marginTop: 18 }}></div>
          <h3 style={{ fontSize: 22, margin: '32px 0 16px 0', color: '#ffb400', fontWeight: 600 }}>
            You Might Also Like
          </h3>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 140,
                  borderRadius: 12,
                  background: '#232526',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  position: 'relative',
                  ...shimmerStyle,
                }}
                tabIndex={0}
                aria-label="Related movie"
              >
                <div style={{ width: '100%', height: 200, background: '#181818' }} />
                <div style={{ padding: '10px 12px', color: '#bbb', fontSize: 15 }}>
                  <div style={{ height: 18, width: '80%', background: '#292929', borderRadius: 6, marginBottom: 6 }} />
                  <div style={{ height: 14, width: '60%', background: '#292929', borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* End Suggestions */}
      </div>
  );
};

export default MoviePage;