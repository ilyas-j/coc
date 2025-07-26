import api from './api';

export const superviseurService = {
  /**
   * Vue d'ensemble - toutes les demandes du bureau (selon cahier des charges)
   */
  getVueEnsembleBureau: async () => {
    try {
      console.log('📤 Récupération vue ensemble bureau...');
      const response = await api.get('/superviseur/vue-ensemble');
      console.log('✅ Vue ensemble récupérée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur vue ensemble:', error);
      
      // Si l'API n'existe pas encore, simuler des données pour le développement
      if (error.status === 404 || error.code === 'NETWORK_ERROR') {
        console.log('⚠️ API non disponible, utilisation de données simulées');
        return simulateVueEnsemble();
      }
      
      throw error;
    }
  },

  /**
   * Gestion des agents du bureau
   */
  getAgentsBureau: async () => {
    try {
      console.log('📤 Récupération agents bureau...');
      const response = await api.get('/superviseur/agents');
      console.log('✅ Agents bureau récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération agents:', error);
      
      if (error.status === 404 || error.code === 'NETWORK_ERROR') {
        console.log('⚠️ API non disponible, utilisation de données simulées');
        return simulateAgentsBureau();
      }
      
      throw error;
    }
  },

  /**
   * Réaffecter une demande à un autre agent (fonction clé superviseur)
   */
  reaffecterDemande: async (demandeId, agentId) => {
    try {
      console.log('📤 Réaffectation demande:', { demandeId, agentId });
      const response = await api.put(`/superviseur/demandes/${demandeId}/reaffecter/${agentId}`);
      console.log('✅ Demande réaffectée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur réaffectation:', error);
      
      if (error.status === 404 || error.code === 'NETWORK_ERROR') {
        console.log('⚠️ API non disponible, simulation réaffectation');
        return { message: 'Demande réaffectée avec succès (simulation)' };
      }
      
      throw error;
    }
  },

  /**
   * Modifier la disponibilité d'un agent
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
      
      if (error.status === 404 || error.code === 'NETWORK_ERROR') {
        console.log('⚠️ API non disponible, simulation modification');
        return { message: 'Disponibilité agent modifiée (simulation)' };
      }
      
      throw error;
    }
  },

  /**
   * Statistiques du bureau
   */
  getStatistiquesBureau: async () => {
    try {
      console.log('📤 Récupération statistiques bureau...');
      const response = await api.get('/superviseur/statistiques');
      console.log('✅ Statistiques récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur statistiques:', error);
      
      if (error.status === 404 || error.code === 'NETWORK_ERROR') {
        return simulateStatistiques();
      }
      
      throw error;
    }
  },

  /**
   * Traitement personnel - demandes affectées au superviseur
   */
  getMesDemandesPersonnelles: async () => {
    try {
      console.log('📤 Récupération demandes personnelles superviseur...');
      const response = await api.get('/superviseur/mes-demandes-personnelles');
      console.log('✅ Demandes personnelles récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur demandes personnelles:', error);
      
      if (error.status === 404 || error.code === 'NETWORK_ERROR') {
        return simulateDemandesPersonnelles();
      }
      
      throw error;
    }
  },

  /**
   * Tableau de bord avec KPIs
   */
  getDashboardData: async () => {
    try {
      console.log('📤 Récupération dashboard superviseur...');
      const response = await api.get('/superviseur/dashboard');
      console.log('✅ Dashboard récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur dashboard superviseur:', error);
      
      if (error.status === 404 || error.code === 'NETWORK_ERROR') {
        // Combiner les données de simulation
        const [demandes, agents, stats] = await Promise.all([
          simulateVueEnsemble(),
          simulateAgentsBureau(),
          simulateStatistiques()
        ]);
        
        return {
          statistiques: stats,
          demandes: demandes,
          agents: agents
        };
      }
      
      throw error;
    }
  }
};

// =====================================
// DONNÉES DE SIMULATION POUR DÉVELOPPEMENT
// =====================================

const simulateVueEnsemble = () => {
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
      agentNom: null, // ⚠️ Demande non affectée
      agentId: null,
      marchandises: [
        { id: 5, nomProduit: 'Jouet en plastique', valeurDh: 8000 }
      ],
      decisionGlobale: null,
      delaiEstime: '2 jours'
    }
  ];
};

const simulateAgentsBureau = () => {
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
      tauxConformite: 92
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
      tauxConformite: 88
    },
    {
      id: 3,
      nom: 'Agent Rousseau',
      email: 'rousseau@tuv.ma',
      telephone: '+212666345678',
      disponible: false,
      enConge: true,
      chargeTravail: 0,
      demandesTraitees: 52,
      tauxConformite: 95
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
      tauxConformite: 90
    }
  ];
};

const simulateStatistiques = () => {
  return {
    totalDemandes: 150,
    demandesDeposees: 25,
    demandesEnCours: 45,
    demandesCloses: 80,
    agentsDisponibles: 3,
    agentsEnConge: 1,
    chargeGlobale: 10,
    tempsTraitementMoyen: 2.3,
    tauxConformite: 89
  };
};

const simulateDemandesPersonnelles = () => {
  return [
    {
      id: 5,
      numeroDemande: 'COC-2024-001238',
      dateCreation: '2024-12-21T11:00:00Z',
      dateAffectation: '2024-12-21T11:15:00Z',
      status: 'DEPOSE',
      importateurNom: 'Import Spécialisé',
      exportateurNom: 'Spécial Export',
      marchandises: [
        { id: 6, nomProduit: 'Équipement complexe', valeurDh: 75000 }
      ],
      decisionGlobale: null,
      delaiEstime: '3 jours'
    }
  ];
};

export default superviseurService;