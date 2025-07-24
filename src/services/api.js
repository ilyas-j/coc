// src/services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes timeout
});

// Interceptor pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log des requêtes en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erreur dans la requête:', error);
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => {
    // Log des réponses réussies en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    // Gestion détaillée des erreurs
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const { status, data } = error.response;
      
      console.error(`❌ Erreur ${status}:`, data);
      
      switch (status) {
        case 401:
          // Token expiré ou invalide
          console.log('🔐 Token expiré, redirection vers login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          console.error('🚫 Accès interdit - permissions insuffisantes');
          break;
          
        case 404:
          console.error('📭 Ressource non trouvée');
          break;
          
        case 422:
          console.error('📋 Erreur de validation des données');
          break;
          
        case 500:
          console.error('🔧 Erreur interne du serveur');
          break;
          
        default:
          console.error(`❓ Erreur HTTP ${status}`);
      }
      
      // Créer un objet d'erreur standardisé
      const apiError = new Error(data?.message || `Erreur ${status}`);
      apiError.status = status;
      apiError.data = data;
      throw apiError;
      
    } else if (error.request) {
      // La requête a été faite mais pas de réponse reçue
      console.error('📡 Pas de réponse du serveur:', error.request);
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        const networkError = new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }
      
      if (error.code === 'ECONNABORTED') {
        const timeoutError = new Error('La requête a pris trop de temps. Vérifiez votre connexion.');
        timeoutError.code = 'TIMEOUT_ERROR';
        throw timeoutError;
      }
      
      throw new Error('Erreur de réseau - impossible de contacter le serveur');
      
    } else {
      // Erreur dans la configuration de la requête
      console.error('⚙️ Erreur de configuration:', error.message);
      throw new Error('Erreur de configuration de la requête');
    }
  }
);

// Utilitaires pour les types de requêtes courantes
export const apiUtils = {
  /**
   * Test de connectivité avec le backend
   */
  healthCheck: async () => {
    try {
      const response = await api.get('/auth/bureaux-controle');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Upload de fichier avec progress
   */
  uploadFile: async (endpoint, formData, onProgress = null) => {
    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      throw error;
    }
  },

  /**
   * Requête GET avec cache simple
   */
  getCached: async (url, cacheTimeMs = 300000) => { // 5 minutes par défaut
    const cacheKey = `api_cache_${url}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTimeMs) {
        console.log(`💾 Cache hit pour ${url}`);
        return data;
      }
    }
    
    try {
      const response = await api.get(url);
      localStorage.setItem(cacheKey, JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      }));
      return response.data;
    } catch (error) {
      console.error('❌ Erreur requête cachée:', error);
      throw error;
    }
  },

  /**
   * Nettoyer le cache
   */
  clearCache: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('api_cache_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('🧹 Cache API nettoyé');
  }
};

// Configuration pour différents environnements
export const apiConfig = {
  development: {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    logRequests: true,
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://votre-api.com/api',
    timeout: 30000,
    logRequests: false,
  },
  test: {
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
    logRequests: false,
  }
};

// Fonction pour reconfigurer l'API selon l'environnement
export const configureApi = (environment = process.env.NODE_ENV) => {
  const config = apiConfig[environment] || apiConfig.development;
  
  api.defaults.baseURL = config.baseURL;
  api.defaults.timeout = config.timeout;
  
  console.log(`🔧 API configurée pour l'environnement: ${environment}`);
  console.log(`📍 Base URL: ${config.baseURL}`);
};

// Auto-configuration au chargement
configureApi();

export default api;