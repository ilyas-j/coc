import api from './api';

export const superviseurService = {
  /**
   * Récupérer toutes les données du dashboard superviseur
   */
  getDashboardData: async () => {
    try {
      const response = await api.get('/superviseur/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erreur dashboard superviseur:', error);
      throw error;
    }
  },

  /**
   * Vue d'ensemble - toutes les demandes du bureau
   */
  getVueEnsembleBureau: async () => {
    try {
      const response = await api.get('/superviseur/vue-ensemble');
      return response.data;
    } catch (error) {
      console.error('Erreur vue ensemble:', error);
      throw error;
    }
  },

  /**
   * Gestion des agents du bureau
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
  },

  /**
   * Modifier la disponibilité d'un agent
   */
  modifierDisponibiliteAgent: async (agentId, disponible, enConge) => {
    try {
      const response = await api.put(`/superviseur/agents/${agentId}/disponibilite`, null, {
        params: { disponible, enConge }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur modification disponibilité:', error);
      throw error;
    }
  },

  /**
   * Statistiques du bureau
   */
  getStatistiquesBureau: async () => {
    try {
      const response = await api.get('/superviseur/statistiques');
      return response.data;
    } catch (error) {
      console.error('Erreur statistiques:', error);
      throw error;
    }
  },

  /**
   * Traitement personnel - demandes affectées au superviseur
   */
  getMesDemandesPersonnelles: async () => {
    try {
      const response = await api.get('/superviseur/mes-demandes-personnelles');
      return response.data;
    } catch (error) {
      console.error('Erreur demandes personnelles:', error);
      throw error;
    }
  },

  /**
   * Actions en lot sur les demandes
   */
  actionsEnLot: async (action, demandeIds, parametres = {}) => {
    try {
      const response = await api.post('/superviseur/actions-lot', {
        action,
        demandeIds,
        parametres
      });
      return response.data;
    } catch (error) {
      console.error('Erreur actions en lot:', error);
      throw error;
    }
  }
};

export default superviseurService;