import React, { useState } from 'react';
import SideBar from './SideBar/SideBar';
import Main from './Main/Main';
import Modal from './Modal/Modal';
import { INITIAL_ITEMS } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard({ userEmail, onLogout, isAdmin }) {
  const [activeTab, setActiveTab] = useState('todos');
  const [selectedItem, setSelectedItem] = useState(null);

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('master_activities');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [registeredIds, setRegisteredIds] = useState(() => {
    const saved = localStorage.getItem(`reg_${userEmail}`);
    return saved ? JSON.parse(saved) : [];
  });

  const handleInscribirse = (id) => {
    const updated = [...registeredIds, id];
    setRegisteredIds(updated);
    localStorage.setItem(`reg_${userEmail}`, JSON.stringify(updated));
  };

  const handleCreateActivity = (newActivity) => {
    const updated = [...activities, { ...newActivity, id: Date.now() }];
    setActivities(updated);
    localStorage.setItem('master_activities', JSON.stringify(updated));
  };

  const handleDeleteActivity = (id) => {
    const updated = activities.filter(act => act.id !== id);
    setActivities(updated);
    localStorage.setItem('master_activities', JSON.stringify(updated));
    
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null);
    }
  };

  const itemsFiltrados = activities.filter(item => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'mis-registros') return registeredIds.includes(item.id);
    return item.tipo.toLowerCase() === activeTab.slice(0, -1);
  });

  return (
    <div className="dashboard-layout">
      <SideBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userEmail={userEmail} 
        onLogout={onLogout} 
        countInscritos={registeredIds.length} 
      />
      <Main 
        items={itemsFiltrados} 
        registeredIds={registeredIds} 
        onSelect={setSelectedItem} 
        onRegister={handleInscribirse} 
        activeTab={activeTab}
        isAdmin={isAdmin}
        onCreateActivity={handleCreateActivity}
        onDeleteActivity={handleDeleteActivity}
      />
      {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}