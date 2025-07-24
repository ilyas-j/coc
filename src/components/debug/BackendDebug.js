// src/components/debug/BackendDebug.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Error,
  Warning,
  Info,
  PlayArrow,
  Refresh,
} from '@mui/icons-material';
import { backendTest, diagnosticBackend } from '../../utils/backendTest';
import { API_BASE_URL } from '../../utils/constants';

const BackendDebug = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnostic, setDiagnostic] = useState([]);

  const runDiagnostic = () => {
    const issues = diagnosticBackend.checkCommonIssues();
    setDiagnostic(issues);
    diagnosticBackend.printDiagnostic();
  };

  const runFullTest = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      const results = await backendTest.runFullTest();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message,
        step: 'unknown'
      });
    } finally {
      setLoading(false);
    }
  };

  const runQuickConnectionTest = async () => {
    setLoading(true);
    try {
      const result = await backendTest.checkBackendConnection();
      setTestResults({
        success: result.success,
        step: 'connection',
        error: result.error,
        data: result.data,
        message: result.success ? 'Connexion backend OK' : 'Impossible de se connecter au backend'
      });
    } catch (error) {
      setTestResults({
        success: false,
        step: 'connection',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (success) => {
    return success ? <CheckCircle color="success" /> : <Error color="error" />;
  };

  const getAlertSeverity = (success) => {
    return success ? 'success' : 'error';
  };

  React.useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔧 Debug Connexion Backend
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Outils de diagnostic pour vérifier la connexion entre le frontend et le backend Spring Boot
      </Typography>

      {/* Configuration actuelle */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          📋 Configuration Actuelle
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><strong>URL Backend:</strong> {API_BASE_URL}</Typography>
            <Typography><strong>Token présent:</strong> 
              <Chip 
                label={localStorage.getItem('token') ? 'Oui' : 'Non'} 
                color={localStorage.getItem('token') ? 'success' : 'error'}
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
            <Typography><strong>Utilisateur connecté:</strong> 
              <Chip 
                label={localStorage.getItem('user') ? 'Oui' : 'Non'} 
                color={localStorage.getItem('user') ? 'success' : 'error'}
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Environnement:</strong> {process.env.NODE_ENV}</Typography>
            <Typography><strong>Port Frontend:</strong> {window.location.port || '3000'}</Typography>
            <Typography><strong>Port Backend attendu:</strong> 8080</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Diagnostic automatique */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            🔍 Diagnostic Automatique
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={runDiagnostic}
            size="small"
          >
            Actualiser
          </Button>
        </Box>
        
        {diagnostic.length === 0 ? (
          <Alert severity="success" icon={<CheckCircle />}>
            ✅ Aucun problème détecté dans la configuration
          </Alert>
        ) : (
          <Alert severity="warning" icon={<Warning />}>
            <Typography variant="subtitle2" gutterBottom>
              Problèmes détectés:
            </Typography>
            <List dense>
              {diagnostic.map((issue, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon>
                    <Error color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={issue} />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}
      </Paper>

      {/* Tests de connexion */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🧪 Tests de Connexion
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
            onClick={runQuickConnectionTest}
            disabled={loading}
          >
            Test Rapide
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
            onClick={runFullTest}
            disabled={loading}
          >
            Test Complet
          </Button>
        </Box>

        {loading && (
          <Alert severity="info" icon={<CircularProgress size={20} />}>
            Test en cours... Veuillez patienter
          </Alert>
        )}

        {testResults && (
          <Alert 
            severity={getAlertSeverity(testResults.success)} 
            icon={getStatusIcon(testResults.success)}
            sx={{ mt: 2 }}
          >
            <Typography variant="subtitle2">
              {testResults.success ? '✅ Succès' : '❌ Échec'} - {testResults.message}
            </Typography>
            {testResults.error && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Erreur:</strong> {testResults.error}
              </Typography>
            )}
            {testResults.step && (
              <Typography variant="body2">
                <strong>Étape:</strong> {testResults.step}
              </Typography>
            )}
          </Alert>
        )}
      </Paper>

      {/* Résultats détaillés */}
      {testResults?.details && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">📊 Résultats Détaillés</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Connexion Backend
                </Typography>
                <pre style={{ fontSize: '12px', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                  {JSON.stringify(testResults.details.connection, null, 2)}
                </pre>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Authentification
                </Typography>
                <pre style={{ fontSize: '12px', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                  {JSON.stringify(testResults.details.auth, null, 2)}
                </pre>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Création Demande
                </Typography>
                <pre style={{ fontSize: '12px', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                  {JSON.stringify(testResults.details.demande, null, 2)}
                </pre>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Instructions de résolution */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          🛠️ Guide de Résolution
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          1. Backend non accessible (ECONNREFUSED):
        </Typography>
        <Typography variant="body2" paragraph>
          • Vérifiez que Spring Boot est démarré: <code>mvn spring-boot:run</code><br/>
          • Vérifiez le port 8080: <code>netstat -an | grep 8080</code><br/>
          • Vérifiez les logs Spring Boot pour les erreurs
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          2. Erreurs d'authentification:
        </Typography>
        <Typography variant="body2" paragraph>
          • Vérifiez que les utilisateurs de test existent dans DataInitializer<br/>
          • Vérifiez la configuration JWT dans SecurityConfig<br/>
          • Vérifiez les logs d'authentification côté backend
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          3. Erreurs CORS:
        </Typography>
        <Typography variant="body2" paragraph>
          • Vérifiez CorsConfig.java pour autoriser localhost:3000<br/>
          • Redémarrez le backend après modification de CORS
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          4. Données simulées affichées:
        </Typography>
        <Typography variant="body2">
          • Remplacez les données simulées par des appels API réels<br/>
          • Utilisez les services mis à jour dans les artifacts ci-dessus<br/>
          • Testez d'abord avec ce composant de debug
        </Typography>
      </Paper>
    </Box>
  );
};

export default BackendDebug;