// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\components\ExclusiveContent.js
import React, { useState, useRef, useEffect } from 'react';
import './ExclusiveContent.css';
import axios from 'axios';
import {
  FaPlayCircle,
  FaStar,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaRegHeart,
  FaRegClock,
  FaShareAlt,
  FaCheckCircle,
  FaCrown,
  FaInfoCircle,
} from 'react-icons/fa';

const fallbackImg = 'https://via.placeholder.com/320x180?text=No+Image';

// const exclusiveContent = [
//   {
//     id: 1,
//     title: 'AI Genesis',
//     description:
//       'A mind-bending journey into the birth of artificial intelligence.',
//     genre: 'Sci-Fi',
//     rating: 4.9,
//     thumbnail: '/images/bts1.jpg',
//     url: '#',
//   },
//   {
//     id: 2,
//     title: 'Neural Odyssey',
//     description:
//       'A thrilling adventure through the neural networks of tomorrow.',
//     genre: 'Adventure',
//     rating: 4.8,
//     thumbnail: '/images/event1.jpg',
//     url: '#',
//   },
//   // Add more unique items here...
// ];

const ExclusiveContent = () => {
  const [exclusiveContent, setExclusiveContent] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [autoPlay, setAutoPlay] = useState(true);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef();
   useEffect(() => {
    axios.get('http://localhost:5000/api/exclusive')
      .then(res => setExclusiveContent(res.data))
      .catch(() => setExclusiveContent([]));
  }, []);
  // Keyboard navigation for accessibility
  useEffect(() => {
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [current, exclusiveContent.length]);

  // Auto-play carousel
  useEffect(() => {
    autoPlayRef.current = handleNext;
  });

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      autoPlayRef.current();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, current, exclusiveContent.length]);

  const showUserToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
    showUserToast(
      favorites.includes(id)
        ? 'Removed from favorites'
        : 'Added to favorites'
    );
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? exclusiveContent.length - 1 : prev - 1));
    carouselRef.current?.classList.add('carousel-animate-left');
    setTimeout(() => {
      carouselRef.current?.classList.remove('carousel-animate-left');
    }, 400);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === exclusiveContent.length - 1 ? 0 : prev + 1));
    carouselRef.current?.classList.add('carousel-animate-right');
    setTimeout(() => {
      carouselRef.current?.classList.remove('carousel-animate-right');
    }, 400);
  };

  // Progress bar for carousel
  const progress = ((current + 1) / exclusiveContent.length) * 100;

  // Share functionality
  const handleShare = (item) => {
    if (navigator.share) {
      navigator
        .share({
          title: item.title,
          text: item.description,
          url: item.url,
        })
        .then(() => showUserToast('Shared!'))
        .catch(() => showUserToast('Share cancelled'));
    } else {
      navigator.clipboard.writeText(item.url);
      showUserToast('Link copied!');
    }
  };

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  return (
    <section className="exclusive-content-section">
      <div className="exclusive-container">
        <div className="exclusive-header">
          <h2>⭐ Exclusive Content</h2>
          <a href="/exclusive" className="see-all">See All</a>
        </div>
        <div
          className="exclusive-content"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2.5rem 1.5rem',
          }}
        >
          <div
            className="exclusive-carousel"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {exclusiveContent.map((content, idx) => (
              <div className="exclusive-card" key={content.id} style={{ '--i': idx }}>
                <div className="exclusive-img-wrap">
                  <img
                    src={content.thumbnail || fallbackImg}
                    alt={content.title}
                    onError={(e) => {
                      e.target.src = fallbackImg;
                    }}
                  />
                  <span className="exclusive-genre">{content.genre}</span>
                </div>
                <div className="exclusive-card-body">
                  <h3>{content.title}</h3>
                  <div className="exclusive-rating">
                    <FaStar color="#FFD700" /> {content.rating}
                  </div>
                  <p>{content.description}</p>
                  <div className="exclusive-card-actions">
                    <button title="Watch Now" className="exclusive-btn play">
                      <FaPlayCircle /> Watch
                    </button>
                    <button title="Like" className="exclusive-btn">
                      <FaHeart />
                    </button>
                    <button title="Share" className="exclusive-btn">
                      <FaShareAlt />
                    </button>
                    <button title="More Info" className="exclusive-btn">
                      <FaInfoCircle />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showToast && (
        <div className="exclusive-toast" role="alert">
          <FaCheckCircle className="toast-icon" /> {toastMsg}
        </div>
      )}
    </section>
  );
};

export default ExclusiveContent;