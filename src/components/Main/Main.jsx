import React, { useState } from 'react'; 
import './Main.css';

export default function Main({ items, registeredIds, onSelect, onRegister, activeTab }) {
  
  const [selectedCarrera, setSelectedCarrera] = useState('todas');
  
  const carrerasDisponibles = ['todas', ...new Set(items.map(item => item.facultad))];

  const itemsFiltradosPorCarrera = items.filter(item => {
    if (selectedCarrera === 'todas') return true;
    return item.facultad === selectedCarrera;
  });

  return (
    <div className="main-content-wrapper">
      
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="main-title" style={{ margin: 0 }}>
          {activeTab === 'mis-registros' ? 'Mis Inscripciones' : `Listado de ${activeTab}`}
        </h2>
          
        {/*asdasdsa*/}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'sans-serif' }}>
          <label htmlFor="carrera-select" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
            Filtrar por Carrera:
          </label>
          <select
            id="carrera-select"
            value={selectedCarrera}
            onChange={(e) => setSelectedCarrera(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: 'white',
              color: '#1e293b',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {carrerasDisponibles.map(carrera => (
              <option key={carrera} value={carrera}>
                {carrera === 'todas' ? '🌐 Todas las Carreras' : carrera}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cards-container">
        {}
        {itemsFiltradosPorCarrera.length === 0 ? (
          <p style={{ color: '#64748b' }}>No se encontraron actividades de esta carrera.</p>
        ) : (
          itemsFiltradosPorCarrera.map(item => (
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