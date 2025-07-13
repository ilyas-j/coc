import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
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

// Importateur
import DemandeForm from './components/importateur/DemandeForm';
import MesDemandesList from './components/importateur/MesDemandesList';

// Agent
import DemandesAgent from './components/agent/DemandesAgent';

// Superviseur
import DashboardSuperviseur from './components/superviseur/DashboardSuperviseur';
import GestionAgents from './components/superviseur/GestionAgents';

// Exportateur
import DashboardExportateur from './components/exportateur/DashboardExportateur';
import DemandesExportateur from './components/exportateur/DemandesExportateur';
import PartenairesExportateur from './components/exportateur/PartenairesExportateur';

// Common
import ComingSoon from './components/common/ComingSoon';

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
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
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
                      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.100' }}>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          
                          {/* Routes Importateur et Exportateur - Mêmes fonctionnalités */}
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
                          
                          {/* Routes Agent */}
                          <Route 
                            path="/agent/demandes" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.AGENT, USER_TYPES.SUPERVISEUR]}>
                                <DemandesAgent />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Routes Superviseur */}
                          <Route 
                            path="/superviseur/dashboard" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.AGENT, USER_TYPES.SUPERVISEUR]}>
                                <DashboardSuperviseur />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/superviseur/agents" 
                            element={
                              <ProtectedRoute allowedRoles={[USER_TYPES.AGENT, USER_TYPES.SUPERVISEUR]}>
                                <GestionAgents />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Route 404 */}
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </Box>
                    </Box>
                  </Box>
                </ProtectedRoute>
              } />
            </Routes>
            
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;