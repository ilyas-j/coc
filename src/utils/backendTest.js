// src/utils/backendTest.js
import axios from 'axios';
import { API_BASE_URL } from './constants';

/**
 * Utilitaire pour tester la connexion avec le backend
 */
export const backendTest = {
  /**
   * Vérifier si le backend est accessible
   */
  checkBackendConnection: async () => {
    try {
      console.log('🔍 Test de connexion au backend...', API_BASE_URL);
      
      const response = await axios.get(`${API_BASE_URL}/auth/bureaux-controle`, {
        timeout: 5000
      });
      
      console.log('✅ Backend accessible:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Backend inaccessible:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        console.error('💡 Vérifiez que le backend Spring Boot est démarré sur le port 8080');
      }
      
      return { success: false, error: error.message };
    }
  },

  /**
   * Tester l'authentification
   */
  testAuth: async (credentials = { email: 'importateur@test.ma', password: 'password' }) => {
    try {
      console.log('🔐 Test d\'authentification...');
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        timeout: 5000
      });
      
      console.log('✅ Authentification réussie:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Échec authentification:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  },

  /**
   * Tester la création d'une demande
   */
  testCreateDemande: async (token) => {
    try {
      console.log('📝 Test création demande...');
      
      const demandeTest = {
        importateurNom: 'Test Import SARL',
        importateurEmail: 'test@import.ma',
        exportateurNom: 'Test Export Ltd',
        exportateurPays: 'France',
        marchandises: [{
          categorie: 'PRODUITS_INDUSTRIELS_ET_TECHNIQUES',
          quantite: 10,
          uniteQuantite: 'PIECE',
          valeurDh: 5000,
          nomProduit: 'Produit Test',
          fabricant: 'Fabricant Test',
          adresseFabricant: 'Adresse Test',
          paysOrigine: 'France'
        }]
      };
      
      const response = await axios.post(`${API_BASE_URL}/demandes`, demandeTest, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      
      console.log('✅ Demande créée:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Échec création demande:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  },

  /**
   * Test complet du workflow
   */
  runFullTest: async () => {
    console.log('🚀 Démarrage du test complet backend...');
    
    // 1. Test connexion
    const connectionTest = await backendTest.checkBackendConnection();
    if (!connectionTest.success) {
      return {
        success: false,
        step: 'connection',
        error: connectionTest.error,
        message: 'Impossible de se connecter au backend. Vérifiez que Spring Boot est démarré.'
      };
    }
    
    // 2. Test authentification
    const authTest = await backendTest.testAuth();
    if (!authTest.success) {
      return {
        success: false,
        step: 'authentication',
        error: authTest.error,
        message: 'Échec de l\'authentification. Vérifiez les utilisateurs de test.'
      };
    }
    
    // 3. Test création demande
    const demandeTest = await backendTest.testCreateDemande(authTest.data.token);
    if (!demandeTest.success) {
      return {
        success: false,
        step: 'demande',
        error: demandeTest.error,
        message: 'Échec de création de demande. Vérifiez l\'API des demandes.'
      };
    }
    
    console.log('🎉 Tous les tests backend sont passés avec succès !');
    return {
      success: true,
      message: 'Backend entièrement fonctionnel',
      details: {
        connection: connectionTest.data,
        auth: authTest.data,
        demande: demandeTest.data
      }
    };
  }
};

// Fonction pour diagnostiquer les problèmes courants
export const diagnosticBackend = {
  checkCommonIssues: () => {
    const issues = [];
    
    // Vérifier la configuration API
    if (!API_BASE_URL) {
      issues.push('API_BASE_URL n\'est pas définie dans constants.js');
    }
    
    if (API_BASE_URL === 'http://localhost:8080/api') {
      issues.push('Vérifiez que le backend Spring Boot est démarré sur le port 8080');
    }
    
    // Vérifier le token
    const token = localStorage.getItem('token');
    if (!token) {
      issues.push('Aucun token d\'authentification trouvé - vous devez vous connecter');
    }
    
    // Vérifier les données utilisateur
    const user = localStorage.getItem('user');
    if (!user) {
      issues.push('Aucune donnée utilisateur trouvée - vous devez vous connecter');
    }
    
    return issues;
  },
  
  printDiagnostic: () => {
    console.log('🔧 Diagnostic de la connexion backend:');
    console.log('📍 API URL:', API_BASE_URL);
    console.log('🔑 Token présent:', !!localStorage.getItem('token'));
    console.log('👤 Utilisateur connecté:', !!localStorage.getItem('user'));
    
    const issues = diagnosticBackend.checkCommonIssues();
    if (issues.length > 0) {
      console.log('⚠️  Problèmes détectés:');
      issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    } else {
      console.log('✅ Configuration semble correcte');
    }
  }
};

export default backendTest;