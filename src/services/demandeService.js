import api from './api';

export const demandeService = {
  /**
   * Créer une nouvelle demande COC
   */
  creerDemande: async (demandeData) => {
    try {
      const response = await api.post('/demandes', demandeData);
      return response.data;
    } catch (error) {
      console.error('Erreur création demande:', error);
      throw error;
    }
  },

  /**
   * Récupérer mes demandes (pour importateur ET exportateur)
   */
  getMesDemandesUtilisateur: async () => {
    try {
      const response = await api.get('/demandes/mes-demandes');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération demandes:', error);
      throw error;
    }
  },

  /**
   * Récupérer les demandes affectées à l'agent
   */
  getDemandesAgent: async () => {
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
      console.error('Erreur finalisation:', error);
      throw error;
    }
  },

  /**
   * Upload de documents
   */
  uploadDocument: async (file, type, demandeId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('demandeId', demandeId);
      
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur upload document:', error);
      throw error;
    }
  }
};

export default demandeService;