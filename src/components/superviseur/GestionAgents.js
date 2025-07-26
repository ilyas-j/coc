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
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  CircularProgress,
  Tooltip,
  Badge,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Edit,
  PersonAdd,
  Analytics,
  WorkOff,
  Work,
  Person,
  Schedule,
  TrendingUp,
  Warning,
  CheckCircle,
  Refresh,
  SwapHoriz,
  Visibility,
} from '@mui/icons-material';
import { superviseurService } from '../../services/superviseurService';

const GestionAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Récupérer les agents du bureau
  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📤 Chargement des agents du bureau...');
      const response = await superviseurService.getAgentsBureau();
      console.log('✅ Agents chargés:', response);
      
      setAgents(response || []);
    } catch (err) {
      console.error('❌ Erreur chargement agents:', err);
      setError('Erreur lors du chargement des agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    // Actualisation automatique toutes les 60 secondes
    const interval = setInterval(fetchAgents, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleDisponibilite = async (agent) => {
    try {
      setLoading(true);
      setError(null);
      
      const nouvelleDisponibilite = !agent.disponible;
      
      console.log('📤 Modification disponibilité:', {
        agentId: agent.id,
        disponible: nouvelleDisponibilite,
        enConge: agent.enConge
      });
      
      await superviseurService.modifierDisponibiliteAgent(
        agent.id, 
        nouvelleDisponibilite, 
        agent.enConge
      );
      
      setSuccess(`Disponibilité de ${agent.nom} modifiée`);
      await fetchAgents();
    } catch (error) {
      console.error('❌ Erreur modification disponibilité:', error);
      setError(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleConge = async (agent) => {
    try {
      setLoading(true);
      setError(null);
      
      const nouveauConge = !agent.enConge;
      
      console.log('📤 Modification congé:', {
        agentId: agent.id,
        disponible: nouveauConge ? false : true, // Si en congé, non disponible
        enConge: nouveauConge
      });
      
      await superviseurService.modifierDisponibiliteAgent(
        agent.id, 
        nouveauConge ? false : true, // Si en congé, automatiquement non disponible
        nouveauConge
      );
      
      setSuccess(`Statut congé de ${agent.nom} modifié`);
      
      if (nouveauConge && agent.chargeTravail > 0) {
        setSuccess(`${agent.nom} mis en congé. Ses ${agent.chargeTravail} demandes ont été réaffectées automatiquement.`);
      }
      
      await fetchAgents();
    } catch (error) {
      console.error('❌ Erreur modification congé:', error);
      setError(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAgent = (agent) => {
    setSelectedAgent(agent);
    setOpenDialog(true);
  };

  const getChargeColor = (charge) => {
    if (charge === 0) return 'success';
    if (charge <= 3) return 'info';
    if (charge <= 6) return 'warning';
    return 'error';
  };

  const getChargeProgress = (charge) => {
    return Math.min((charge / 10) * 100, 100);
  };

  const getStatutColor = (agent) => {
    if (agent.enConge) return 'warning';
    if (!agent.disponible) return 'error';
    if (agent.chargeTravail === 0) return 'success';
    if (agent.chargeTravail > 7) return 'error';
    return 'info';
  };

  const getStatutText = (agent) => {
    if (agent.enConge) return 'En congé';
    if (!agent.disponible) return 'Indisponible';
    if (agent.chargeTravail === 0) return 'Libre';
    if (agent.chargeTravail > 7) return 'Surchargé';
    return 'Actif';
  };

  const getPerformanceColor = (taux) => {
    if (taux >= 90) return 'success';
    if (taux >= 80) return 'info';
    if (taux >= 70) return 'warning';
    return 'error';
  };

  // Calculs statistiques
  const statsAgents = {
    total: agents.length,
    disponibles: agents.filter(a => a.disponible && !a.enConge).length,
    enConge: agents.filter(a => a.enConge).length,
    indisponibles: agents.filter(a => !a.disponible && !a.enConge).length,
    surcharges: agents.filter(a => a.chargeTravail > 7).length,
    chargeGlobale: agents.reduce((sum, a) => sum + a.chargeTravail, 0),
    performanceMoyenne: agents.length > 0 ? 
      Math.round(agents.reduce((sum, a) => sum + a.tauxConformite, 0) / agents.length) : 0
  };

  if (loading && agents.length === 0) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des agents...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            👥 Gestion des Agents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supervision et gestion de l'équipe du bureau de contrôle
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAgents}
            disabled={loading}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => {
              setSelectedAgent(null);
              setOpenDialog(true);
            }}
          >
            Nouvel Agent
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Alertes importantes */}
      {statsAgents.surcharges > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            ⚠️ <strong>Attention :</strong> {statsAgents.surcharges} agent(s) surchargé(s) (>7 demandes). 
            Considérez une réaffectation de leurs demandes.
          </Typography>
        </Alert>
      )}

      {statsAgents.disponibles === 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            🚨 <strong>Critique :</strong> Aucun agent disponible ! Les nouvelles demandes ne peuvent pas être traitées.
          </Typography>
        </Alert>
      )}

      {/* Statistiques des agents */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person fontSize="large" color="primary" />
              <Typography variant="h4">{statsAgents.total}</Typography>
              <Typography variant="body2">Total Agents</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Work fontSize="large" />
              <Typography variant="h4">{statsAgents.disponibles}</Typography>
              <Typography variant="body2">Disponibles</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <WorkOff fontSize="large" />
              <Typography variant="h4">{statsAgents.enConge}</Typography>
              <Typography variant="body2">En Congé</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ bgcolor: statsAgents.surcharges > 0 ? 'error.light' : 'info.light' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning fontSize="large" />
              <Typography variant="h4">{statsAgents.surcharges}</Typography>
              <Typography variant="body2">Surchargés</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Analytics fontSize="large" color="info" />
              <Typography variant="h4">{statsAgents.chargeGlobale}</Typography>
              <Typography variant="body2">Charge Totale</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp fontSize="large" color="secondary" />
              <Typography variant="h4">{statsAgents.performanceMoyenne}%</Typography>
              <Typography variant="body2">Performance Moy.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barre de charge globale */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 Répartition de la Charge de Travail
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" sx={{ minWidth: 120 }}>
            Charge globale:
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (statsAgents.chargeGlobale / (statsAgents.total * 10)) * 100)}
              color={statsAgents.chargeGlobale > statsAgents.total * 8 ? 'error' : 'primary'}
              sx={{ height: 10, borderRadius: 1 }}
            />
          </Box>
          <Typography variant="body2">
            {statsAgents.chargeGlobale}/{statsAgents.total * 10}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({Math.round((statsAgents.chargeGlobale / (statsAgents.total * 10)) * 100)}%)
          </Typography>
        </Box>
      </Paper>

      {/* Table des agents */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Agent</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Statut & Disponibilité</TableCell>
              <TableCell>Charge de Travail</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Contrôles Superviseur</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agents.map((agent) => (
              <TableRow 
                key={agent.id}
                sx={{
                  bgcolor: agent.enConge ? 'warning.light' : 
                           !agent.disponible ? 'error.light' :
                           agent.chargeTravail > 7 ? 'orange.light' : 'inherit'
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Badge
                      badgeContent={
                        agent.enConge ? '🏖️' : 
                        !agent.disponible ? '🚫' :
                        agent.chargeTravail > 7 ? '⚠️' : 
                        agent.chargeTravail === 0 ? '✅' : ''
                      }
                      color={getStatutColor(agent)}
                    >
                      <Person fontSize="large" />
                    </Badge>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {agent.nom}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {agent.id}
                        {agent.superviseur && ' • Superviseur'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{agent.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {agent.telephone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={getStatutText(agent)}
                      color={getStatutColor(agent)}
                      size="small"
                      icon={
                        agent.enConge ? <WorkOff /> :
                        !agent.disponible ? <Warning /> :
                        agent.chargeTravail === 0 ? <CheckCircle /> :
                        <Work />
                      }
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={agent.disponible}
                          onChange={() => handleToggleDisponibilite(agent)}
                          size="small"
                          disabled={agent.enConge || loading}
                        />
                      }
                      label="Disponible"
                      sx={{ m: 0 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={agent.enConge}
                          onChange={() => handleToggleConge(agent)}
                          size="small"
                          disabled={loading}
                        />
                      }
                      label="En congé"
                      sx={{ m: 0 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {agent.chargeTravail}/10
                      </Typography>
                      <Chip
                        label={
                          agent.chargeTravail === 0 ? 'Libre' : 
                          agent.chargeTravail <= 3 ? 'Léger' :
                          agent.chargeTravail <= 6 ? 'Normal' :
                          agent.chargeTravail <= 8 ? 'Chargé' : 'Surchargé'
                        }
                        color={getChargeColor(agent.chargeTravail)}
                        size="small"
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getChargeProgress(agent.chargeTravail)}
                      color={getChargeColor(agent.chargeTravail)}
                      sx={{ mt: 1, height: 6, borderRadius: 1 }}
                    />
                    {agent.chargeTravail > 7 && (
                      <Typography variant="caption" color="error">
                        ⚠️ Surcharge détectée
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      <strong>{agent.demandesTraitees}</strong> demandes traitées
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        {agent.tauxConformite}% conformité
                      </Typography>
                      <Chip
                        size="small"
                        label={
                          agent.tauxConformite >= 90 ? 'Excellent' : 
                          agent.tauxConformite >= 80 ? 'Bon' : 
                          agent.tauxConformite >= 70 ? 'Correct' : 'À améliorer'
                        }
                        color={getPerformanceColor(agent.tauxConformite)}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    {agent.chargeTravail > 0 && (
                      <Tooltip title="Voir les demandes affectées">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => {
                            // Navigation vers les demandes de l'agent
                            console.log('Voir demandes agent:', agent.id);
                          }}
                        >
                          {agent.chargeTravail} demandes
                        </Button>
                      </Tooltip>
                    )}
                    
                    {agent.chargeTravail > 7 && (
                      <Tooltip title="Réaffecter certaines demandes">
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                          startIcon={<SwapHoriz />}
                          onClick={() => {
                            // Logique de réaffectation des demandes surchargées
                            console.log('Réaffecter demandes surchargées:', agent.id);
                          }}
                        >
                          Réaffecter
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Modifier les informations de l'agent">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditAgent(agent)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Voir les statistiques détaillées">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => {
                          console.log('Statistiques agent:', agent.id);
                        }}
                      >
                        <Analytics />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {agents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 4 }}>
                    <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucun agent trouvé
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Aucun agent n'est rattaché à ce bureau de contrôle
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<PersonAdd />}
                      onClick={() => setOpenDialog(true)}
                    >
                      Ajouter le premier agent
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal d'édition/création agent */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {selectedAgent ? <Edit /> : <PersonAdd />}
            {selectedAgent ? `Modifier ${selectedAgent.nom}` : 'Nouvel Agent'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            {selectedAgent ? 
              "Modifiez les informations de l'agent. Les changements seront appliqués immédiatement." :
              "Créez un nouveau compte agent. Il recevra un email avec ses identifiants de connexion."
            }
          </Alert>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom complet *"
                defaultValue={selectedAgent?.nom || ''}
                placeholder="Nom et prénom de l'agent"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                defaultValue={selectedAgent?.email || ''}
                placeholder="email@bureau.ma"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                defaultValue={selectedAgent?.telephone || ''}
                placeholder="+212 6XX XX XX XX"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Spécialités"
                defaultValue="Électronique, Automobile"
                helperText="Séparer par des virgules"
                placeholder="Domaines d'expertise"
              />
            </Grid>
            
            {selectedAgent && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Statuts et Permissions
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        defaultChecked={selectedAgent.disponible}
                      />
                    }
                    label="Agent disponible"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        defaultChecked={selectedAgent.enConge}
                      />
                    }
                    label="En congé"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        defaultChecked={selectedAgent.superviseur}
                      />
                    }
                    label="Rôle superviseur"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // Logique de sauvegarde
              setOpenDialog(false);
              setSuccess(selectedAgent ? 'Agent modifié avec succès' : 'Nouvel agent créé avec succès');
            }}
          >
            {selectedAgent ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recommandations et actions superviseur */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🎯 Recommandations Superviseur
            </Typography>
            
            {statsAgents.surcharges > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Action requise :</strong> {statsAgents.surcharges} agent(s) surchargé(s). 
                  Réaffectez leurs demandes vers des agents moins chargés.
                </Typography>
              </Alert>
            )}
            
            {statsAgents.enConge > statsAgents.disponibles && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Alerte critique :</strong> Plus d'agents en congé que d'agents disponibles. 
                  Risque de retard dans le traitement des demandes.
                </Typography>
              </Alert>
            )}
            
            {statsAgents.performanceMoyenne < 80 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Formation recommandée :</strong> Performance moyenne à {statsAgents.performanceMoyenne}%. 
                  Envisagez une formation sur les nouvelles normes.
                </Typography>
              </Alert>
            )}
            
            {statsAgents.surcharges === 0 && statsAgents.performanceMoyenne >= 90 && (
              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Excellent :</strong> Équipe bien équilibrée avec d'excellentes performances !
                </Typography>
              </Alert>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📊 Répartition Optimale
            </Typography>
            
            <Typography variant="body2" gutterBottom>
              <strong>Charge idéale par agent :</strong> 4-6 demandes
            </Typography>
            
            <Typography variant="body2" gutterBottom>
              <strong>Charge actuelle moyenne :</strong> {statsAgents.total > 0 ? 
                Math.round(statsAgents.chargeGlobale / statsAgents.total * 10) / 10 : 0} demandes
            </Typography>
            
            <Typography variant="body2" gutterBottom>
              <strong>Capacité totale bureau :</strong> {statsAgents.total * 10} demandes
            </Typography>
            
            <Typography variant="body2" gutterBottom>
              <strong>Utilisation actuelle :</strong> {Math.round((statsAgents.chargeGlobale / (statsAgents.total * 10)) * 100)}%
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (statsAgents.chargeGlobale / (statsAgents.total * 10)) * 100)}
                color={
                  statsAgents.chargeGlobale / (statsAgents.total * 10) > 0.8 ? 'error' :
                  statsAgents.chargeGlobale / (statsAgents.total * 10) > 0.6 ? 'warning' : 'success'
                }
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Informations sur la gestion d'équipe */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          👥 Guide de Gestion d'Équipe - Superviseur
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              <strong>Disponibilité :</strong> Contrôlez qui peut recevoir de nouvelles demandes
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Congés :</strong> Mettez un agent en congé pour réaffecter automatiquement ses demandes
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Charge de travail :</strong> Surveillez la répartition équitable des demandes
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              <strong>Performance :</strong> Suivez le taux de conformité et les demandes traitées
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Réaffectation :</strong> Redistribuez les demandes en cas de surcharge
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Optimisation :</strong> Maintenez une charge de 4-6 demandes par agent
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default GestionAgents;