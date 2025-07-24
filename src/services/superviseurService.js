// src/services/superviseurService.js
import api from './api';

export const superviseurService = {
  /**
   * Récupérer toutes les demandes du bureau
   */
  getDemandesBureau: async () => {
    try {
      const response = await api.get('/superviseur/demandes');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération demandes bureau:', error);
      throw error;
    }
  },

  /**
   * Récupérer tous les agents du bureau
   */
  getAgentsBureau: async () => {
    try {
      const response = await api.get('/superviseur/agents');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération agents:', error);
      throw error;
    }
  },

  /**
   * Réaffecter une demande à un autre agent
   */
  reaffecterDemande: async (demandeId, agentId) => {
    try {
      const response = await api.put(`/superviseur/demandes/${demandeId}/reaffecter/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur réaffectation:', error);
      throw error;
    }
  }
};

export default superviseurService;