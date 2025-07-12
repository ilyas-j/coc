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
    try {
      // Validation des documents requis
      const validationDocuments = AffectationService.validerDocumentsRequis(
        demandeData.marchandises, 
        demandeData.documents
      );
      
      if (!validationDocuments.isValid) {
        throw new Error(validationDocuments.errors.join(', '));
      }
      
      // Génération du numéro de demande
      const numeroDemande = AffectationService.genererNumeroDemande();
      
      // Préparation des données avec informations complètes
      const demandePrete = {
        ...demandeData,
        numeroDemande,
        dateCreation: new Date().toISOString(),
        status: STATUS_DEMANDE.DEPOSE,
      };
      
      // Affectation automatique bureau + agent
      const demandeAffectee = AffectationService.affecterNouvelleDemande(demandePrete);
      
      // Estimation du délai de traitement
      const delaiEstime = AffectationService.estimerDelaiTraitement(
        demandeAffectee.bureauControle,
        demandeAffectee.marchandises.length
      );
      
      const demandeComplete = {
        ...demandeAffectee,
        delaiEstime: `${delaiEstime} jour(s)`,
      };
      
      // Appel API (simulé en fallback)
      try {
        const response = await api.post('/demandes', demandeComplete);
        return response.data;
      } catch (error) {
        // Fallback mode développement
        console.log('[Mode Dev] Simulation création demande:', demandeComplete);
        
        // Simuler un délai
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
          ...demandeComplete,
          id: Date.now(),
          success: true,
          message: `Demande ${numeroDemande} créée et affectée au bureau ${demandeAffectee.bureauControle}`
        };
      }
      
    } catch (error) {
      console.error('Erreur création demande:', error);
      throw new Error(error.message || 'Erreur lors de la création de la demande');
    }
  },

  /**
   * Récupérer les demandes de l'importateur connecté
   */
  getMesDemandesImportateur: async () => {
    try {
      const response = await api.get('/demandes/mes-demandes');
      return response.data;
    } catch (error) {
      // Fallback avec données simulées
      console.log('[Mode Dev] Simulation récupération demandes importateur');
      
      return [
        {
          id: 1,
          numeroDemande: 'COC-2024-123456',
          dateCreation: '2024-12-15T10:30:00Z',
          status: STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT,
          bureauControle: 'TUV',
          agentNom: 'Agent Dupont',
          exportateurNom: 'Société Export France',
          marchandises: [
            { nomProduit: 'Lampe LED', categorie: 'Équipements d\'éclairage' },
            { nomProduit: 'Jouet Robot', categorie: 'Jouets et articles pour enfants' }
          ],
          delaiEstime: '2 jour(s)',
          decisionGlobale: null
        },
        {
          id: 2,
          numeroDemande: 'COC-2024-123455',
          dateCreation: '2024-12-14T14:20:00Z',
          status: STATUS_DEMANDE.CLOTURE,
          bureauControle: 'SGS',
          agentNom: 'Agent Martin',
          exportateurNom: 'Export International',
          marchandises: [
            { nomProduit: 'Textile coton', categorie: 'Textile et habillement' }
          ],
          delaiEstime: '1 jour(s)',
          decisionGlobale: 'CONFORME'
        }
      ];
    }
  },

  /**
   * Récupérer les demandes affectées à l'agent connecté
   */
  getDemandesAgent: async () => {
    try {
      const response = await api.get('/demandes/agent');
      return response.data;
    } catch (error) {
      // Fallback avec données simulées
      console.log('[Mode Dev] Simulation récupération demandes agent');
      
      return [
        {
          id: 1,
          numeroDemande: 'COC-2024-123456',
          dateCreation: '2024-12-15T10:30:00Z',
          dateAffectation: '2024-12-15T10:31:00Z',
          status: STATUS_DEMANDE.DEPOSE,
          importateurNom: 'Société Import Maroc',
          importateurEmail: 'import@societe.ma',
          exportateurNom: 'Société Export France',
          exportateurEmail: 'export@societe.fr',
          exportateurPays: 'France',
          marchandises: [
            {
              id: 1,
              nomProduit: 'Lampe LED',
              categorie: 'Équipements d\'éclairage',
              quantite: 100,
              uniteQuantite: 'pièce',
              valeurDh: 15000,
              fabricant: 'LightTech SA',
              adresseFabricant: '123 Rue de la Lumière, Lyon',
              paysOrigine: 'France',
              avis: null,
              commentaire: null
            },
            {
              id: 2,
              nomProduit: 'Jouet Robot',
              categorie: 'Jouets et articles pour enfants',
              quantite: 50,
              uniteQuantite: 'pièce',
              valeurDh: 8500,
              fabricant: 'ToyMaker Ltd',
              adresseFabricant: '456 Kids Street, Paris',
              paysOrigine: 'France',
              avis: null,
              commentaire: null
            }
          ],
          documents: {
            facture: { nom: 'facture_001.pdf', url: '/documents/facture_001.pdf' },
            ficheTechnique: { nom: 'fiche_technique.pdf', url: '/documents/fiche_technique.pdf' }
          },
          delaiEstime: '2 jour(s)'
        }
      ];
    }
  },

  /**
   * Prendre en charge une demande (change le statut)
   */
  prendreEnCharge: async (demandeId) => {
    try {
      const response = await api.put(`/demandes/${demandeId}/prendre-en-charge`);
      return response.data;
    } catch (error) {
      // Fallback simulation
      console.log(`[Mode Dev] Prise en charge demande ${demandeId}`);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        id: demandeId,
        status: STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT,
        datePriseEnCharge: new Date().toISOString(),
        message: 'Demande prise en charge avec succès'
      };
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
      // Fallback simulation
      console.log('[Mode Dev] Enregistrement avis marchandise:', avisData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        ...avisData,
        id: Date.now(),
        dateAvis: new Date().toISOString(),
        message: 'Avis enregistré avec succès'
      };
    }
  },

  /**
   * Finaliser un dossier avec calcul de la décision globale
   */
  finaliserDossier: async (demandeId, avisMarchandises) => {
    try {
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
    } catch (error) {
      // Fallback simulation
      console.log(`[Mode Dev] Finalisation dossier ${demandeId}:`, avisMarchandises);
      
      const avisValues = avisMarchandises.map(avis => avis.avis);
      const decisionGlobale = AffectationService.calculerDecisionGlobale(avisValues);
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return {
        id: demandeId,
        status: STATUS_DEMANDE.CLOTURE,
        decisionGlobale,
        dateFinalisation: new Date().toISOString(),
        message: `Dossier finalisé avec la décision: ${decisionGlobale}`
      };
    }
  },

  /**
   * Récupérer les détails complets d'une demande
   */
  getDemandeDetails: async (demandeId) => {
    try {
      const response = await api.get(`/demandes/${demandeId}`);
      return response.data;
    } catch (error) {
      // Fallback avec données simulées détaillées
      console.log(`[Mode Dev] Récupération détails demande ${demandeId}`);
      
      return {
        id: demandeId,
        numeroDemande: 'COC-2024-123456',
        dateCreation: '2024-12-15T10:30:00Z',
        status: STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT,
        bureauControle: 'TUV',
        agentId: 1,
        agentNom: 'Agent Dupont',
        
        // Informations importateur
        importateur: {
          nom: 'Société Import Maroc',
          email: 'import@societe.ma',
          telephone: '+212666123456',
          adresse: '123 Rue du Commerce, Casablanca',
          codeDouane: 'CD123456',
          ice: 'ICE123456789'
        },
        
        // Informations exportateur
        exportateur: {
          nom: 'Société Export France',
          email: 'export@societe.fr',
          telephone: '+33123456789',
          adresse: '456 Avenue Export, Lyon',
          pays: 'France',
          ifu: 'FR123456789'
        },
        
        // Marchandises détaillées
        marchandises: [
          {
            id: 1,
            nomProduit: 'Lampe LED',
            categorie: 'Équipements d\'éclairage',
            quantite: 100,
            uniteQuantite: 'pièce',
            valeurDh: 15000,
            fabricant: 'LightTech SA',
            adresseFabricant: '123 Rue de la Lumière, Lyon',
            paysOrigine: 'France',
            avis: null,
            commentaire: null,
            dateAvis: null
          },
          {
            id: 2,
            nomProduit: 'Jouet Robot',
            categorie: 'Jouets et articles pour enfants',
            quantite: 50,
            uniteQuantite: 'pièce',
            valeurDh: 8500,
            fabricant: 'ToyMaker Ltd',
            adresseFabricant: '456 Kids Street, Paris',
            paysOrigine: 'France',
            avis: null,
            commentaire: null,
            dateAvis: null
          }
        ],
        
        // Documents
        documents: {
          facture: { 
            nom: 'facture_001.pdf', 
            url: '/documents/facture_001.pdf',
            taille: '245 KB',
            dateUpload: '2024-12-15T10:25:00Z'
          },
          ficheTechnique: { 
            nom: 'fiche_technique.pdf', 
            url: '/documents/fiche_technique.pdf',
            taille: '1.2 MB',
            dateUpload: '2024-12-15T10:26:00Z'
          }
        },
        
        delaiEstime: '2 jour(s)',
        decisionGlobale: null,
        historique: [
          {
            date: '2024-12-15T10:30:00Z',
            action: 'Demande créée',
            utilisateur: 'Société Import Maroc',
            details: 'Demande COC soumise avec 2 marchandises'
          },
          {
            date: '2024-12-15T10:31:00Z',
            action: 'Affectation automatique',
            utilisateur: 'Système',
            details: 'Affectée au bureau TUV - Agent Dupont'
          }
        ]
      };
    }
  },

  /**
   * Récupérer les catégories de marchandises
   */
  getCategories: async () => {
    try {
      const response = await api.get('/public/categories');
      return response.data;
    } catch (error) {
      // Fallback avec les catégories du cahier des charges
      const { CATEGORIES_MARCHANDISE } = await import('../utils/constants');
      return CATEGORIES_MARCHANDISE;
    }
  },

  /**
   * Récupérer les unités de quantité
   */
  getUnites: async () => {
    try {
      const response = await api.get('/public/unites');
      return response.data;
    } catch (error) {
      // Fallback avec les unités du cahier des charges
      const { UNITES_QUANTITE } = await import('../utils/constants');
      return UNITES_QUANTITE;
    }
  },

  /**
   * Upload d'un document
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
      // Fallback simulation upload
      console.log(`[Mode Dev] Upload document ${file.name} pour demande ${demandeId}`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        nom: file.name,
        type: type,
        taille: `${(file.size / 1024).toFixed(0)} KB`,
        url: `/documents/${file.name}`,
        dateUpload: new Date().toISOString(),
        message: 'Document uploadé avec succès'
      };
    }
  },

  /**
   * Statistiques pour le dashboard
   */
  getStatistiques: async () => {
    try {
      const response = await api.get('/demandes/statistiques');
      return response.data;
    } catch (error) {
      // Fallback avec statistiques simulées
      return AffectationService.getStatistiquesAffectation();
    }
  }
};

export default demandeServiceComplete;