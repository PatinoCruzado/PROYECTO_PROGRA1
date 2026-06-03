import React, { useRef, useState } from 'react';
import './Main.css';

export default function Main({ 
  items = [], 
  registeredIds = [], 
  onSelect = () => {}, 
  onRegister = () => {}, 
  onCancelRegister = () => {}, // Recibimos la nueva función
  activeTab = 'todos',
  isAdmin = false,
  onCreateActivity = () => {},
  onDeleteActivity = () => {},
  setActiveTab = () => {}
}) {

  const bannerRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Workshop');
  const [fecha, setFecha] = useState('');
  const [lugar, setLugar] = useState('');
  const [imagen, setImagen] = useState('');

  // 🕹️ Efecto sutil calibrado a 4 grados de rotación
  const handleMouseMove = (e) => {
    const banner = bannerRef.current;
    if (!banner) return;
    const rect = banner.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    banner.style.setProperty('--rotate-x', `${-y * 2}deg`);
    banner.style.setProperty('--rotate-y', `${x * 2}deg`);
  };

  const handleMouseLeave = () => {
    const banner = bannerRef.current;
    if (!banner) return;
    banner.style.setProperty('--rotate-x', '0deg');
    banner.style.setProperty('--rotate-y', '0deg');
  };

  const getSectionTitle = () => {
    switch(activeTab) {
      case 'talleres': return 'Talleres Académicos';
      case 'eventos': return 'Eventos Culturales';
      case 'torneos': return 'Torneos';
      case 'mis-actividades': return 'Mis Inscripciones';
      default: return 'Todas las Actividades';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo || !fecha || !lugar) return;
    const imgUrl = imagen.trim() !== '' ? imagen : "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80";
    onCreateActivity({ titulo, tipo, fecha, lugar, imagen: imgUrl });
    setTitulo(''); setFecha(''); setLugar(''); setImagen(''); setShowForm(false);
  };

  return (
    <main className="main-workspace-container">
      
      {/* BANNER PRINCIPAL CON BOTONES OPERATIVOS */}
      <div 
        className="hero-banner-card"
        ref={bannerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="hero-banner-content-wrapper">
          <span className="hero-badge-semester">Panel de Control {isAdmin ? 'Administrador' : 'Estudiante'}</span>
          <h1 className="hero-welcome-title">
            {isAdmin ? 'Gestión de Contenido Universitario' : 'Potencia tu Vida Universitaria'}
          </h1>
          <p className="hero-subtitle">
            {isAdmin 
              ? 'Crea, modifica o elimina eventos y talleres del catálogo de alumnos en tiempo real.' 
              : 'Explora talleres de alto rendimiento, torneos deportivos e impulsa tu crecimiento académico.'
            }
          </p>
          
          <div className="hero-actions-layout">
            {isAdmin ? (
              <button className="hero-btn-primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cerrar Formulario' : 'Crear Nueva Actividad'}
              </button>
            ) : (
              <>
                {/* 🔗 FUNCIONALIDAD ASIGNADA A LOS BOTONES DEL BANNER */}
                <button className="hero-btn-primary" onClick={() => setActiveTab('todos')}>
                  Explorar Catálogo
                </button>
                <button className="hero-btn-secondary" onClick={() => setActiveTab('talleres')}>
                  Ver Talleres
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isAdmin && showForm && (
        <form className="admin-creation-panel" onSubmit={handleSubmit}>
          <h3>Publicar Nueva Actividad</h3>
          <div className="form-grid-layout">
            <div className="input-block">
              <label>Título de la actividad</label>
              <input type="text" placeholder="Ej: Taller Avanzado de React" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>
            <div className="input-block">
              <label>Tipo de Categoría</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="Workshop">Taller</option>
                <option value="Tournament">Torneo</option>
                <option value="Event">Evento</option>
              </select>
            </div>
            <div className="input-block">
              <label>Fecha y Hora</label>
              <input type="text" placeholder="Ej: Jun 15 • 16:00 PM" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="input-block">
              <label>Lugar / Aula</label>
              <input type="text" placeholder="Ej: Auditorio Central" value={lugar} onChange={(e) => setLugar(e.target.value)} />
            </div>
            <div className="input-block full-width-input">
              <label>URL de la Imagen (Opcional)</label>
              <input type="text" placeholder="https://..." value={imagen} onChange={(e) => setImagen(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="form-submit-btn">Guardar y Publicar</button>
        </form>
      )}

      <div className="section-header-flex">
        <div>
          <h2 className="section-main-heading">{getSectionTitle()}</h2>
          <p className="section-sub-heading">
            {items.length} {items.length === 1 ? 'ítem listado' : 'ítems listados'}
          </p>
        </div>
      </div>

      <div className="activities-cards-grid">
        {items.length === 0 ? (
          <div className="no-items-fallback">
            <p>No hay elementos registrados en esta sección.</p>
          </div>
        ) : (
          items.map((item) => {
            const isRegistered = registeredIds.includes(item.id);
            const badgeClasses = { Workshop: 'badge-workshop', Tournament: 'badge-tournament', Event: 'badge-event' };
            const translateType = { Workshop: 'Taller', Tournament: 'Torneo', Event: 'Evento' };

            return (
              <div key={item.id} className="activity-card-item" onClick={() => onSelect(item)}>
                <div className="card-image-wrapper">
                  <span className={`card-floating-badge ${badgeClasses[item.tipo] || 'badge-event'}`}>
                    {translateType[item.tipo] || item.tipo}
                  </span>
                  <img className="card-main-thumbnail" src={item.imagen} alt={item.titulo} />
                </div>

                <div className="card-body-content">
                  <h3 className="card-item-title">{item.titulo}</h3>
                  
                  <div className="card-metadata-block" style={{ marginTop: '12px' }}>
                    <div className="meta-info-row"><span>📅 {item.fecha}</span></div>
                    <div className="meta-info-row"><span>📍 {item.lugar}</span></div>
                  </div>

                  {isAdmin ? (
                    <button 
                      className="card-action-btn btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        if(confirm("¿Seguro que deseas eliminar esta actividad?")) onDeleteActivity(item.id);
                      }}
                    >
                      Eliminar Actividad
                    </button>
                  ) : (
                    /* 🔄 INTERACCIÓN INTERCAMBIABLE: INSCRIBIRSE / CANCELAR MATRÍCULA */
                    <button 
                      className={`card-action-btn ${isRegistered ? 'btn-cancel-register' : 'btn-orange'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isRegistered) {
                          onCancelRegister(item.id);
                        } else {
                          onRegister(item.id);
                        }
                      }}
                    >
                      {isRegistered ? 'Cancelar Inscripción' : 'Inscribirse'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}