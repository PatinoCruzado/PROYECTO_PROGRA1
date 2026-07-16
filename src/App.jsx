import React, { useState } from 'react';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('sessionUser') || '');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('sessionRole') || 'student');

  const handleLogin = (email, role, token) => {
    setUserEmail(email);
    setUserRole(role);
    localStorage.setItem('sessionUser', email);
    localStorage.setItem('sessionRole', role);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUserEmail('');
    setUserRole('student');
    localStorage.removeItem('sessionUser');
    localStorage.removeItem('sessionRole');
    localStorage.removeItem('token');
  };

  const isAdmin = userRole === 'admin';

  return (
    <>
      {!userEmail ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard userEmail={userEmail} onLogout={handleLogout} isAdmin={isAdmin} />
      )}
    </>
  );
}