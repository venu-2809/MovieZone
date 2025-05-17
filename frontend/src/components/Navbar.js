import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSearch, FaRegBell } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // Simulate login state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    }
    if (dropdownOpen || notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, notificationsOpen]);

  // Keyboard accessibility for menu
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleDropdownToggle = () => setDropdownOpen((open) => !open);
  const handleNotificationsToggle = () => setNotificationsOpen((open) => !open);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  // Simulated notifications
  const notifications = [
    { id: 1, text: 'New movie released: Inception 2' },
    { id: 2, text: 'Your watchlist was updated' },
    { id: 3, text: 'Welcome to CinemaOne!' },
  ];

  return (
    <nav className="navbar">
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column', // Stack vertically
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        {/* First row: Logo and Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Logo */}
          <div
            className="navbar-logo"
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              color: '#00b894',
              letterSpacing: '1.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span role="img" aria-label="clapperboard">
              🎬
            </span>
            CinemaOne
          </div>

          {/* Centered Search */}
          <div
            className="navbar-search"
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <form
              onSubmit={e => {
                e.preventDefault();
                if (search.trim()) {
                  navigate(`/search?q=${encodeURIComponent(search.trim())}`);
                  setSearch('');
                  setMenuOpen(false);
                }
              }}
              role="search"
              style={{ display: 'flex', width: '100%' }}
            >
              <input
                type="text"
                placeholder="Search movies, actors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: 340,
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#232526',
                  color: '#fff',
                  fontSize: '1.1rem',
                  margin: '0 18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              />
              <button type="submit" aria-label="Submit search">
                <FaSearch />
              </button>
            </form>
            {searchFocused && search.length > 0 && (
              <ul className="search-suggestions">
                <li onMouseDown={() => setSearch('Inception')}>Inception</li>
                <li onMouseDown={() => setSearch('Interstellar')}>Interstellar</li>
                <li onMouseDown={() => setSearch('The Dark Knight')}>The Dark Knight</li>
              </ul>
            )}
          </div>
        </div>

        {/* Second row: Nav Links */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10px',
          }}
        >
          <ul className={`navbar-links ${menuOpen ? 'active' : ''}`} style={{ gap: '24px', display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active-link' : ''}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className={({ isActive }) => isActive ? 'active-link' : ''}>
                Explore
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>
                About
              </NavLink>
            </li>
            {!loggedIn && (
              <>
                <li>
                  <NavLink to="/login" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    Register
                  </NavLink>
                </li>
              </>
            )}
            {loggedIn && (
              <li
                className="navbar-avatar"
                onClick={handleDropdownToggle}
                tabIndex={0}
                onKeyPress={e => (e.key === 'Enter' ? handleDropdownToggle() : null)}
                ref={dropdownRef}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <FaUserCircle size={28} />
                <span className="avatar-name">Alex</span>
                <span className="dropdown-arrow" aria-hidden="true">▼</span>
                {dropdownOpen && (
                  <ul className="dropdown-menu" role="menu">
                    <li>
                      <NavLink to="/profile" tabIndex={0}>Profile</NavLink>
                    </li>
                    <li>
                      <NavLink to="/settings" tabIndex={0}>Settings</NavLink>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setLoggedIn(false);
                          setDropdownOpen(false);
                        }}
                        tabIndex={0}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* Third row: Login/Register buttons (if you want them as separate buttons below nav) */}
        {/* ...keep or remove as needed... */}

        {/* Overlay for mobile menu */}
        {menuOpen && <div className="navbar-overlay" onClick={handleMenuToggle} />}
      </div>
    </nav>
  );
};

export default Navbar;