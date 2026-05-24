import React from 'react';
import './Main.css';

export default function Main({ items, registeredIds, onSelect, onRegister, activeTab }) {
  return (
    <div className="main-content-wrapper">
      <h2 className="main-title">{activeTab === 'mis-registros' ? 'Mis Inscripciones' : `Listado de ${activeTab}`}</h2>
      <div className="cards-container">
        {items.length === 0 ? (
          <p style={{ color: '#64748b' }}>No se encontraron actividades de esta categoría.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="item-card">
              <div className="card-info">
                <div>
                  <span className={`tag ${item.tipo === 'Taller' ? 'tag-taller' : item.tipo === 'Torneo' ? 'tag-torneo' : 'tag-evento'}`}>
                    {item.tipo}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>📍 {item.facultad}</span>
                </div>
                <h3>{item.titulo}</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>📅 Fecha: {item.fecha}</span>
              </div>
              <div className="card-actions">
                <button className="btn-action btn-blue" onClick={() => onSelect(item)}>Ver Detalles</button>
                {registeredIds.includes(item.id) ? (
                  <span className="registered-badge">✓ Inscrito</span>
                ) : (
                  <button
                    className="btn-action btn-orange"
                    disabled={item.estado === 'Finalizado'}
                    onClick={() => onRegister(item.id)}
                  >
                    {item.estado === 'Finalizado' ? 'Cerrado' : 'Inscribirse'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}