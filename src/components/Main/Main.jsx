import React, { useState } from 'react';
import './Main.css';

export default function Main({ items, registeredIds, onSelect, onRegister, isAdmin, onCreateActivity, onDeleteActivity }) {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('taller');
  const [descripcion, setDescripcion] = useState('');
  const [encargado, setEncargado] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo || !descripcion || !encargado) return;
    
    onCreateActivity({ titulo, tipo, descripcion, encargado });
    setTitulo('');
    setDescripcion('');
    setEncargado('');
  };

  return (
    <main className="main-content">
      {isAdmin && (
        <div className="admin-form-container" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>📝 Panel de Administrador: Crear Actividad</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Título de la actividad" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)}
                style={{ flex: 2, padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                required 
              />
              <select 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="taller">Taller</option>
                <option value="torneo">Torneo</option>
                <option value="evento">Evento</option>
              </select>
            </div>
            <input 
              type="text" 
              placeholder="Encargado / Expositor" 
              value={encargado} 
              onChange={(e) => setEncargado(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required 
            />
            <textarea 
              placeholder="Descripción de la actividad..." 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', height: '60px', resize: 'none' }}
              required 
            />
            <button type="submit" style={{ background: '#22c55e', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              ➕ Guardar Nueva Actividad
            </button>
          </form>
        </div>
      )}

      <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {items.map((item) => {
          const yaInscrito = registeredIds.includes(item.id);
          return (
            <div key={item.id} className="activity-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'between', position: 'relative' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', background: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#475569' }}>
                  {item.tipo}
                </span>
                <h4 style={{ margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>{item.titulo}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>{item.descripcion}</p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 1.5rem 0' }}>👤 {item.encargado}</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button onClick={() => onSelect(item)} style={{ flex: 1, padding: '0.5rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Ver detalles
                </button>
                
                {!isAdmin && (
                  <button 
                    onClick={() => onRegister(item.id)} 
                    disabled={yaInscrito}
                    style={{ flex: 1, padding: '0.5rem', background: yaInscrito ? '#94a3b8' : '#ff6b00', color: 'white', border: 'none', borderRadius: '6px', cursor: yaInscrito ? 'default' : 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                  >
                    {yaInscrito ? 'Inscrito ✓' : 'Inscribirse'}
                  </button>
                )}

                {isAdmin && (
                  <button 
                    onClick={() => onDeleteActivity(item.id)} 
                    style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}