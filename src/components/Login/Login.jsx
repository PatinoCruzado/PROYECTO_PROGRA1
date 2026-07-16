import React, { useState } from 'react';
import { api } from '../../services/api';
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false); // Indicador de carga para solicitudes de red

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    setLoading(true);

    try {
      if (isRegistering) {
        // Solicitud de registro real en la base de datos
        await api.register(cleanEmail, password);
        alert('✅ Cuenta creada con éxito. Ya puedes iniciar sesión.');
        setIsRegistering(false);
        setEmail('');
        setPassword('');
      } else {
        // Solicitud de inicio de sesión real
        const data = await api.login(cleanEmail, password);
        // data contiene: { email, role, token }
        onLogin(data.email, data.role, data.token);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-decor-blob"></div>
      <div className="login-card">
        <div className="login-header">
          <div className="ulima-logo-placeholder">
            <span>U</span>Ulima
          </div>
          <h2 className="login-title">
            {isRegistering ? 'Crear Cuenta' : 'Portal MyUlima'}
          </h2>
          <p className="login-subtitle">
            {isRegistering ? 'Plataforma de eventos e inscripciones' : 'Inicia sesión con tu cuenta institucional'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Correo Institucional</label>
            <input
              id="email"
              type="email"
              placeholder="alumno@ulima.edu.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Cargando...' : isRegistering ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>

        <div className="login-toggle-container">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setEmail('');
              setPassword('');
            }}
            className="toggle-btn"
            disabled={loading}
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿Eres nuevo estudiante? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}