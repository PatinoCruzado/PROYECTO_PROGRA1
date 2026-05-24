import React, { useState } from 'react';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('sessionUser') || '');

  const handleLogin = (email) => {
    setUserEmail(email);
    localStorage.setItem('sessionUser', email);
  };

  const handleLogout = () => {
    setUserEmail('');
    localStorage.removeItem('sessionUser');
  };

  return (
    <>
      {!userEmail ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard userEmail={userEmail} onLogout={handleLogout} />
      )}
    </>
  );
}