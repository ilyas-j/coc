import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store/store';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';

// Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';

// Importateur ET Exportateur
import DemandeForm from './components/importateur/DemandeForm';
import MesDemandesList from './components/importateur/MesDemandesList';

// Agent SEULEMENT
import DemandesAgent from './components/agent/DemandesAgent';
import TraiterDemande from './components/agent/TraiterDemande';

// 🎯 SUPERVISEUR COMPLET - Toutes les fonctionnalités
import SuperviseurVueEnsemble from './components/superviseur/SuperviseurVueEnsemble';
import DashboardSuperviseur from './components/superviseur/DashboardSuperviseur';
import GestionAgents from './components/superviseur/GestionAgents';
import SuperviseurTraitement from './components/superviseur/SuperviseurTraitement';
import SuperviseurStatistiques from './components/superviseur/SuperviseurStatistiques';
import TestSuperviseur from './components/superviseur/TestSuperviseur';

import { USER_TYPES } from './utils/constants';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes protégées */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header />
                    <Box sx={{ display: 'flex', flex: 1 }}>
                      <Sidebar />
                      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.100', p: 2 }}>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          
                          {/* ==========================================
                              ROUTES IMPORTATEUR ET EXPORTATEUR 
                              ========================================== */}
                          <Route 
                            path="/demande/nouvelle" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.IMPORTATEUR, USER_TYPES.EXPORTATEUR]}>
                                <DemandeForm />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/mes-demandes" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.IMPORTATEUR, USER_TYPES.EXPORTATEUR]}>
                                <MesDemandesList />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* ==========================================
                              ROUTES AGENT SEULEMENT 
                              ========================================== */}
                          <Route 
                            path="/agent/demandes" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.AGENT]}>
                                <DemandesAgent />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/agent/traiter/:id" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.AGENT]}>
                                <TraiterDemande />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* ==========================================
                              🎯 ROUTES SUPERVISEUR PRINCIPALES 
                              Vue d'ensemble + Réaffectation + Gestion
                              ========================================== */}
                          <Route 
                            path="/superviseur/vue-ensemble" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.SUPERVISEUR]}>
                                <SuperviseurVueEnsemble />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/superviseur/dashboard" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.SUPERVISEUR]}>
                                <DashboardSuperviseur />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/superviseur/agents" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.SUPERVISEUR]}>
                                <GestionAgents />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/superviseur/statistiques" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.SUPERVISEUR]}>
                                <SuperviseurStatistiques />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* ==========================================
                              ROUTES SUPERVISEUR - Traitement personnel
                              Le superviseur peut aussi traiter comme un agent
                              ========================================== */}
                          <Route 
                            path="/superviseur/traitement" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.SUPERVISEUR]}>
                                <SuperviseurTraitement />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/superviseur/traiter/:id" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.SUPERVISEUR]}>
                                <TraiterDemande />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* ==========================================
                              🧪 ROUTE DE TEST SUPERVISEUR (temporaire)
                              ========================================== */}
                          <Route 
                            path="/superviseur/test" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.SUPERVISEUR]}>
                                <TestSuperviseur />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Route par défaut */}
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </Box>
                    </Box>
                  </Box>
                </ProtectedRoute>
              } />
            </Routes>
            
            <ToastContainer />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;