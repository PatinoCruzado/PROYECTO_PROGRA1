import React, { useState } from 'react';
import TopNav from './TopNav/TopNav'; 
import SideBar from './SideBar/SideBar';
import Main from './Main/Main';
import Modal from './Modal/Modal';
import { INITIAL_ITEMS } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard({ userEmail = "estudiante@ulima.edu.pe", onLogout, isAdmin = false }) {
  // === 1. ESTADOS PRINCIPALES DE LA INTERFAZ ===
  const [currentTopTab, setTopTab] = useState('inicio'); // Controla la barra superior (Inicio, Horario, Trámites)
  const [activeTab, setActiveTab] = useState('todos');   // Controla el menú lateral izquierdo (Filtros de catálogo)
  const [selectedItem, setSelectedItem] = useState(null); // Guarda el ítem seleccionado para abrir la ventana modal
  
  // === 2. ESTADOS DE NOTIFICACIONES Y ALERTAS ===
  const [allowNotifications, setAllowNotifications] = useState(true); // Estado del checkbox en Ajustes
  const [notifications, setNotifications] = useState([]);             // Lista de alertas dinámicas activas

  // === 3. PERSISTENCIA DE DATOS (LOCALSTORAGE) ===
  // Carga las actividades desde la memoria del navegador. Si están corruptas o viejas, las repara al instante.
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('master_activities');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // AUTO-REPARACIÓN FOTO DEL FÚTSAL: Si detecta la imagen rota antigua, reescribe la memoria
        const itemFutsal = parsed.find(act => act.id === 5);
        if (!itemFutsal || itemFutsal.imagen.includes('photo-1508098682722')) {
          localStorage.setItem('master_activities', JSON.stringify(INITIAL_ITEMS));
          return INITIAL_ITEMS;
        }
        return parsed;
      }
      return INITIAL_ITEMS;
    } catch (e) {
      return INITIAL_ITEMS;
    }
  });

  // Carga los IDs de las actividades a las que el estudiante se ha inscrito
  const [registeredIds, setRegisteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`reg_${userEmail}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // === 4. LÓGICA DE CONTROLADORES (MANIPULACIÓN DEL ESTADO) ===
  
  // Función para inscribirse en una actividad
  const handleInscribirse = (id) => {
    if (registeredIds.includes(id)) return;
    const item = activities.find(act => act.id === id);
    const updated = [...registeredIds, id];
    setRegisteredIds(updated);
    localStorage.setItem(`reg_${userEmail}`, JSON.stringify(updated));

    // Despliega alerta visual en el TopNav solo si el switch de Ajustes está activado
    if (item && allowNotifications) {
      const newNotif = {
        id: Date.now(),
        texto: `Inscripción confirmada: "${item.titulo}"`,
        tipo: 'success',
        fecha: 'Ahora'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Función para cancelar un cupo inscrito
  const handleCancelarInscripcion = (id) => {
    const item = activities.find(act => act.id === id);
    const updated = registeredIds.filter(regId => regId !== id);
    setRegisteredIds(updated);
    localStorage.setItem(`reg_${userEmail}`, JSON.stringify(updated));

    if (item && allowNotifications) {
      const newNotif = {
        id: Date.now(),
        texto: `Cancelaste tu cupo en: "${item.titulo}"`,
        tipo: 'cancel',
        fecha: 'Ahora'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Gestión de la campana de notificaciones
  const handleClearAllNotifications = () => setNotifications([]);
  const handleRemoveNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // Funciones exclusivas del Panel de Administrador (Crear y Eliminar)
  const handleCreateActivity = (newActivity) => {
    const updated = [...activities, { ...newActivity, id: Date.now() }];
    setActivities(updated);
    localStorage.setItem('master_activities', JSON.stringify(updated));
  };

  const handleDeleteActivity = (id) => {
    const updated = activities.filter(act => act.id !== id);
    setActivities(updated);
    localStorage.setItem('master_activities', JSON.stringify(updated));
    if (selectedItem && selectedItem.id === id) setSelectedItem(null);
  };

  // === 5. PROCESAMIENTO Y FILTRADO FILTRADO DE DATOS (FRONT-END) ===
  // Filtra dinámicamente el catálogo según la pestaña lateral que el usuario tenga activa
  const itemsFiltrados = activities.filter(item => {
    if (!item || !item.tipo) return false;
    if (activeTab === 'mis-actividades') return registeredIds.includes(item.id);
    if (activeTab === 'todos') return true;
    if (activeTab === 'talleres' && item.tipo === 'Workshop') return true;
    if (activeTab === 'torneos' && item.tipo === 'Tournament') return true;
    if (activeTab === 'eventos' && item.tipo === 'Event') return true;
    return false;
  });

  // SOLUCIÓN AL BUG CONTADOR FANTASMA: Valida que las inscripciones pertenezcan a actividades reales existentes
  const constInscritasReales = registeredIds.filter(id => 
    activities.some(act => act.id === id)
  );

  // Extrae el alias de usuario desde su correo de la universidad
  const displayUserName = userEmail && userEmail.includes('@') ? userEmail.split('@')[0] : "Usuario";

  // === 6. ENRUTADOR DE VISTAS DINÁMICAS (RENDER WORKSPACE) ===
  const renderMainWorkspace = () => {
    // VISTA: Horario Académico del Estudiante
    if (currentTopTab === 'horario') {
      return (
        <div className="dynamic-workspace-panel animate-fade">
          <div className="panel-header-title">
            <h2>Mi Horario Semanal</h2>
            <p>Ciclo Activo 2026-I • Distribución regular de asignaturas curriculares</p>
          </div>
          <table className="schedule-data-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="time-col">08:00 - 10:00</td>
                <td><div className="course-block color-1">Desarrollo Web I<br/><span>Aula V-502</span></div></td>
                <td>-</td>
                <td><div className="course-block color-1">Desarrollo Web I<br/><span>Aula V-502</span></div></td>
                <td>-</td>
                <td><div className="course-block color-2">Estructuras de Datos<br/><span>Lab B-401</span></div></td>
              </tr>
              <tr>
                <td className="time-col">10:00 - 12:00</td>
                <td>-</td>
                <td><div className="course-block color-3">Base de Datos II<br/><span>Aula V-404</span></div></td>
                <td>-</td>
                <td><div className="course-block color-3">Base de Datos II<br/><span>Aula V-404</span></div></td>
                <td>-</td>
              </tr>
              <tr>
                <td className="time-col">14:00 - 16:00</td>
                <td><div className="course-block color-4">Ingeniería de Software<br/><span>Aula S-201</span></div></td>
                <td>-</td>
                <td>-</td>
                <td><div className="course-block color-4">Ingeniería de Software<br/><span>Aula S-201</span></div></td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    // VISTA: Mesa de Trámites Administrativos
    if (currentTopTab === 'tramites') {
      return (
        <div className="dynamic-workspace-panel animate-fade">
          <div className="panel-header-title">
            <h2>Mesa de Trámites y Solicitudes</h2>
            <p>Gestiona documentos oficiales y requerimientos administrativos</p>
          </div>
          <div className="tramites-grid-layout">
            <div className="tramite-action-card">
              <h4>Certificado de Estudios</h4>
              <p>Documento oficial que detalla las asignaturas aprobadas y notas del ciclo anterior.</p>
              <button className="tramite-init-btn">Iniciar Trámite</button>
            </div>
            <div className="tramite-action-card">
              <h4>Reserva de Matrícula</h4>
              <p>Solicitud formal para aplazar el periodo académico actual sin perder la vacante institucional.</p>
              <button className="tramite-init-btn">Iniciar Trámite</button>
            </div>
            <div className="tramite-action-card">
              <h4>Constancia de Tercio Superior</h4>
              <p>Acreditación de rendimiento destacado dentro de tu facultad académica.</p>
              <button className="tramite-init-btn">Iniciar Trámite</button>
            </div>
          </div>
        </div>
      );
    }

    // VISTA: Ajustes y Preferencias del Sistema
    if (activeTab === 'ajustes') {
      return (
        <div className="dynamic-workspace-panel settings-view-container animate-fade">
          <div className="panel-header-title">
            <h2>Ajustes de la Cuenta</h2>
            <p>Gestiona tus parámetros de seguridad y preferencias de la interfaz</p>
          </div>
          
          <div className="settings-options-card">
            <div className="settings-row-item">
              <div>
                <h4>Seguridad del Perfil</h4>
                <p>Actualizar la contraseña vinculada al correo de autenticación.</p>
              </div>
              <button className="settings-action-inline-btn">Modificar</button>
            </div>

            <div className="settings-row-item">
              <div>
                <h4>Preferencia de Alertas Dinámicas</h4>
                <p>Habilitar el despliegue de notificaciones en la barra superior al inscribirte o cancelar.</p>
              </div>
              <input 
                type="checkbox" 
                checked={allowNotifications} 
                onChange={(e) => setAllowNotifications(e.target.checked)} 
                className="settings-toggle-switch" 
              />
            </div>

            <div className="settings-row-item logout-row">
              <div>
                <h4>Sesión de Estudiante</h4>
                <p>Salir de tu cuenta actual de forma segura en este dispositivo.</p>
              </div>
              <button className="settings-logout-btn" onClick={onLogout}>
                <svg className="settings-logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Salir</span>
              </button>
            </div>
          </div>

          <button className="panel-action-btn" onClick={() => setActiveTab('todos')}>Regresar al Catálogo</button>
        </div>
      );
    }

    // VISTA POR DEFECTO: El Catálogo Principal (Componente Main)
    return (
      <Main 
        items={itemsFiltrados} 
        registeredIds={registeredIds} 
        onSelect={setSelectedItem} 
        onRegister={handleInscribirse} 
        onCancelRegister={handleCancelarInscripcion}
        activeTab={activeTab}
        isAdmin={isAdmin}
        onCreateActivity={handleCreateActivity}
        onDeleteActivity={handleDeleteActivity}
        setActiveTab={setActiveTab}
      />
    );
  };

  // === 7. ESTRUCTURA VISUAL COMPLETA (MAQUETADO JSX) ===
  return (
    <div className="dashboard-master-container">
      {/* Barra de Navegación Superior */}
      <TopNav 
        userName={displayUserName} 
        currentTopTab={currentTopTab}
        setTopTab={(tab) => {
          setTopTab(tab);
          if (tab !== 'inicio') setActiveTab('todos'); 
        }}
        notifications={notifications}
        onClearAll={handleClearAllNotifications}
        onRemoveNotification={handleRemoveNotification}
      />
      
      {/* Cuerpo del Workspace Principal (Distribución Flexbox/Grid) */}
      <div className="dashboard-workspace">
        <SideBar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setTopTab('inicio'); 
          }} 
          userEmail={userEmail} 
          onLogout={onLogout} 
          countInscritos={constInscritasReales.length} // Envía el conteo verificado
        />
        
        {renderMainWorkspace()}
      </div>

      {/* Ventana Emergente Detallada (Modal Condicional) */}
      {selectedItem && (
        <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}