import React, { useState, useEffect } from 'react';
import './Auth.css';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaRegCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Enhanced RegisterPage with improved UI/UX


// You can further enhance Auth.css for better visuals

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const getDeviceId = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };
    getDeviceId();
  }, []);

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      errors.email = 'Invalid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6)
      errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setMessage('');
    setSuccess(false);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        deviceId,
      });
      setMessage(response.data.message);
      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Something went wrong'
      );
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg enhanced-bg">
      <div className="auth-card enhanced-card">
        <div className="auth-logo enhanced-logo">
          <span role="img" aria-label="movie" className="logo-emoji">🎬</span>
          <span className="logo-text">MovieZone</span>
        </div>
        <h2 className="auth-title enhanced-title">Create your account</h2>
        <p className="auth-subtitle">Join MovieZone and discover your next favorite movie!</p>
        {message && (
          <div className={`auth-message enhanced-message ${success ? 'success' : 'error'}`}>
            {success && <FaRegCheckCircle className="success-icon" />}
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form enhanced-form" autoComplete="off">
          <div className={`auth-field enhanced-field ${formErrors.name ? 'has-error' : ''}`}>
            <label htmlFor="register-name">Name</label>
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                id="register-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoFocus
                autoComplete="off"
              />
            </div>
            {formErrors.name && <span className="auth-error">{formErrors.name}</span>}
          </div>
          <div className={`auth-field enhanced-field ${formErrors.email ? 'has-error' : ''}`}>
            <label htmlFor="register-email">Email</label>
            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                id="register-email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="off"
              />
            </div>
            {formErrors.email && <span className="auth-error">{formErrors.email}</span>}
          </div>
          <div className={`auth-field enhanced-field ${formErrors.password ? 'has-error' : ''}`}>
            <label htmlFor="register-password">Password</label>
            <div className="auth-password-wrapper input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-show-password enhanced-show-password"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formErrors.password && <span className="auth-error">{formErrors.password}</span>}
          </div>
          <button
            type="submit"
            className="auth-submit enhanced-submit"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner enhanced-spinner"></span> : 'Register'}
          </button>
        </form>
        <div className="auth-footer enhanced-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link enhanced-link">Sign in</Link>
        </div>
      </div>
      {/* Decorative background shapes */}
      <div className="decorative-shape shape1"></div>
      <div className="decorative-shape shape2"></div>
    </div>
  );
};

export default RegisterPage;