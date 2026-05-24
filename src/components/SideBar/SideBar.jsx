import React from 'react';
import './SideBar.css';

export default function SideBar({ activeTab, setActiveTab, userEmail, onLogout, countInscritos }) {
  const menuItems = [
    { id: 'todos', label: '🌐 Todas las Actividades' },
    { id: 'talleres', label: '📚 Talleres' },
    { id: 'eventos', label: '🎉 Eventos' },
    { id: 'torneos', label: '🏆 Torneos' },
    { id: 'mis-registros', label: `✅ Mis Inscripciones (${countInscritos})` }
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-title">🏛️ MyUlima App</div>
        <div className="sidebar-menu">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-btn ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="sidebar-footer">
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', color: '#cbd5e1' }}>👤 {userEmail}</div>
        <span onClick={onLogout} className="logout-link">Cerrar Sesión</span>
      </div>
    </aside>
  );
}