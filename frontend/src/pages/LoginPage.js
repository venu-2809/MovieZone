import React, { useState, useEffect, useContext,useRef } from 'react';
import './Auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { UserContext } from '../context/UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const googleBtn = useRef(null);
    useEffect(() => {
    /* global google */
    if (window.google && googleBtn.current) {
      window.google.accounts.id.initialize({
        client_id: '427168535755-avbl1pgi191fj9iv7la64kuj0kg98h0k.apps.googleusercontent.com', // <-- Replace with your Google client ID
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtn.current, {
        theme: 'outline',
        size: 'large',
        width: 300,
      });
    }
  }, []);
    // Handle Google login response
  const handleGoogleResponse = async (response) => {
    try {
      // Send the Google token to your backend
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        credential: response.credential,
        deviceId, // Include the deviceId for single device enforcement
      });
      setUser({
        username: res.data.username,
        email: res.data.email,
        token: res.data.token,
      });
      setMessage('Login successful!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage('Google login failed');
    }
  };
  // Generate the deviceId on component mount
  useEffect(() => {
    const getDeviceId = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId); // Set the unique device ID
    };
    getDeviceId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        deviceId,
      });

      // Save the token to localStorage or cookies
      localStorage.setItem('token', response.data.token);

      // Set user in context for global access (for watermark, etc.)
      setUser({
        username: response.data.username, // Make sure your backend sends this!
        email: response.data.email,
        token: response.data.token,
        // ...add any other user info you want
      });

      setMessage('Login successful!');
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setMessage(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Something went wrong'
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div style={{ margin: '20px 0' }}>
        <div ref={googleBtn}></div>
      </div>
    </div>
  );
};

export default LoginPage;