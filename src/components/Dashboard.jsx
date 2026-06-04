import React, { useState } from 'react';
import TopNav from './TopNav/TopNav'; 
import SideBar from './SideBar/SideBar';
import Main from './Main/Main';
import Modal from './Modal/Modal';
import { INITIAL_ITEMS } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard({ userEmail = "estudiante@ulima.edu.pe", onLogout, isAdmin = false }) {
  
  // === 1. ESTADOS DE LA INTERFAZ ===
  const [currentTopTab, setTopTab] = useState('inicio'); // Controla la barra superior (inicio, horario, tramites)
  const [activeTab, setActiveTab] = useState('todos');   // Controla los filtros del menú lateral izquierdo
  const [selectedItem, setSelectedItem] = useState(null); // Guarda la actividad seleccionada para el Modal

  // === 2. PERSISTENCIA DE DATOS (LOCALSTORAGE) ===
  // Carga las actividades desde el navegador o usa las iniciales si no hay nada guardado
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('master_activities');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  // Carga las actividades inscritas por este estudiante específico
  const [registeredIds, setRegisteredIds] = useState(() => {
    const saved = localStorage.getItem(`reg_${userEmail}`);
    return saved ? JSON.parse(saved) : [];
  });

  // === 3. CONTROLADORES Y FUNCIONES OPERATIVAS ===
  
  // Función para inscribirse en una actividad
  const handleInscribirse = (id) => {
    if (registeredIds.includes(id)) return;
    const updated = [...registeredIds, id];
    setRegisteredIds(updated);
    localStorage.setItem(`reg_${userEmail}`, JSON.stringify(updated));
  };

  // Función para cancelar la inscripción
  const handleCancelarInscripcion = (id) => {
    const updated = registeredIds.filter(regId => regId !== id);
    setRegisteredIds(updated);
    localStorage.setItem(`reg_${userEmail}`, JSON.stringify(updated));
  };

  // Funciones exclusivas para el Administrador (Crear y Eliminar)
  const handleCreateActivity = (newActivity) => {
    const updated = [...activities, { ...newActivity, id: Date.now() }];
    setActivities(updated);
    localStorage.setItem('master_activities', JSON.stringify(updated));
  };

  const handleDeleteActivity = (id) => {
    const updated = activities.filter(act => act.id !== id);
    setActivities(updated);
    localStorage.setItem('master_activities', JSON.stringify(updated));
    if (selectedItem?.id === id) setSelectedItem(null); // Cierra el modal si el ítem abierto fue eliminado
  };

  // === 4. FILTRADO DE DATOS (FRONT-END) ===
  // Filtra las actividades basándose en la pestaña lateral seleccionada
  const itemsFiltrados = activities.filter(item => {
    if (activeTab === 'mis-actividades') return registeredIds.includes(item.id);
    if (activeTab === 'todos') return true;
    if (activeTab === 'talleres' && item.tipo === 'Workshop') return true;
    if (activeTab === 'torneos' && item.tipo === 'Tournament') return true;
    if (activeTab === 'eventos' && item.tipo === 'Event') return true;
    return false;
  });

  // Extrae el nombre del usuario quitando el "@ulima.edu.pe"
  const displayUserName = userEmail.split('@')[0];

  // === 5. ENRUTADOR DE VISTAS DINÁMICAS (WORKSPACE) ===
  const renderMainWorkspace = () => {
    if (currentTopTab === 'horario') {
      return (
        <div className="dynamic-workspace-panel animate-fade">
          <div className="panel-header-title">
            <h2>Mi Horario Semanal</h2>
            <p>Ciclo Activo 2026-I • Distribución de asignaturas curriculares</p>
          </div>
          <table className="schedule-data-table">
            <thead>
              <tr>
                <th>Hora</th><th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th>
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
            </tbody>
          </table>
        </div>
      );
    }

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
              <p>Solicitud formal para aplazar el periodo académico actual sin perder la vacante.</p>
              <button className="tramite-init-btn">Iniciar Trámite</button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'ajustes') {
      return (
        <div className="dynamic-workspace-panel settings-view-container animate-fade">
          <div className="panel-header-title">
            <h2>Ajustes de la Cuenta</h2>
            <p>Gestiona tus parámetros de seguridad y preferencias de la interfaz</p>
          </div>
          <div className="settings-options-card">
            <div className="settings-row-item logout-row">
              <div>
                <h4>Sesión de Estudiante</h4>
                <p>Salir de tu cuenta actual de forma segura en este dispositivo.</p>
              </div>
              <button className="settings-logout-btn" onClick={onLogout}>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Por defecto renderiza el Catálogo Principal (Main)
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

  // === 6. ESTRUCTURA VISUAL GENERAL ===
  return (
    <div className="dashboard-master-container">
      <TopNav 
        userName={displayUserName} 
        currentTopTab={currentTopTab}
        setTopTab={(tab) => {
          setTopTab(tab);
          if (tab !== 'inicio') setActiveTab('todos'); 
        }}
        notifications={[]} // Se envía limpio para simplificar
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