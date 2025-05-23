import React, { useState, useEffect, useContext } from 'react';
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
    </div>
  );
};

export default LoginPage;