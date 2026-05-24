import React, { useState } from 'react';
import SideBar from './SideBar/SideBar';
import Main from './Main/Main';
import Modal from './Modal/Modal';
import { INITIAL_ITEMS } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard({ userEmail, onLogout }) {
  const [activeTab, setActiveTab] = useState('todos');
  const [selectedItem, setSelectedItem] = useState(null);
  const [registeredIds, setRegisteredIds] = useState(() => {
    const saved = localStorage.getItem(`reg_${userEmail}`);
    return saved ? JSON.parse(saved) : [];
  });

  const handleInscribirse = (id) => {
    const updated = [...registeredIds, id];
    setRegisteredIds(updated);
    localStorage.setItem(`reg_${userEmail}`, JSON.stringify(updated));
  };

  const itemsFiltrados = INITIAL_ITEMS.filter(item => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'mis-registros') return registeredIds.includes(item.id);
    return item.tipo.toLowerCase() === activeTab.slice(0, -1);
  });

  return (
    <div className="dashboard-layout">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} userEmail={userEmail} onLogout={onLogout} countInscritos={registeredIds.length} />
      <Main items={itemsFiltrados} registeredIds={registeredIds} onSelect={setSelectedItem} onRegister={handleInscribirse} activeTab={activeTab} />
      {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}