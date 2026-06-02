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
    
    const storedUsers = localStorage.getItem('usuarios_registrados');
    const usuarios = storedUsers ? JSON.parse(storedUsers) : [];

    if (isRegistering) {
      const existePredeterminado = email.trim() === USUARIO_PREDETERMINADO.email || email.trim() === ADMIN_PREDETERMINADO.email;
      const existeEnStorage = usuarios.some(u => u.email === email.trim());

      if (existePredeterminado || existeEnStorage) {
        alert('❌ El usuario ya se encuentra registrado.');
        return;
      }

      const nuevoUsuario = {
        email: email.trim(),
        password: password
      };

      usuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios_registrados', JSON.stringify(usuarios));
      alert('✅ Usuario creado con éxito. Ahora puedes iniciar sesión.');
      setIsRegistering(false);
      setEmail('');
      setPassword('');
    } else {
      const esPredeterminado = email.trim() === USUARIO_PREDETERMINADO.email && password === USUARIO_PREDETERMINADO.password;
      const esAdmin = email.trim() === ADMIN_PREDETERMINADO.email && password === ADMIN_PREDETERMINADO.password;
      const esRegistrado = usuarios.some(u => u.email === email.trim() && u.password === password);

      if (esPredeterminado || esAdmin || esRegistrado) {
        onLogin(email.trim());
      } else {
        alert('❌ Correo o contraseña incorrectos.');
        setPassword('');
      }
    }
  };

  return (
    <div className={`login-container ${isRegistering ? 'mode-register' : 'mode-login'}`}>
      <div className="login-card">
        <div className="login-icon">
          {isRegistering ? '📝' : '🏛️'}
        </div>
        <h2 className="login-title">
          {isRegistering ? 'Crear Cuenta' : 'Portal MyUlima'}
        </h2>
        <p className="login-subtitle">
          {isRegistering ? 'Únete a la plataforma de inscripciones' : 'Bienvenido al sistema de alumnos'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo Institucional</label>
            <input
              type="email"
              placeholder="ejemplo@ulima.edu.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <button type="submit" className={`login-btn ${isRegistering ? 'btn-register' : 'btn-login'}`}>
            {isRegistering ? 'Confirmar Registro' : 'Iniciar Sesión'}
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
            {isRegistering ? '¿Ya tienes una cuenta? Ingresa aquí' : '¿Eres nuevo? Crea una cuenta aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}