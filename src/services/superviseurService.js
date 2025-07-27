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
   * 👤 TRAITEMENT PERSONNEL - demandes affectées au superviseur
   */
  getMesDemandesPersonnelles: async () => {
    try {
      console.log('📤 Récupération demandes personnelles superviseur...');
      const response = await api.get('/superviseur/mes-demandes-personnelles');
      console.log('✅ Demandes personnelles récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur demandes personnelles:', error);
      
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

// =====================================
// 📊 DONNÉES DE SIMULATION POUR DÉVELOPPEMENT
// =====================================

const simulateVueEnsemble = () => {
  console.log('🔄 Simulation vue d\'ensemble bureau...');
  return [
    {
      id: 1,
      numeroDemande: 'COC-2024-001234',
      dateCreation: '2024-12-20T10:30:00Z',
      dateAffectation: '2024-12-20T10:45:00Z',
      status: 'DEPOSE',
      importateurNom: 'Import Maroc SARL',
      exportateurNom: 'Export France Ltd',
      bureauControleNom: 'TUV',
      agentNom: 'Agent Dupont',
      agentId: 1,
      marchandises: [
        { id: 1, nomProduit: 'Lampe LED', valeurDh: 15000 },
        { id: 2, nomProduit: 'Interrupteur', valeurDh: 5000 }
      ],
      decisionGlobale: null,
      delaiEstime: '2 jours'
    },
    {
      id: 2,
      numeroDemande: 'COC-2024-001235',
      dateCreation: '2024-12-20T14:20:00Z',
      dateAffectation: '2024-12-20T14:30:00Z',
      status: 'EN_COURS_DE_TRAITEMENT',
      importateurNom: 'Global Import SA',
      exportateurNom: 'Tech Export GmbH',
      bureauControleNom: 'TUV',
      agentNom: 'Agent Martin',
      agentId: 2,
      marchandises: [
        { id: 3, nomProduit: 'Smartphone', valeurDh: 25000 }
      ],
      decisionGlobale: null,
      delaiEstime: '1 jour'
    },
    {
      id: 3,
      numeroDemande: 'COC-2024-001236',
      dateCreation: '2024-12-19T09:15:00Z',
      dateAffectation: '2024-12-19T09:30:00Z',
      status: 'CLOTURE',
      importateurNom: 'Commerce International',
      exportateurNom: 'Euro Exports',
      bureauControleNom: 'TUV',
      agentNom: 'Agent Rousseau',
      agentId: 3,
      marchandises: [
        { id: 4, nomProduit: 'Équipement médical', valeurDh: 50000 }
      ],
      decisionGlobale: 'CONFORME',
      delaiEstime: '3 jours'
    },
    {
      id: 4,
      numeroDemande: 'COC-2024-001237',
      dateCreation: '2024-12-21T08:00:00Z',
      dateAffectation: null,
      status: 'DEPOSE',
      importateurNom: 'Nouveau Import',
      exportateurNom: 'Express Export',
      bureauControleNom: 'TUV',
      agentNom: null, // ⚠️ Demande non affectée - URGENT
      agentId: null,
      marchandises: [
        { id: 5, nomProduit: 'Jouet en plastique', valeurDh: 8000 }
      ],
      decisionGlobale: null,
      delaiEstime: '2 jours'
    },
    {
      id: 5,
      numeroDemande: 'COC-2024-001238',
      dateCreation: '2024-12-21T09:30:00Z',
      dateAffectation: null,
      status: 'DEPOSE',
      importateurNom: 'Import Urgent SARL',
      exportateurNom: 'Fast Export Ltd',
      bureauControleNom: 'TUV',
      agentNom: null, // ⚠️ Demande non affectée - URGENT
      agentId: null,
      marchandises: [
        { id: 6, nomProduit: 'Câble électrique', valeurDh: 12000 },
        { id: 7, nomProduit: 'Prise murale', valeurDh: 3000 }
      ],
      decisionGlobale: null,
      delaiEstime: '2 jours'
    }
  ];
};

const simulateAgentsBureau = () => {
  console.log('🔄 Simulation agents bureau...');
  return [
    {
      id: 1,
      nom: 'Agent Dupont',
      email: 'dupont@tuv.ma',
      telephone: '+212666123456',
      disponible: true,
      enConge: false,
      chargeTravail: 3,
      demandesTraitees: 45,
      tauxConformite: 92,
      superviseur: false
    },
    {
      id: 2,
      nom: 'Agent Martin',
      email: 'martin@tuv.ma',
      telephone: '+212666234567',
      disponible: true,
      enConge: false,
      chargeTravail: 5,
      demandesTraitees: 38,
      tauxConformite: 88,
      superviseur: false
    },
    {
      id: 3,
      nom: 'Agent Rousseau',
      email: 'rousseau@tuv.ma',
      telephone: '+212666345678',
      disponible: false,
      enConge: true, // ⚠️ Agent en congé
      chargeTravail: 0,
      demandesTraitees: 52,
      tauxConformite: 95,
      superviseur: false
    },
    {
      id: 4,
      nom: 'Agent Bernard',
      email: 'bernard@tuv.ma',
      telephone: '+212666456789',
      disponible: true,
      enConge: false,
      chargeTravail: 2,
      demandesTraitees: 30,
      tauxConformite: 90,
      superviseur: false
    },
    {
      id: 5,
      nom: 'Agent Moreau',
      email: 'moreau@tuv.ma',
      telephone: '+212666567890',
      disponible: false, // ⚠️ Agent indisponible
      enConge: false,
      chargeTravail: 0,
      demandesTraitees: 28,
      tauxConformite: 87,
      superviseur: false
    }
  ];
};

const simulateStatistiques = () => {
  console.log('🔄 Simulation statistiques bureau...');
  return {
    totalDemandes: 150,
    demandesDeposees: 28, // Incluant les 2 non affectées
    demandesEnCours: 45,
    demandesCloses: 77,
    agentsDisponibles: 3,
    agentsEnConge: 1,
    chargeGlobale: 10,
    tempsTraitementMoyen: 2.3,
    tauxConformite: 89
  };
};

const simulateDemandesPersonnelles = () => {
  console.log('🔄 Simulation demandes personnelles superviseur...');
  return [
    {
      id: 6,
      numeroDemande: 'COC-2024-001239',
      dateCreation: '2024-12-21T11:00:00Z',
      dateAffectation: '2024-12-21T11:15:00Z',
      status: 'DEPOSE',
      importateurNom: 'Import Spécialisé',
      exportateurNom: 'Spécial Export',
      marchandises: [
        { id: 8, nomProduit: 'Équipement complexe', valeurDh: 75000 }
      ],
      decisionGlobale: null,
      delaiEstime: '3 jours'
    }
  ];
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
