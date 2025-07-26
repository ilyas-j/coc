// Composant de test temporaire pour vérifier que les fonctions superviseur marchent
// À placer dans src/components/superviseur/TestSuperviseur.js

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
} from '@mui/material';
import { 
  PlayArrow, 
  SwapHoriz, 
  Visibility, 
  SupervisorAccount,
  People,
  Assignment 
} from '@mui/icons-material';
import { superviseurService } from '../../services/superviseurService';

const TestSuperviseur = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState('vue-ensemble');

  const runTest = async () => {
    setLoading(true);
    setResult('🔄 Test en cours...');

    try {
      let response;
      
      switch (testType) {
        case 'vue-ensemble':
          response = await superviseurService.getVueEnsembleBureau();
          setResult(`✅ Vue d'ensemble récupérée !\nNombre de demandes: ${response?.length || 0}\n\nDonnées:\n${JSON.stringify(response, null, 2)}`);
          break;
          
        case 'agents':
          response = await superviseurService.getAgentsBureau();
          setResult(`✅ Agents du bureau récupérés !\nNombre d'agents: ${response?.length || 0}\n\nDonnées:\n${JSON.stringify(response, null, 2)}`);
          break;
          
        case 'reaffecter':
          response = await superviseurService.reaffecterDemande(1, 2);
          setResult(`✅ Test réaffectation OK !\nRéponse: ${JSON.stringify(response, null, 2)}`);
          break;
          
        case 'dashboard':
          response = await superviseurService.getDashboardData();
          setResult(`✅ Dashboard récupéré !\nStatistiques: ${JSON.stringify(response?.statistiques, null, 2)}`);
          break;
          
        default:
          setResult('❌ Type de test non reconnu');
      }
      
    } catch (error) {
      setResult(`❌ Erreur: ${error.message}\n\nDétails: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Test des Fonctions Superviseur
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Test temporaire :</strong> Vérification que les APIs superviseur fonctionnent correctement.
          Ce composant utilise les mêmes services que les vrais composants superviseur.
        </Typography>
      </Alert>

      {/* Sélection du test */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Type de test"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
          >
            <MenuItem value="vue-ensemble">
              <SupervisorAccount sx={{ mr: 1 }} />
              Vue d'ensemble bureau
            </MenuItem>
            <MenuItem value="agents">
              <People sx={{ mr: 1 }} />
              Gestion des agents
            </MenuItem>
            <MenuItem value="reaffecter">
              <SwapHoriz sx={{ mr: 1 }} />
              Réaffectation
            </MenuItem>
            <MenuItem value="dashboard">
              <Assignment sx={{ mr: 1 }} />
              Dashboard
            </MenuItem>
          </TextField>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={runTest}
            disabled={loading}
          >
            {loading ? 'Test en cours...' : 'Lancer le test'}
          </Button>
        </Grid>
      </Grid>

      {/* Résultats */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          📋 Résultats du test :
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={15}
          value={result || 'Aucun test lancé'}
          InputProps={{
            readOnly: true,
            style: { fontFamily: 'monospace', fontSize: '12px' }
          }}
        />
      </Paper>

      {/* Tests rapides */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SupervisorAccount fontSize="large" color="primary" />
              <Typography variant="h6">Vue d'Ensemble</Typography>
              <Typography variant="body2" color="text.secondary">
                Toutes les demandes du bureau
              </Typography>
              <Button 
                size="small" 
                onClick={() => { setTestType('vue-ensemble'); runTest(); }}
                disabled={loading}
              >
                Tester
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People fontSize="large" color="secondary" />
              <Typography variant="h6">Agents</Typography>
              <Typography variant="body2" color="text.secondary">
                Gestion de l'équipe
              </Typography>
              <Button 
                size="small"
                onClick={() => { setTestType('agents'); runTest(); }}
                disabled={loading}
              >
                Tester
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SwapHoriz fontSize="large" color="warning" />
              <Typography variant="h6">Réaffectation</Typography>
              <Typography variant="body2" color="text.secondary">
                Réaffecter demandes
              </Typography>
              <Button 
                size="small"
                onClick={() => { setTestType('reaffecter'); runTest(); }}
                disabled={loading}
              >
                Tester
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment fontSize="large" color="info" />
              <Typography variant="h6">Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">
                Métriques globales
              </Typography>
              <Button 
                size="small"
                onClick={() => { setTestType('dashboard'); runTest(); }}
                disabled={loading}
              >
                Tester
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Instructions */}
      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>✅ Si les tests passent :</strong> Les services superviseur fonctionnent et les données simulées sont disponibles.
          Les composants SuperviseurVueEnsemble et DashboardSuperviseur utiliseront ces mêmes données.
        </Typography>
      </Alert>
    </Box>
  );
};

export default TestSuperviseur;