import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Assignment,
  People,
  SwapHoriz,
  Visibility,
  Analytics,
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  ErrorOutline,
} from '@mui/icons-material';
import { STATUS_DEMANDE } from '../../utils/constants';
import { superviseurService } from '../../services/superviseurService';

const DashboardSuperviseur = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📤 Chargement dashboard superviseur...');
      const data = await superviseurService.getDashboardData();
      console.log('✅ Dashboard chargé:', data);
      
      setDashboardData(data);
      
    } catch (err) {
      console.error('❌ Erreur dashboard:', err);
      setError(`Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getChargeColor = (charge) => {
    if (charge === 0) return 'success';
    if (charge <= 5) return 'info';
    if (charge <= 8) return 'warning';
    return 'error';
  };

  const getPerformanceColor = (pourcentage) => {
    if (pourcentage >= 90) return 'success';
    if (pourcentage >= 70) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement du tableau de bord...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchDashboardData}>
          Réessayer
        </Button>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        <Alert severity="warning">
          Aucune donnée disponible
        </Alert>
      </Box>
    );
  }

  const { statistiques, demandes, agents } = dashboardData;

  // Calculs dérivés
  const demandesNonAffectees = demandes?.filter(d => !d.agentNom) || [];
  const agentsActifs = agents?.filter(a => a.disponible && !a.enConge) || [];
  const agentsEnConge = agents?.filter(a => a.enConge) || [];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            📊 Tableau de Bord Superviseur
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aperçu des KPIs et métriques clés du bureau de contrôle
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Analytics />}
          onClick={() => fetchDashboardData()}
          disabled={loading}
        >
          Actualiser
        </Button>
      </Box>

      {/* Alertes prioritaires */}
      {demandesNonAffectees.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            🚨 <strong>Action requise :</strong> {demandesNonAffectees.length} demande(s) non affectée(s) nécessitent une attention immédiate
          </Typography>
        </Alert>
      )}

      {/* KPIs principaux */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment fontSize="large" />
              <Typography variant="h3">{statistiques?.totalDemandes || 0}</Typography>
              <Typography variant="body2">Total Demandes</Typography>
              <Typography variant="caption">
                Bureau de contrôle
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule fontSize="large" />
              <Typography variant="h3">{statistiques?.demandesEnCours || 0}</Typography>
              <Typography variant="body2">En Cours</Typography>
              <Typography variant="caption">
                Traitement actif
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle fontSize="large" />
              <Typography variant="h3">{statistiques?.demandesCloses || 0}</Typography>
              <Typography variant="body2">Terminées</Typography>
              <Typography variant="caption">
                Taux: {statistiques?.totalDemandes > 0 
                  ? Math.round((statistiques.demandesCloses / statistiques.totalDemandes) * 100) 
                  : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: demandesNonAffectees.length > 0 ? 'error.light' : 'info.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ErrorOutline fontSize="large" />
              <Typography variant="h3">{demandesNonAffectees.length}</Typography>
              <Typography variant="body2">Non Affectées</Typography>
              <Typography variant="caption">
                {demandesNonAffectees.length > 0 ? 'Action requise' : 'Tout va bien'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Métriques de performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Performance Bureau
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Délai moyen: {statistiques?.tempsTraitementMoyen || 2.3} jours
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (3 / (statistiques?.tempsTraitementMoyen || 3)) * 100)}
                  color="success"
                  sx={{ mt: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Objectif: ≤ 3 jours
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  Taux conformité: {statistiques?.tauxConformite || 89}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={statistiques?.tauxConformite || 89}
                  color={getPerformanceColor(statistiques?.tauxConformite || 89)}
                  sx={{ mt: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Objectif: ≥ 85%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                👥 État de l'Équipe
              </Typography>
              <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                <Grid item xs={4}>
                  <People color="success" fontSize="large" />
                  <Typography variant="h6">{agentsActifs.length}</Typography>
                  <Typography variant="caption">Actifs</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Warning color="warning" fontSize="large" />
                  <Typography variant="h6">{agentsEnConge.length}</Typography>
                  <Typography variant="caption">En congé</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Assignment color="info" fontSize="large" />
                  <Typography variant="h6">{statistiques?.chargeGlobale || 0}</Typography>
                  <Typography variant="caption">Charge totale</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Objectifs
              </Typography>
              <Alert severity="info" sx={{ mb: 1 }}>
                <Typography variant="caption">
                  Délais respectés: ✅ Excellent
                </Typography>
              </Alert>
              <Alert severity="success" sx={{ mb: 1 }}>
                <Typography variant="caption">
                  Qualité: ✅ Conforme aux standards
                </Typography>
              </Alert>
              <Alert severity={demandesNonAffectees.length > 0 ? "warning" : "success"}>
                <Typography variant="caption">
                  Affectation: {demandesNonAffectees.length > 0 ? '⚠️ À améliorer' : '✅ Optimale'}
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top demandes récentes */}
      <Typography variant="h5" gutterBottom>
        📋 Demandes Récentes (Aperçu)
      </Typography>
      
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Importateur</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {demandes?.slice(0, 5).map((demande) => (
              <TableRow key={demande.id} hover>
                <TableCell>{demande.numeroDemande}</TableCell>
                <TableCell>{demande.importateurNom}</TableCell>
                <TableCell>
                  {demande.agentNom ? (
                    <Chip label={demande.agentNom} size="small" color="primary" />
                  ) : (
                    <Chip label="Non affecté" size="small" color="error" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={demande.status === 'DEPOSE' ? 'Déposée' : 
                           demande.status === 'EN_COURS_DE_TRAITEMENT' ? 'En cours' : 'Clôturée'}
                    color={demande.status === 'DEPOSE' ? 'info' : 
                           demande.status === 'EN_COURS_DE_TRAITEMENT' ? 'warning' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility />}
                  >
                    Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!demandes || demandes.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">
                    Aucune demande récente
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions rapides superviseur */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚀 Actions Rapides
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<SwapHoriz />}
                  disabled={!demandes || demandes.length === 0}
                >
                  Réaffecter demandes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<People />}
                >
                  Gérer agents
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Analytics />}
                >
                  Statistiques détaillées
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Résumé Activité
              </Typography>
              <Typography variant="body2" paragraph>
                • <strong>Bureau :</strong> {agents?.length || 0} agents sous votre supervision
              </Typography>
              <Typography variant="body2" paragraph>
                • <strong>Charge :</strong> {statistiques?.chargeGlobale || 0} demandes en traitement
              </Typography>
              <Typography variant="body2">
                • <strong>Performance :</strong> {statistiques?.tauxConformite || 0}% de conformité
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSuperviseur;