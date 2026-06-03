import React, { useState } from 'react';
import './TopNav.css';

export default function TopNav({ 
  userName = "Usuario", 
  currentTopTab = "inicio", 
  setTopTab = () => {},
  notifications = [],
  onClearAll = () => {},
  onRemoveNotification = () => {}
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="top-nav-container">
      <div className="top-nav-brand" onClick={() => setTopTab('inicio')}>
        <span className="brand-title-main">MyUlima</span>
      </div>

      <nav className="top-nav-links">
        <button className={`nav-link-item ${currentTopTab === 'inicio' ? 'active' : ''}`} onClick={() => setTopTab('inicio')}>Inicio</button>
        <button className={`nav-link-item ${currentTopTab === 'horario' ? 'active' : ''}`} onClick={() => setTopTab('horario')}>Mi Horario</button>
        <button className={`nav-link-item ${currentTopTab === 'tramites' ? 'active' : ''}`} onClick={() => setTopTab('tramites')}>Trámites</button>
      </nav>

      <div className="top-nav-actions">
        <div className="notification-wrapper-relative">
          <button className="notification-bell-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <svg className="bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notifications.length > 0 && <span className="bell-badge-count">{notifications.length}</span>}
          </button>

          {showDropdown && (
            <div className="notifications-dropdown-menu">
              <div className="dropdown-header">
                <span>Notificaciones</span>
                {notifications.length > 0 && (
                  <button className="clear-all-notifs-btn" onClick={onClearAll}>Limpiar todo</button>
                )}
              </div>
              <div className="dropdown-body-scroll">
                {notifications.length === 0 ? (
                  <div className="empty-notifications-view">
                    <svg className="empty-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                    </svg>
                    <p>Tu bandeja de entrada está vacía</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`notification-item-card ${notif.tipo}`}>
                      <div className="notif-content-row">
                        <p className="notif-text-message">{notif.texto}</p>
                        {/* Botón para eliminar notificación individual */}
                        <button 
                          className="delete-single-notif-btn" 
                          onClick={() => onRemoveNotification(notif.id)}
                        >
                          &times;
                        </button>
                      </div>
                      <span className="notif-timestamp-label">{notif.fecha}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="user-profile-badge">
          <img className="user-avatar-img" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt={userName} />
          <div className="user-info-text-block">
            <span className="user-name-display">{userName}</span>
            <span className="user-role-sub">Estudiante</span>
          </div>
        </div>
      </div>
    </header>
  );
}