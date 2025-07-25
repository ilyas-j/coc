export const API_BASE_URL = 'http://localhost:8080/api';

export const USER_TYPES = {
  IMPORTATEUR: 'IMPORTATEUR',
  EXPORTATEUR: 'EXPORTATEUR',
  AGENT: 'AGENT',
  SUPERVISEUR: 'SUPERVISEUR'
};

export const STATUS_DEMANDE = {
  DEPOSE: 'DEPOSE',
  EN_COURS_DE_TRAITEMENT: 'EN_COURS_DE_TRAITEMENT',
  CLOTURE: 'CLOTURE'
};

// Catégories exactes selon le cahier des charges
export const CATEGORIES_MARCHANDISE = [
    'PRODUITS_INDUSTRIELS_ET_TECHNIQUES',
    'VEHICULES_ET_PIECES_DETACHEES',
    'EQUIPEMENTS_ECLAIRAGE',
    'JOUETS_ET_ARTICLES_ENFANTS',
    'MATERIEL_ELECTRIQUE_ET_CABLAGE',
    'MEUBLES_ET_ARTICLES_BOIS',
    'PRODUITS_AGROALIMENTAIRES',
    'PRODUITS_PHARMACEUTIQUES_ET_COSMETIQUES',
    'TEXTILE_ET_HABILLEMENT',
    'EQUIPEMENTS_INFORMATIQUES_ET_TELECOMMUNICATION',
    'PRODUITS_CHIMIQUES',
    'EMBALLAGES_ET_PRODUITS_PLASTIQUE',
    'PRODUITS_PETROLIERS_ET_LUBRIFIANTS',
    'PRODUITS_CULTURELS_ET_EDUCATIFS',
    'PRODUITS_AGRICOLES_ANIMAUX_VIVANTS'
];

// ✅ CORRECTION: Unités exactement synchronisées avec l'enum Java
// Utiliser les noms d'affichage (displayName) de l'enum Java
export const UNITES_QUANTITE = [
  'pièce',    // → PIECE
  'kg',       // → KG  
  'tonne',    // → TONNE
  'litre',    // → LITRE
  'm²',       // → M2
  'm³',       // → M3
  'carton',   // → CARTON
  'palette'   // → PALETTE
];

// Mapping pour l'affichage avec les labels français
export const UNITES_QUANTITE_LABELS = {
  'pièce': 'Pièce(s)',
  'kg': 'Kilogramme(s)',
  'tonne': 'Tonne(s)',
  'litre': 'Litre(s)',
  'm²': 'Mètre carré(s)',
  'm³': 'Mètre cube(s)',
  'carton': 'Carton(s)',
  'palette': 'Palette(s)'
};

// Catégories nécessitant une fiche technique obligatoire
export const CATEGORIES_FICHE_TECHNIQUE_OBLIGATOIRE = [
  'PRODUITS_INDUSTRIELS_ET_TECHNIQUES',
  'EQUIPEMENTS_ECLAIRAGE',
  'JOUETS_ET_ARTICLES_ENFANTS',
  'VEHICULES_ET_PIECES_DETACHEES',
  'EQUIPEMENTS_INFORMATIQUES_ET_TELECOMMUNICATION'
];

export const BUREAUX_CONTROLE = ['TUV', 'ECF', 'AFNOR', 'ICUM', 'SGS'];

export const AVIS_MARCHANDISE = {
  CONFORME: 'CONFORME',
  NON_CONFORME: 'NON_CONFORME',
  CONFORME_AVEC_RESERVE: 'CONFORME_AVEC_RESERVE'
};

export const DECISION_GLOBALE = {
  CONFORME: 'CONFORME',
  NON_CONFORME: 'NON_CONFORME',
  CONFORME_AVEC_RESERVE: 'CONFORME_AVEC_RESERVE'
};

// Types de documents
export const TYPES_DOCUMENTS = {
  FACTURE: 'FACTURE',
  FICHE_TECHNIQUE: 'FICHE_TECHNIQUE'
};

// Extensions de fichiers autorisées
export const EXTENSIONS_AUTORISEES = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];

// Taille max des fichiers (en MB)
export const TAILLE_MAX_FICHIER = 10;