import api from './api';
import AffectationService from './affectationService';
import { STATUS_DEMANDE } from '../utils/constants';

/**
 * Service complet pour la gestion des demandes COC
 * Intègre le workflow automatique selon le cahier des charges
 */
export const demandeServiceComplete = {
  
  /**
   * Créer une nouvelle demande avec affectation automatique
   */
  creerDemande: async (demandeData) => {
    
      const response = await api.post('/demandes', demandeData);
      return response.data;
   
  },

  getMesDemandesImportateur: async () => {
    
      const response = await api.get('/demandes/mes-demandes');
      return response.data;
    
  },

  /**
   * Prendre en charge une demande (change le statut)
   */
  prendreEnCharge: async (demandeId) => {
    
      const response = await api.put(`/demandes/${demandeId}/prendre-en-charge`);
      return response.data;
    
  },

  /**
   * Donner un avis sur une marchandise
   */
  donnerAvisMarchandise: async (avisData) => {
    
      const response = await api.post('/agent/avis-marchandise', avisData);
      return response.data;
    
  },

  /**
   * Finaliser un dossier avec calcul de la décision globale
   */
  finaliserDossier: async (demandeId, avisMarchandises) => {
    
      // Calcul automatique de la décision globale
      const avisValues = avisMarchandises.map(avis => avis.avis);
      const decisionGlobale = AffectationService.calculerDecisionGlobale(avisValues);
      
      const finalisationData = {
        demandeId,
        avisMarchandises,
        decisionGlobale,
        dateFinalisation: new Date().toISOString()
      };
      
      const response = await api.put(`/demandes/${demandeId}/finaliser`, finalisationData);
      return response.data;
    
  },

  /**
   * Récupérer les détails complets d'une demande
   */
  getDemandeDetails: async (demandeId) => {
    
      const response = await api.get(`/demandes/${demandeId}`);
      return response.data;
    
  },

  /**
   * Récupérer les catégories de marchandises
   */
  getCategories: async () => {
    
      const response = await api.get('/public/categories');
      return response.data;
    
  },

  /**
   * Récupérer les unités de quantité
   */
  getUnites: async () => {
    
      const response = await api.get('/public/unites');
      return response.data;
    
  },

  /**
   * Upload d'un document
   */
  uploadDocument: async (file, type, demandeId) => {
    
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
    
  },

  /**
   * Statistiques pour le dashboard
   */
  getStatistiques: async () => {
    
      const response = await api.get('/demandes/statistiques');
      return response.data;
   
  }
};

export default demandeServiceComplete;