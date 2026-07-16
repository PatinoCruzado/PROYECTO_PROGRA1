// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper para configurar las cabeceras de forma dinámica (con Token de autorización si existe)
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Autenticación
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error en las credenciales');
    }
    return res.json(); // Retorna { token, email, role }
  },

  register: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al registrar el usuario');
    }
    return res.json();
  },

  // Actividades
  getActivities: async () => {
    const res = await fetch(`${API_URL}/activities`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener actividades');
    return res.json();
  },

  createActivity: async (activity) => {
    const res = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(activity)
    });
    if (!res.ok) throw new Error('Error al publicar la actividad');
    return res.json();
  },

  deleteActivity: async (id) => {
    const res = await fetch(`${API_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Error al eliminar la actividad');
    return res.json();
  },

  // Inscripciones
  getRegistrations: async () => {
    const res = await fetch(`${API_URL}/registrations`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener tus inscripciones');
    return res.json(); // Debe retornar un array de IDs registrados: [1, 4]
  },

  registerToActivity: async (activityId) => {
    const res = await fetch(`${API_URL}/registrations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ activityId })
    });
    if (!res.ok) throw new Error('Error al inscribirse');
    return res.json();
  },

  unregisterFromActivity: async (activityId) => {
    const res = await fetch(`${API_URL}/registrations/${activityId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Error al cancelar inscripción');
    return res.json();
  }
};