import React, { useState, useEffect } from 'react';
import TopNav from './TopNav/TopNav'; 
import SideBar from './SideBar/SideBar';
import Main from './Main/Main';
import Modal from './Modal/Modal';
import { api } from '../services/api';
import './Dashboard.css';

export default function Dashboard({ userEmail = "estudiante@ulima.edu.pe", onLogout, isAdmin = false }) {
  
  // === 1. ESTADOS DE LA INTERFAZ ===
  const [currentTopTab, setTopTab] = useState('inicio'); 
  const [activeTab, setActiveTab] = useState('todos');   
  const [selectedItem, setSelectedItem] = useState(null); 

  // === 2. ESTADOS DE DATOS DINÁMICOS ===
  const [activities, setActivities] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // === 3. EFECTO DE CARGA DE DATOS (USEEFFECT + ASYNC/AWAIT) ===
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Cargar todas las actividades desde la API
        const fetchedActivities = await api.getActivities();
        setActivities(fetchedActivities);

        // Si es estudiante, cargar sus inscripciones reales
        if (!isAdmin) {
          const fetchedRegs = await api.getRegistrations();
          setRegisteredIds(fetchedRegs);
        }
      } catch (error) {
        console.error("Error al cargar los datos de la API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  // === 4. CONTROLADORES Y FUNCIONES OPERATIVAS (CONEXIÓN API) ===
  
  const handleInscribirse = async (id) => {
    if (registeredIds.includes(id)) return;
    try {
      await api.registerToActivity(id);
      setRegisteredIds(prev => [...prev, id]);
    } catch (error) {
      alert("❌ No se pudo completar tu inscripción en el servidor.");
    }
  };

  const handleCancelarInscripcion = async (id) => {
    try {
      await api.unregisterFromActivity(id);
      setRegisteredIds(prev => prev.filter(regId => regId !== id));
    } catch (error) {
      alert("❌ Error al cancelar la inscripción.");
    }
  };

  const handleCreateActivity = async (newActivity) => {
    try {
      // Mandamos el objeto de la actividad al Back-End
      const createdActivity = await api.createActivity(newActivity);
      // El backend retorna la actividad con su ID único generado por PostgreSQL
      setActivities(prev => [...prev, createdActivity]);
    } catch (error) {
      alert("❌ Error al publicar la actividad en el servidor.");
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await api.deleteActivity(id);
      setActivities(prev => prev.filter(act => act.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null); 
    } catch (error) {
      alert("❌ Error al eliminar la actividad del servidor.");
    }
  };

  // === 5. FILTRADO DE DATOS ===
  const itemsFiltrados = activities.filter(item => {
    if (activeTab === 'mis-actividades') return registeredIds.includes(item.id);
    if (activeTab === 'todos') return true;
    if (activeTab === 'talleres' && item.tipo === 'Workshop') return true;
    if (activeTab === 'torneos' && item.tipo === 'Tournament') return true;
    if (activeTab === 'eventos' && item.tipo === 'Event') return true;
    return false;
  });

  const displayUserName = userEmail.split('@')[0];

  // === 6. ENRUTADOR DE VISTAS DINÁMICAS ===
  const renderMainWorkspace = () => {
    if (loading) {
      return (
        <div className="dynamic-workspace-panel animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <h3>Cargando información desde la base de datos...</h3>
        </div>
      );
    }

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
        notifications={[]} 
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