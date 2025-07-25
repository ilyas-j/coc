import api from './api';

export const demandeService = {
  /**
   * Créer une nouvelle demande COC
   */
  creerDemande: async (demandeData) => {
    try {
      console.log('📤 Envoi demande:', demandeData);
      const response = await api.post('/demandes', demandeData);
      console.log('✅ Demande créée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur création demande:', error);
      throw error;
    }
  },

  /**
   * Récupérer mes demandes (pour importateur ET exportateur)
   */
  getMesDemandesUtilisateur: async () => {
    try {
      console.log('📤 Récupération des demandes utilisateur...');
      const response = await api.get('/demandes/mes-demandes');
      console.log('✅ Demandes récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération demandes:', error);
      
      // Si c'est une erreur 404, retourner un tableau vide plutôt que de lancer l'erreur
      if (error.status === 404) {
        console.log('ℹ️ Aucune demande trouvée, retour d\'un tableau vide');
        return [];
      }
      
      throw error;
    }
  },

  /**
   * Récupérer les demandes affectées à l'agent
   */
  getDemandesAgent: async () => {
    try {
      console.log('📤 Récupération des demandes agent...');
      const response = await api.get('/agent/demandes');
      console.log('✅ Demandes agent récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération demandes agent:', error);
      
      if (error.status === 404) {
        return [];
      }
      
      throw error;
    }
  },

  /**
   * Prendre en charge une demande
   */
  prendreEnCharge: async (demandeId) => {
    try {
      console.log('📤 Prise en charge demande:', demandeId);
      const response = await api.put(`/agent/demandes/${demandeId}/prendre-en-charge`);
      console.log('✅ Demande prise en charge:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur prise en charge:', error);
      throw error;
    }
  },

  /**
   * Donner un avis sur une marchandise
   */
  donnerAvisMarchandise: async (avisData) => {
    try {
      console.log('📤 Envoi avis marchandise:', avisData);
      const response = await api.post('/agent/avis-marchandise', avisData);
      console.log('✅ Avis marchandise enregistré');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur avis marchandise:', error);
      throw error;
    }
  },

  /**
   * Finaliser un dossier
   */
  finaliserDossier: async (demandeId) => {
    try {
      console.log('📤 Finalisation dossier:', demandeId);
      const response = await api.put(`/agent/demandes/${demandeId}/finaliser`);
      console.log('✅ Dossier finalisé:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur finalisation:', error);
      throw error;
    }
  },

  /**
   * Upload de documents
   */
  uploadDocument: async (file, type, demandeId) => {
    try {
      console.log('📤 Upload document:', { fileName: file.name, type, demandeId });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('demandeId', demandeId);
      
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Document uploadé:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur upload document:', error);
      throw error;
    }
  },

  /**
   * Test de connectivité (pour debugging)
   */
  testConnection: async () => {
    try {
      console.log('🔍 Test de connexion backend...');
      const response = await api.get('/auth/bureaux-controle');
      console.log('✅ Backend accessible:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Backend inaccessible:', error);
      return { success: false, error: error.message };
    }
  }
};

export default demandeService;