// src/services/authService.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      // Fallback pour les tests sans backend
      if (credentials.email === 'importateur@test.ma' && credentials.password === 'password') {
        const userData = {
          id: 1,
          email: 'importateur@test.ma',
          nom: 'Importateur Test',
          typeUser: 'IMPORTATEUR',
          token: 'fake-jwt-token'
        };
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else if (credentials.email === 'exportateur@test.com' && credentials.password === 'password') {
        const userData = {
          id: 4,
          email: 'exportateur@test.com',
          nom: 'Exportateur France',
          typeUser: 'EXPORTATEUR',
          token: 'fake-jwt-token'
        };
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else if (credentials.email === 'exportateur2@test.de' && credentials.password === 'password') {
        const userData = {
          id: 5,
          email: 'exportateur2@test.de',
          nom: 'Exportateur Allemagne',
          typeUser: 'EXPORTATEUR',
          token: 'fake-jwt-token'
        };
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else if (credentials.email === 'agent1@tuv.ma' && credentials.password === 'password') {
        const userData = {
          id: 2,
          email: 'agent1@tuv.ma',
          nom: 'Agent TUV',
          typeUser: 'AGENT',
          token: 'fake-jwt-token'
        };
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else if (credentials.email === 'superviseur@tuv.ma' && credentials.password === 'password') {
        const userData = {
          id: 3,
          email: 'superviseur@tuv.ma',
          nom: 'Superviseur TUV',
          typeUser: 'SUPERVISEUR',
          token: 'fake-jwt-token'
        };
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      
      throw new Error(error.response?.data?.message || 'Email ou mot de passe incorrect');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const registerService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      
      // Simuler l'inscription en mode développement
      if (!error.response) {
        // Simuler un délai de création
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simuler une validation
        if (userData.email && userData.password && userData.nom && userData.typeUser) {
          // Vérifier si l'email existe déjà (simulation)
          const existingEmails = [
            'importateur@test.ma',
            'agent1@tuv.ma', 
            'superviseur@tuv.ma',
            'exportateur@test.com',
            'exportateur2@test.de'
          ];
          
          if (existingEmails.includes(userData.email)) {
            throw new Error('Cet email est déjà utilisé');
          }
          
          return { message: 'Compte créé avec succès' };
        } else {
          throw new Error('Données manquantes');
        }
      }
      
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  },

  getBureauxControle: async () => {
    try {
      const response = await api.get('/auth/bureaux-controle');
      return response.data;
    } catch (error) {
      console.error('Erreur bureaux contrôle:', error);
      // Fallback avec données statiques
      return [
        { id: 1, nom: 'TUV' },
        { id: 2, nom: 'ECF' },
        { id: 3, nom: 'AFNOR' },
        { id: 4, nom: 'ICUM' },
        { id: 5, nom: 'SGS' },
      ];
    }
  },

  getPays: async () => {
    try {
      const response = await api.get('/auth/pays');
      return response.data;
    } catch (error) {
      console.error('Erreur pays:', error);
      // Fallback avec données statiques pour exportateurs
      return [
        'France',
        'Allemagne', 
        'Italie',
        'Espagne',
        'Royaume-Uni',
        'Belgique',
        'Pays-Bas',
        'Suisse',
        'Portugal',
        'Turquie',
        'Chine',
        'Inde',
        'États-Unis',
        'Canada',
        'Brésil',
        'Autre'
      ];
    }
  }
};