import React, { useState, useEffect } from 'react';
import './Auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
        deviceId, // Use the dynamically generated deviceId
      });

      // Save the token to localStorage or cookies
      localStorage.setItem('token', response.data.token);

      // Redirect to the home page or dashboard
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