import React, { useState } from 'react';
import './Login.css';

const USUARIO_PREDETERMINADO = {
  email: '20232182@aloe.ulima.edu.pe',
  password: 'ulima2026'
};

const ADMIN_PREDETERMINADO = {
  email: 'admin@ulima.edu.pe',
  password: 'admin2026'
};

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    const storedUsers = localStorage.getItem('usuarios_registrados');
    const usuarios = storedUsers ? JSON.parse(storedUsers) : [];

    if (isRegistering) {
      const existePredeterminado = cleanEmail === USUARIO_PREDETERMINADO.email || cleanEmail === ADMIN_PREDETERMINADO.email;
      const existeEnStorage = usuarios.some(u => u.email === cleanEmail);

      if (existePredeterminado || existeEnStorage) {
        alert('❌ El usuario ya se encuentra registrado.');
        return;
      }

      const nuevoUsuario = {
        email: cleanEmail,
        password: password
      };

      usuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios_registrados', JSON.stringify(usuarios));
      alert('✅ Cuenta creada con éxito. Ya puedes iniciar sesión.');
      setIsRegistering(false);
      setEmail('');
      setPassword('');
    } else {
      const esPredeterminado = cleanEmail === USUARIO_PREDETERMINADO.email && password === USUARIO_PREDETERMINADO.password;
      const esAdmin = cleanEmail === ADMIN_PREDETERMINADO.email && password === ADMIN_PREDETERMINADO.password;
      const esRegistrado = usuarios.some(u => u.email === cleanEmail && u.password === password);

      if (esPredeterminado || esAdmin || esRegistrado) {
        onLogin(cleanEmail);
      } else {
        alert('❌ Correo o contraseña incorrectos.');
        setPassword('');
      }
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
              required
            />
          </div>

          <button type="submit" className="login-btn">
            {isRegistering ? 'Registrarse' : 'Ingresar'}
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
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿Eres nuevo estudiante? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}