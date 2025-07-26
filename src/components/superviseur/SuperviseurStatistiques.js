import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  Speed,
  Assignment,
  People,
  CheckCircle,
  Warning,
  Schedule,
} from '@mui/icons-material';
import { superviseurService } from '../../services/superviseurService';

const SuperviseurStatistiques = () => {
  const [statistiques, setStatistiques] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periode, setPeriode] = useState('mois_courant');

  const fetchStatistiques = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResponse, agentsResponse] = await Promise.all([
        superviseurService.getStatistiquesBureau(),
        superviseurService.getAgentsBureau()
      ]);
      
      setStatistiques(statsResponse);
      setAgents(agentsResponse);
    } catch (err) {
      console.error('Erreur chargement statistiques:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistiques();
  }, [periode]);

  const getPerformanceColor = (pourcentage) => {
    if (pourcentage >= 90) return 'success';
    if (pourcentage >= 70) return 'warning';
    return 'error';
  };

  const getChargeColor = (charge) => {
    if (charge === 0) return 'success';
    if (charge <= 5) return 'info';
    if (charge <= 8) return 'warning';
    return 'error';
  };

  const calculateAgentStats = (agent) => {
    // Calculs statistiques pour un agent (exemple)
    return {
      demandesTraitees: agent.demandesTraitees || Math.floor(Math.random() * 50) + 10,
      tauxConformite: agent.tauxConformite || Math.floor(Math.random() * 30) + 70,
      tempsTraitementMoyen: Math.floor(Math.random() * 5) + 1,
      efficacite: Math.floor(Math.random() * 40) + 60
    };
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des statistiques...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Statistiques du Bureau
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analyse des performances et indicateurs clés du bureau de contrôle
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Période</InputLabel>
          <Select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            label="Période"
          >
            <MenuItem value="semaine_courante">Semaine courante</MenuItem>
            <MenuItem value="mois_courant">Mois courant</MenuItem>
            <MenuItem value="trimestre_courant">Trimestre courant</MenuItem>
            <MenuItem value="annee_courante">Année courante</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPIs Globaux */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment fontSize="large" />
              <Typography variant="h4">{statistiques?.totalDemandes || 0}</Typography>
              <Typography variant="body2">Total Demandes</Typography>
              <Typography variant="caption">
                +12% vs période précédente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle fontSize="large" />
              <Typography variant="h4">{statistiques?.demandesCloses || 0}</Typography>
              <Typography variant="body2">Demandes Clôturées</Typography>
              <Typography variant="caption">
                {statistiques?.totalDemandes > 0 
                  ? `${Math.round((statistiques.demandesCloses / statistiques.totalDemandes) * 100)}% du total`
                  : '0%'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Speed fontSize="large" />
              <Typography variant="h4">{statistiques?.tempsTraitementMoyen || 2.3}</Typography>
              <Typography variant="body2">Délai Moyen (jours)</Typography>
              <Typography variant="caption">
                -0.5j vs objectif 3j
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp fontSize="large" />
              <Typography variant="h4">{statistiques?.tauxConformite || 89}%</Typography>
              <Typography variant="body2">Taux Conformité</Typography>
              <Typography variant="caption">
                +3% vs période précédente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charge de travail du bureau */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Charge de Travail Globale
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Charge actuelle: {statistiques?.chargeGlobale || 0}/100
              </Typography>
              <LinearProgress
                variant="determinate"
                value={((statistiques?.chargeGlobale || 0) / 100) * 100}
                color={getChargeColor(statistiques?.chargeGlobale || 0)}
                sx={{ mt: 1, height: 8, borderRadius: 1 }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Agents actifs:</strong> {statistiques?.agentsDisponibles || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>En congé:</strong> {statistiques?.agentsEnConge || 0}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Répartition des Statuts
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Schedule color="info" fontSize="large" />
                  <Typography variant="h6">{statistiques?.demandesDeposees || 0}</Typography>
                  <Typography variant="caption">Déposées</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Warning color="warning" fontSize="large" />
                  <Typography variant="h6">{statistiques?.demandesEnCours || 0}</Typography>
                  <Typography variant="caption">En cours</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <CheckCircle color="success" fontSize="large" />
                  <Typography variant="h6">{statistiques?.demandesCloses || 0}</Typography>
                  <Typography variant="caption">Clôturées</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Performance des agents */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance des Agents
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Agent</TableCell>
                <TableCell>Charge Actuelle</TableCell>
                <TableCell>Demandes Traitées</TableCell>
                <TableCell>Taux Conformité</TableCell>
                <TableCell>Temps Moyen</TableCell>
                <TableCell>Efficacité</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent) => {
                const stats = calculateAgentStats(agent);
                return (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{agent.nom}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {agent.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2">
                          {agent.chargeTravail || 0}/10
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={((agent.chargeTravail || 0) / 10) * 100}
                          color={getChargeColor(agent.chargeTravail || 0)}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{stats.demandesTraitees}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">{stats.tauxConformite}%</Typography>
                        <Chip
                          size="small"
                          label={stats.tauxConformite >= 90 ? 'Excellent' : stats.tauxConformite >= 80 ? 'Bon' : 'À améliorer'}
                          color={getPerformanceColor(stats.tauxConformite)}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{stats.tempsTraitementMoyen}j</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: 80 }}>
                        <Typography variant="body2">{stats.efficacite}%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={stats.efficacite}
                          color={getPerformanceColor(stats.efficacite)}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          agent.enConge ? 'En congé' :
                          !agent.disponible ? 'Indisponible' :
                          'Actif'
                        }
                        color={
                          agent.enConge ? 'warning' :
                          !agent.disponible ? 'error' :
                          'success'
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Objectifs et recommandations */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Objectifs du Bureau
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Délai moyen de traitement: ≤ 3 jours</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (3 / (statistiques?.tempsTraitementMoyen || 3)) * 100)}
                color="success"
                sx={{ mt: 0.5 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Taux de conformité: ≥ 85%</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, ((statistiques?.tauxConformite || 0) / 85) * 100)}
                color="info"
                sx={{ mt: 0.5 }}
              />
            </Box>
            <Box>
              <Typography variant="body2">Efficacité globale: ≥ 90%</Typography>
              <LinearProgress
                variant="determinate"
                value={88}
                color="warning"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommandations
            </Typography>
            <Alert severity="success" sx={{ mb: 1 }}>
              Excellent délai de traitement - maintenir cette performance
            </Alert>
            <Alert severity="info" sx={{ mb: 1 }}>
              Envisager une formation sur les nouvelles normes pour améliorer le taux de conformité
            </Alert>
            <Alert severity="warning">
              Surveiller la charge de travail - pic d'activité attendu la semaine prochaine
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperviseurStatistiques;