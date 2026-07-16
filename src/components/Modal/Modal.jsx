import React from 'react';
import './Modal.css';

export default function Modal({ item, onClose }) {
  if (!item) return null;

  const formatTipo = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'workshop': return 'Taller';
      case 'tournament': return 'Torneo';
      case 'event': return 'Evento';
      default: return tipo;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        {item.imagen && (
          <div className="modal-hero-image">
            <img src={item.imagen} alt={item.titulo} />
          </div>
        )}

        <div className="modal-body-content">
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <span className={`modal-badge ${item.tipo?.toLowerCase()}`}>
              {formatTipo(item.tipo)}
            </span>
            {item.carrera && (
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#7f8087' }}>
                • {item.carrera}
              </span>
            )}
          </div>

          <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '700', lineHeight: '1.3' }}>
            {item.titulo}
          </h2>
          
          <div style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '16px', color: '#555' }}>
            <p style={{ margin: '4px 0' }}><strong>Programación:</strong> {item.fecha}</p>
            <p style={{ margin: '4px 0' }}><strong>Ubicación:</strong> {item.lugar}</p>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #e1dfe1', margin: '16px 0' }} />

          <div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600' }}>
              Descripción de la actividad:
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
              {item.descripcion || "No hay una descripción detallada cargada para esta actividad institucional."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}