import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const API_BASE_URL = "http://localhost:8080/api";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (res.ok) {
          onLogin(); 
          navigate('/admin/dashboard'); 
        } else {
          setError("Invalid username or password");
        }
      })
      .catch(() => setError("Server error. Is backend running?"));
  };

  return (
    <div className="container">
      <div className="bill-container" style={{ maxWidth: '400px', marginTop: '3rem' }}>
        <h3>Manager Login</h3>
        {error && <div className="error-box" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form className="modal-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-submit" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;