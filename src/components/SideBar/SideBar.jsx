import React from 'react';
import './SideBar.css';

export default function SideBar({ 
  activeTab = 'todos', 
  setActiveTab = () => {}, 
  userEmail = "estudiante@ulima.edu.pe", 
  onLogout = () => {},
  countInscritos = 0 
}) {
  return (
    <aside className="sidebar-master-panel">
      {/* Contenedor superior para agrupar los botones */}
      <div className="sidebar-top-content">
        <div className="sidebar-navigation-group">
          <span className="sidebar-group-title">Descubrir</span>
          
          <button 
            className={`sidebar-menu-btn ${activeTab === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="sidebar-btn-text">Todas las Actividades</span>
          </button>

          <button 
            className={`sidebar-menu-btn ${activeTab === 'talleres' ? 'active' : ''}`}
            onClick={() => setActiveTab('talleres')}
          >
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span className="sidebar-btn-text">Talleres Académicos</span>
          </button>

          <button 
            className={`sidebar-menu-btn ${activeTab === 'eventos' ? 'active' : ''}`}
            onClick={() => setActiveTab('eventos')}
          >
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="sidebar-btn-text">Eventos Culturales</span>
          </button>

          <button 
            className={`sidebar-menu-btn ${activeTab === 'torneos' ? 'active' : ''}`}
            onClick={() => setActiveTab('torneos')}
          >
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="sidebar-btn-text">Torneos</span>
          </button>
        </div>

        <div className="sidebar-navigation-group">
          <span className="sidebar-group-title">Tu Espacio</span>

          <button 
            className={`sidebar-menu-btn ${activeTab === 'mis-actividades' ? 'active' : ''}`}
            onClick={() => setActiveTab('mis-actividades')}
          >
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="sidebar-btn-text">Mis Inscripciones</span>
            {countInscritos > 0 && (
              <span className="sidebar-counter-badge">{countInscritos}</span>
            )}
          </button>

          <button 
            className={`sidebar-menu-btn ${activeTab === 'ajustes' ? 'active' : ''}`}
            onClick={() => setActiveTab('ajustes')}
          >
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span className="sidebar-btn-text">Ajustes</span>
          </button>
        </div>
      </div>

      <div className="sidebar-footer-account">
        <div className="sidebar-user-meta">
          <span className="sidebar-user-email-text" title={userEmail}>{userEmail}</span>
        </div>
        <button className="sidebar-logout-action-btn" onClick={onLogout}>
          <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}