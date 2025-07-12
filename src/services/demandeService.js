import api from './api';

export const demandeService = {
  creerDemande: async (demandeData) => {
    const response = await api.post('/demandes', demandeData);
    return response.data;
  },

  getMesDemandesImportateur: async () => {
    const response = await api.get('/demandes/mes-demandes');
    return response.data;
  },

  getDemandesAgent: async () => {
    const response = await api.get('/demandes/agent');
    return response.data;
  },

  prendreEnCharge: async (demandeId) => {
    const response = await api.put(`/demandes/${demandeId}/prendre-en-charge`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/public/categories');
    return response.data;
  },

  getUnites: async () => {
    const response = await api.get('/public/unites');
    return response.data;
  }
};
