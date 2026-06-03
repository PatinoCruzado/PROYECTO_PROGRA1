import React, { useState } from 'react';
import TopNav from './TopNav/TopNav'; 
import SideBar from './SideBar/SideBar';
import Main from './Main/Main';
import Modal from './Modal/Modal';
import { INITIAL_ITEMS } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard({ userEmail = "estudiante@ulima.edu.pe", onLogout, isAdmin = false }) {
  const [currentTopTab, setTopTab] = useState('inicio');
  const [activeTab, setActiveTab] = useState('todos');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // ⚙️ Estado de Preferencias de Alertas (Solución al Checkbox de Ajustes)
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('master_activities');
      return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    } catch (e) {
      return INITIAL_ITEMS;
    }
  });

  const [registeredIds, setRegisteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`reg_${userEmail}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleInscribirse = (id) => {
    if (registeredIds.includes(id)) return;
    const item = activities.find(act => act.id === id);
    const updated = [...registeredIds, id];
    setRegisteredIds(updated);
    localStorage.setItem(`reg_${userEmail}`, JSON.stringify(updated));

    // Solo genera notificación si el checkbox de Ajustes está activo
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

  const handleCancelarInscripcion = (id) => {
    const item = activities.find(act => act.id === id);
    const updated = registeredIds.filter(regId => regId !== id);
    setRegisteredIds(updated);
    localStorage.setItem(`reg_${userEmail}`, JSON.stringify(updated));

    // Solo genera notificación si el checkbox de Ajustes está activo
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

  // Funciones para limpiar la bandeja de notificaciones
  const handleClearAllNotifications = () => setNotifications([]);
  const handleRemoveNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

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

  const itemsFiltrados = activities.filter(item => {
    if (!item || !item.tipo) return false;
    if (activeTab === 'mis-actividades') return registeredIds.includes(item.id);
    if (activeTab === 'todos') return true;
    if (activeTab === 'talleres' && item.tipo === 'Workshop') return true;
    if (activeTab === 'torneos' && item.tipo === 'Tournament') return true;
    if (activeTab === 'eventos' && item.tipo === 'Event') return true;
    return false;
  });

  const displayUserName = userEmail && userEmail.includes('@') ? userEmail.split('@')[0] : "Usuario";

  const renderMainWorkspace = () => {
    // 📅 SECCIÓN: MI HORARIO ACADÉMICO (Estructura de Tabla Real)
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

    // 📁 SECCIÓN: TRÁMITES ACADÉMICOS
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

    // ⚙️ SECCIÓN: AJUSTES (Conexión directa con el estado del checkbox)
    if (activeTab === 'ajustes') {
      return (
        <div className="dynamic-workspace-panel settings-view-container">
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
          </div>
          <button className="panel-action-btn" onClick={() => setActiveTab('todos')}>Regresar al Catálogo</button>
        </div>
      );
    }

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

  return (
    <div className="dashboard-master-container">
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
      
      <div className="dashboard-workspace">
        <SideBar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setTopTab('inicio'); 
          }} 
          userEmail={userEmail} 
          onLogout={onLogout} 
          countInscritos={registeredIds.length} 
        />
        
        {renderMainWorkspace()}
      </div>

      {selectedItem && (
        <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}