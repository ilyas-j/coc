import api from './api';

export const superviseurService = {
  /**
   * 🎯 VUE D'ENSEMBLE - toutes les demandes du bureau (selon cahier des charges)
   */
  getVueEnsembleBureau: async () => {
    try {
      console.log('📤 Récupération vue ensemble bureau...');
      const response = await api.get('/superviseur/vue-ensemble');
      console.log('✅ Vue ensemble récupérée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur vue ensemble:', error);
      
      // Si l'API n'existe pas encore, afficher une erreur utilisateur
      throw error;
      
    }
  },

  /**
   * 👥 GESTION DES AGENTS du bureau
   */
  getAgentsBureau: async () => {
    try {
      console.log('📤 Récupération agents bureau...');
      const response = await api.get('/superviseur/agents');
      console.log('✅ Agents bureau récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération agents:', error);
      
      // Si l'API n'existe pas encore, afficher une erreur utilisateur
      throw error;
    }
  },

  /**
   * 🔄 RÉAFFECTATION - Réaffecter une demande à un autre agent (fonction clé superviseur)
   */
  reaffecterDemande: async (demandeId, agentId) => {
    try {
      console.log('📤 Réaffectation demande:', { demandeId, agentId });
      const response = await api.put(`/superviseur/demandes/${demandeId}/reaffecter/${agentId}`);
      console.log('✅ Demande réaffectée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur réaffectation:', error);
      
      // Si l'API n'existe pas encore, afficher une erreur utilisateur
      throw error;
      
      throw error;
    }
  },

  /**
   * 👤 GESTION AGENTS - Modifier la disponibilité d'un agent
   */
  modifierDisponibiliteAgent: async (agentId, disponible, enConge) => {
    try {
      console.log('📤 Modification disponibilité agent:', { agentId, disponible, enConge });
      const response = await api.put(`/superviseur/agents/${agentId}/disponibilite`, null, {
        params: { disponible, enConge }
      });
      console.log('✅ Disponibilité modifiée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur modification disponibilité:', error);
      
      // Si l'API n'existe pas encore, afficher une erreur utilisateur
      throw error;
      
      throw error;
    }
  },

  /**
   * 📊 STATISTIQUES du bureau
   */
  getStatistiquesBureau: async () => {
    try {
      console.log('📤 Récupération statistiques bureau...');
      const response = await api.get('/superviseur/statistiques');
      console.log('✅ Statistiques récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur statistiques:', error);
      
      // Si l'API n'existe pas encore, afficher une erreur utilisateur
      throw error;
      
      throw error;
    }
  },



  /**
   * 📊 TABLEAU DE BORD avec KPIs
   */
  getDashboardData: async () => {
    try {
      console.log('📤 Récupération dashboard superviseur...');
      const response = await api.get('/superviseur/dashboard');
      console.log('✅ Dashboard récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur dashboard superviseur:', error);
      
      // Si l'API n'existe pas encore, afficher une erreur utilisateur
      throw error;
      
      throw error;
    }
  },

  /**
   * 🔄 ACTIONS EN LOT
   */
  reaffecterDemandesEnLot: async (demandeIds, agentId) => {
    try {
      console.log('📤 Réaffectation en lot:', { demandeIds, agentId });
      const promises = demandeIds.map(demandeId => 
        superviseurService.reaffecterDemande(demandeId, agentId)
      );
      await Promise.all(promises);
      console.log('✅ Réaffectation en lot terminée');
      return { message: `${demandeIds.length} demandes réaffectées` };
    } catch (error) {
      console.error('❌ Erreur réaffectation en lot:', error);
      throw error;
    }
  },

  /**
   * 🎯 RÉAFFECTATION AUTOMATIQUE des demandes non affectées
   */
  reaffecterAutomatiquement: async () => {
    try {
      console.log('📤 Réaffectation automatique...');
      const response = await api.post('/superviseur/reaffectation-automatique');
      console.log('✅ Réaffectation automatique terminée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur réaffectation automatique:', error);
      
      // Si l'API n'existe pas encore, afficher une erreur utilisateur
      throw error;
      
      throw error;
    }
  }
};


// 🔧 Utilitaires pour tests et debugging
export const superviseurDebugUtils = {
  /**
   * Tester la connectivité avec le backend superviseur
   */
  testConnection: async () => {
    try {
      console.log('🔍 Test connexion superviseur...');
      const result = await superviseurService.getVueEnsembleBureau();
      console.log('✅ Connexion superviseur OK:', result?.length, 'demandes');
      return { success: true, demandes: result?.length || 0 };
    } catch (error) {
      console.error('❌ Test connexion superviseur échoué:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Effectuer un test complet des fonctions superviseur
   */
  runFullTest: async () => {
    console.log('🚀 Début test complet superviseur...');
    
    const results = {
      vueEnsemble: false,
      agents: false,
      reaffectation: false,
      statistiques: false
    };

    try {
      // Test vue d'ensemble
      const demandes = await superviseurService.getVueEnsembleBureau();
      results.vueEnsemble = Array.isArray(demandes);
      console.log('✅ Vue ensemble:', results.vueEnsemble);

      // Test agents
      const agents = await superviseurService.getAgentsBureau();
      results.agents = Array.isArray(agents);
      console.log('✅ Agents:', results.agents);

      // Test réaffectation (simulation)
      if (demandes.length > 0 && agents.length > 0) {
        await superviseurService.reaffecterDemande(demandes[0].id, agents[0].id);
        results.reaffectation = true;
        console.log('✅ Réaffectation:', results.reaffectation);
      }

      // Test statistiques
      const stats = await superviseurService.getStatistiquesBureau();
      results.statistiques = stats && typeof stats.totalDemandes === 'number';
      console.log('✅ Statistiques:', results.statistiques);

    } catch (error) {
      console.error('❌ Erreur durant les tests:', error);
    }

    const success = Object.values(results).every(r => r === true);
    console.log('🎯 Résultat test complet superviseur:', success ? 'SUCCÈS' : 'ÉCHEC', results);
    
    return { success, details: results };
  },

  /**
   * Vérifier les permissions superviseur
   */
  checkPermissions: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const hasSuperviserRole = user.typeUser === 'SUPERVISEUR';
    
    console.log('🔐 Vérification permissions superviseur:', {
      user: user.nom
    });
  }
};
