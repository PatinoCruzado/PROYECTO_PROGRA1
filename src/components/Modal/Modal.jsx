import React from 'react';
import './Modal.css';

export default function Modal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, color: '#ff6b00' }}>
          {item.tipo} • {item.facultad}
        </span>
        <h2 style={{ margin: '0.5rem 0 1rem 0', color: '#0f172a' }}>{item.titulo}</h2>
        <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.5 }}>{item.descripcion}</p>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
          <strong>Programación:</strong> {item.fecha} <br />
          <strong>Estado de Inscripción:</strong> {item.estado}
        </div>
        <div className="results-section">
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>📢 Módulo de Resultados:</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', fontStyle: 'italic' }}>{item.resultados}</p>
        </div>
      </div>
    </div>
  );
}