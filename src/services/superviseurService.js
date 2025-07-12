import api from './api';

export const superviseurService = {
  getDemandesBureau: async () => {
    const response = await api.get('/superviseur/demandes');
    return response.data;
  },

  getAgentsBureau: async () => {
    const response = await api.get('/superviseur/agents');
    return response.data;
  },

  reaffecterDemande: async (demandeId, agentId) => {
    const response = await api.put(`/superviseur/demandes/${demandeId}/reaffecter/${agentId}`);
    return response.data;
  }
};

// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import demandeSlice from './slices/demandeSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    demandes: demandeSlice,
    ui: uiSlice,
  },
});