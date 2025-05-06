import React, { useState, useEffect } from 'react';
import './Auth.css';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [message, setMessage] = useState('');

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
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        deviceId, // Automatically generated deviceId
      });

      setMessage(response.data.message); // Display success message
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
      <h2>Register</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;