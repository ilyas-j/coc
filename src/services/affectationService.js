import { BUREAUX_CONTROLE, DECISION_GLOBALE, AVIS_MARCHANDISE } from '../utils/constants';

/**
 * Service pour gérer l'affectation automatique des demandes COC
 * Simule la logique backend selon le cahier des charges
 */
export class AffectationService {
  
  // Compteur pour l'algorithme cyclique des bureaux
  static compteurBureau = 0;
  
  /**
   * Affectation cyclique à un bureau de contrôle
   * Algorithme: TUV → ECF → AFNOR → ICUM → SGS → TUV...
   */
  static affecterBureauControle() {
    const bureau = BUREAUX_CONTROLE[this.compteurBureau % BUREAUX_CONTROLE.length];
    this.compteurBureau++;
    
    console.log(`[Affectation Bureau] Demande affectée au bureau: ${bureau}`);
    return bureau;
  }
  
  /**
   * Affectation à un agent selon disponibilité et charge de travail
   * Critères: disponible=true, enConge=false, charge minimale
   */
  static affecterAgent(bureauControle, agents = []) {
    // Données simulées des agents par bureau
    const agentsParBureau = {
      'TUV': [
        { id: 1, nom: 'Agent Dupont', disponible: true, enConge: false, chargeTravail: 2 },
        { id: 2, nom: 'Agent Martin', disponible: true, enConge: false, chargeTravail: 5 },
        { id: 3, nom: 'Agent Rousseau', disponible: false, enConge: true, chargeTravail: 0 }
      ],
      'ECF': [
        { id: 4, nom: 'Agent Dubois', disponible: true, enConge: false, chargeTravail: 1 },
        { id: 5, nom: 'Agent Bernard', disponible: true, enConge: false, chargeTravail: 3 }
      ],
      'AFNOR': [
        { id: 6, nom: 'Agent Moreau', disponible: true, enConge: false, chargeTravail: 4 },
        { id: 7, nom: 'Agent Petit', disponible: true, enConge: false, chargeTravail: 1 }
      ],
      'ICUM': [
        { id: 8, nom: 'Agent Robert', disponible: true, enConge: false, chargeTravail: 2 }
      ],
      'SGS': [
        { id: 9, nom: 'Agent Richard', disponible: true, enConge: false, chargeTravail: 3 },
        { id: 10, nom: 'Agent Simon', disponible: true, enConge: false, chargeTravail: 0 }
      ]
    };
    
    const agentsDuBureau = agentsParBureau[bureauControle] || [];
    
    // Filtrer les agents disponibles et non en congé
    const agentsDisponibles = agentsDuBureau.filter(agent => 
      agent.disponible && !agent.enConge
    );
    
    if (agentsDisponibles.length === 0) {
      console.warn(`[Affectation Agent] Aucun agent disponible dans le bureau ${bureauControle}`);
      return null;
    }
    
    // Trier par charge de travail croissante
    agentsDisponibles.sort((a, b) => a.chargeTravail - b.chargeTravail);
    
    const agentSelectionne = agentsDisponibles[0];
    
    // Incrémenter la charge de travail de l'agent sélectionné
    agentSelectionne.chargeTravail++;
    
    console.log(`[Affectation Agent] Agent sélectionné: ${agentSelectionne.nom} (charge: ${agentSelectionne.chargeTravail})`);
    
    return agentSelectionne;
  }
  
  /**
   * Calcul de la décision globale selon les règles du cahier des charges
   */
  static calculerDecisionGlobale(avisMarchandises) {
    if (!avisMarchandises || avisMarchandises.length === 0) {
      return null;
    }
    
    // Règle 1: Si au moins une marchandise est NON_CONFORME → Dossier NON_CONFORME
    const hasNonConforme = avisMarchandises.some(avis => 
      avis === AVIS_MARCHANDISE.NON_CONFORME
    );
    
    if (hasNonConforme) {
      console.log('[Décision Globale] NON_CONFORME - Au moins une marchandise non conforme');
      return DECISION_GLOBALE.NON_CONFORME;
    }
    
    // Règle 2: Sinon, si au moins une est CONFORME_AVEC_RESERVE → Dossier CONFORME_AVEC_RESERVE
    const hasConformeAvecReserve = avisMarchandises.some(avis => 
      avis === AVIS_MARCHANDISE.CONFORME_AVEC_RESERVE
    );
    
    if (hasConformeAvecReserve) {
      console.log('[Décision Globale] CONFORME_AVEC_RESERVE - Au moins une marchandise avec réserve');
      return DECISION_GLOBALE.CONFORME_AVEC_RESERVE;
    }
    
    // Règle 3: Sinon → Dossier CONFORME
    console.log('[Décision Globale] CONFORME - Toutes les marchandises conformes');
    return DECISION_GLOBALE.CONFORME;
  }
  
  /**
   * Processus complet d'affectation d'une nouvelle demande
   */
  static affecterNouvelleDemande(demande) {
    console.log(`[Affectation] Début du processus pour la demande ${demande.numeroDemande}`);
    
    // Étape 1: Affectation au bureau de contrôle
    const bureauControle = this.affecterBureauControle();
    
    // Étape 2: Affectation à un agent
    const agent = this.affecterAgent(bureauControle);
    
    if (!agent) {
      throw new Error(`Aucun agent disponible dans le bureau ${bureauControle}`);
    }
    
    // Retourner la demande enrichie
    const demandeAffectee = {
      ...demande,
      bureauControle,
      agentId: agent.id,
      agentNom: agent.nom,
      dateAffectation: new Date().toISOString(),
    };
    
    console.log(`[Affectation] Demande ${demande.numeroDemande} affectée à ${agent.nom} (${bureauControle})`);
    
    return demandeAffectee;
  }
  
  /**
   * Réaffectation d'une demande à un autre agent (fonction superviseur)
   */
  static reaffecterDemande(demandeId, nouvelAgentId, agents) {
    const nouvelAgent = agents.find(a => a.id === nouvelAgentId);
    
    if (!nouvelAgent) {
      throw new Error('Agent introuvable');
    }
    
    if (!nouvelAgent.disponible || nouvelAgent.enConge) {
      throw new Error('L\'agent sélectionné n\'est pas disponible');
    }
    
    console.log(`[Réaffectation] Demande ${demandeId} réaffectée à ${nouvelAgent.nom}`);
    
    return {
      agentId: nouvelAgent.id,
      agentNom: nouvelAgent.nom,
      dateReaffectation: new Date().toISOString(),
    };
  }
  
  /**
   * Validation des documents selon la catégorie
   */
  static validerDocumentsRequis(marchandises, documents) {
    const errors = [];
    
    // Facture toujours obligatoire
    if (!documents.facture) {
      errors.push('La facture est obligatoire');
    }
    
    // Fiche technique obligatoire pour certaines catégories
    const categoriesRequierantFicheTechnique = [
      'Produits industriels et techniques',
      'Équipements d\'éclairage',
      'Jouets et articles pour enfants',
      'Véhicules et pièces détachées',
      'Équipements informatiques et de télécommunication'
    ];
    
    const needsFicheTechnique = marchandises.some(m =>
      categoriesRequierantFicheTechnique.includes(m.categorie)
    );
    
    if (needsFicheTechnique && !documents.ficheTechnique) {
      errors.push('La fiche technique est obligatoire pour au moins une de vos catégories de marchandises');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Génération d'un numéro de demande unique
   */
  static genererNumeroDemande() {
    const date = new Date();
    const year = date.getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `COC-${year}-${timestamp}`;
  }
  
  /**
   * Statistiques d'affectation par bureau
   */
  static getStatistiquesAffectation() {
    // Données simulées
    return {
      totalDemandes: 156,
      repartitionBureaux: {
        'TUV': 32,
        'ECF': 31,
        'AFNOR': 30,
        'ICUM': 32,
        'SGS': 31
      },
      tempsTraitementMoyen: '2.5 jours',
      tauxConformiteGlobal: 87.5
    };
  }
  
  /**
   * Simulation du délai de traitement estimé
   */
  static estimerDelaiTraitement(bureauControle, nombreMarchandises) {
    // Facteurs de calcul simulés
    const delaiBase = 1; // 1 jour minimum
    const delaiParMarchandise = 0.5; // 0.5 jour par marchandise
    const facteurBureau = {
      'TUV': 1.0,
      'ECF': 1.1,
      'AFNOR': 0.9,
      'ICUM': 1.2,
      'SGS': 1.0
    };
    
    const delaiEstime = Math.ceil(
      (delaiBase + (nombreMarchandises * delaiParMarchandise)) * facteurBureau[bureauControle]
    );
    
    return Math.max(delaiEstime, 1); // Minimum 1 jour
  }
}

export default AffectationService;