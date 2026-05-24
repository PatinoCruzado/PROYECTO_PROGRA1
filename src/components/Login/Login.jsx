import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim().includes('@')) {
      onLogin(email);
    } else {
      alert('Ingresa un correo válido');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">🏛️ Portal MyUlima</h2>
        <p style={{textAlign: 'center', color: '#64748b', fontSize: '0.875rem'}}>Sistema de Inscripciones</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Introduce tu correo institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-btn">Ingresar</button>
        </form>
      </div>
    </div>
  );
}