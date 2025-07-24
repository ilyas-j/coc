// src/services/agentService.js
import api from './api';

export const agentService = {
  /**
   * Récupérer les demandes affectées à l'agent connecté
   */
  getDemandesAffectees: async () => {
    try {
      const response = await api.get('/agent/demandes');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération demandes agent:', error);
      throw error;
    }
  },

  /**
   * Prendre en charge une demande
   */
  prendreEnCharge: async (demandeId) => {
    try {
      const response = await api.put(`/agent/demandes/${demandeId}/prendre-en-charge`);
      return response.data;
    } catch (error) {
      console.error('Erreur prise en charge:', error);
      throw error;
    }
  },

  /**
   * Donner un avis sur une marchandise
   */
  donnerAvisMarchandise: async (avisData) => {
    try {
      const response = await api.post('/agent/avis-marchandise', avisData);
      return response.data;
    } catch (error) {
      console.error('Erreur avis marchandise:', error);
      throw error;
    }
  },

  /**
   * Finaliser un dossier
   */
  finaliserDossier: async (demandeId) => {
    try {
      const response = await api.put(`/agent/demandes/${demandeId}/finaliser`);
      return response.data;
    } catch (error) {
      console.error('Erreur finalisation dossier:', error);
      throw error;
    }
  },

  /**
   * Récupérer les détails d'une demande pour traitement
   */
  getDemandeDetails: async (demandeId) => {
    try {
      const response = await api.get(`/agent/demandes/${demandeId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération détails demande:', error);
      throw error;
    }
  }
};

export default agentService;