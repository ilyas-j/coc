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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Assignment,
  People,
  SwapHoriz,
  Visibility,
  Analytics,
  Refresh,
  Search,
  ManageAccounts,
  Warning,
  CheckCircle,
  Schedule,
  ErrorOutline,
} from '@mui/icons-material';
import { STATUS_DEMANDE } from '../../utils/constants';
import { superviseurService } from '../../services/superviseurService';

const SuperviseurVueEnsemble = () => {
  const [demandes, setDemandes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // États pour la réaffectation
  const [openReaffectation, setOpenReaffectation] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [nouvelAgent, setNouvelAgent] = useState('');
  const [reaffectationLoading, setReaffectationLoading] = useState(false);
  
  // États pour les filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [agentFilter, setAgentFilter] = useState('ALL');

  // Récupérer les données depuis le backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des données superviseur...');
      
      const [demandesResponse, agentsResponse] = await Promise.all([
        superviseurService.getVueEnsembleBureau(),
        superviseurService.getAgentsBureau()
      ]);
      
      console.log('✅ Données chargées:', { 
        demandes: demandesResponse?.length, 
        agents: agentsResponse?.length 
      });
      
      setDemandes(demandesResponse || []);
      setAgents(agentsResponse || []);
      
    } catch (err) {
      console.error('❌ Erreur chargement données superviseur:', err);
      setError(`Erreur lors du chargement: ${err.message}`);
      
      // En cas d'erreur, initialiser avec des tableaux vides
      setDemandes([]);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrer les demandes selon les critères
  const getFilteredDemandes = () => {
    let filtered = demandes.filter(demande => {
      const matchSearch = !searchTerm || 
        demande.numeroDemande?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.importateurNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.exportateurNom?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchStatus = statusFilter === 'ALL' || demande.status === statusFilter;
      const matchAgent = agentFilter === 'ALL' || 
        (agentFilter === 'UNASSIGNED' && !demande.agentNom) ||
        demande.agentNom === agentFilter;
        
      return matchSearch && matchStatus && matchAgent;
    });

    return filtered;
  };

  const handleReaffecter = (demande) => {
    console.log('🔄 Ouverture modal réaffectation pour:', demande.numeroDemande);
    setSelectedDemande(demande);
    setNouvelAgent('');
    setOpenReaffectation(true);
  };

  const confirmerReaffectation = async () => {
    if (!nouvelAgent || !selectedDemande) {
      setError('Veuillez sélectionner un agent');
      return;
    }

    try {
      setReaffectationLoading(true);
      setError(null);
      
      console.log('📤 Réaffectation demande:', {
        demandeId: selectedDemande.id,
        agentId: nouvelAgent
      });
      
      await superviseurService.reaffecterDemande(selectedDemande.id, nouvelAgent);
      
      const agentNom = agents.find(a => a.id === parseInt(nouvelAgent))?.nom;
      setSuccess(`Demande ${selectedDemande.numeroDemande} réaffectée à ${agentNom}`);
      
      setOpenReaffectation(false);
      
      // Recharger les données
      await fetchData();
      
    } catch (error) {
      console.error('❌ Erreur réaffectation:', error);
      setError(`Erreur lors de la réaffectation: ${error.message}`);
    } finally {
      setReaffectationLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DEPOSE':
        return 'info';
      case 'EN_COURS_DE_TRAITEMENT':
        return 'warning';
      case 'CLOTURE':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DEPOSE':
        return <Schedule fontSize="small" />;
      case 'EN_COURS_DE_TRAITEMENT':
        return <Warning fontSize="small" />;
      case 'CLOTURE':
        return <CheckCircle fontSize="small" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'DEPOSE':
        return 'Déposée';
      case 'EN_COURS_DE_TRAITEMENT':
        return 'En cours';
      case 'CLOTURE':
        return 'Clôturée';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDemandes = getFilteredDemandes();

  // Calcul des statistiques en temps réel
  const stats = {
    totalDemandes: demandes.length,
    enCours: demandes.filter(d => d.status === 'EN_COURS_DE_TRAITEMENT').length,
    deposees: demandes.filter(d => d.status === 'DEPOSE').length,
    clôturees: demandes.filter(d => d.status === 'CLOTURE').length,
    nonAffectees: demandes.filter(d => !d.agentNom).length,
    agentsActifs: agents.filter(a => a.disponible && !a.enConge).length,
    chargeGlobale: agents.reduce((sum, a) => sum + (a.chargeTravail || 0), 0),
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement de la vue d'ensemble...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Récupération des demandes et agents du bureau
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            🏢 Vue d'Ensemble du Bureau
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supervision complète de toutes les demandes COC du bureau de contrôle
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchData}
            disabled={loading}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<Analytics />}
            onClick={() => {/* Navigation vers statistiques détaillées */}}
          >
            Rapport Détaillé
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

      {/* Tableau de bord avec KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment fontSize="large" color="primary" />
              <Typography variant="h4">{stats.totalDemandes}</Typography>
              <Typography variant="body2">Total Demandes</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule fontSize="large" />
              <Typography variant="h4">{stats.deposees}</Typography>
              <Typography variant="body2">Déposées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning fontSize="large" />
              <Typography variant="h4">{stats.enCours}</Typography>
              <Typography variant="body2">En Cours</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle fontSize="large" />
              <Typography variant="h4">{stats.clôturees}</Typography>
              <Typography variant="body2">Clôturées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: stats.nonAffectees > 0 ? 'error.light' : 'grey.100' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ErrorOutline fontSize="large" color={stats.nonAffectees > 0 ? 'error' : 'disabled'} />
              <Typography variant="h4">{stats.nonAffectees}</Typography>
              <Typography variant="body2">Non Affectées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People fontSize="large" color="secondary" />
              <Typography variant="h4">{stats.agentsActifs}/{agents.length}</Typography>
              <Typography variant="body2">Agents Actifs</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alertes importantes */}
      {stats.nonAffectees > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            ⚠️ {stats.nonAffectees} demande(s) non affectée(s) nécessitent une attention immédiate
          </Typography>
        </Alert>
      )}

      {/* Filtres et recherche */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Statut"
              >
                <MenuItem value="ALL">Tous</MenuItem>
                <MenuItem value="DEPOSE">Déposées</MenuItem>
                <MenuItem value="EN_COURS_DE_TRAITEMENT">En cours</MenuItem>
                <MenuItem value="CLOTURE">Clôturées</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Agent</InputLabel>
              <Select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                label="Agent"
              >
                <MenuItem value="ALL">Tous</MenuItem>
                <MenuItem value="UNASSIGNED">❌ Non affectées</MenuItem>
                {agents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.nom}>
                    {agent.nom} {agent.enConge ? '(Congé)' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Affichage : {filteredDemandes.length} / {demandes.length} demandes
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Liste des demandes avec fonctionnalités superviseur */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Date Création</TableCell>
              <TableCell>Importateur</TableCell>
              <TableCell>Exportateur</TableCell>
              <TableCell>Agent Affecté</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Marchandises</TableCell>
              <TableCell>Décision</TableCell>
              <TableCell>Actions Superviseur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDemandes.map((demande) => (
              <TableRow 
                key={demande.id} 
                hover
                sx={{
                  bgcolor: !demande.agentNom ? 'error.light' : 'inherit',
                  '&:hover': {
                    bgcolor: !demande.agentNom ? 'error.main' : 'action.hover',
                  }
                }}
              >
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {demande.numeroDemande}
                  </Typography>
                  {!demande.agentNom && (
                    <Chip 
                      label="⚠️ NON AFFECTÉE" 
                      color="error" 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(demande.dateCreation)}
                  </Typography>
                  {demande.dateAffectation && (
                    <Typography variant="caption" color="text.secondary">
                      Affectée: {formatDate(demande.dateAffectation)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="500">
                    {demande.importateurNom}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {demande.exportateurNom || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {demande.agentNom ? (
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        {demande.agentNom}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Charge: {demande.agentCharge || 0}
                      </Typography>
                    </Box>
                  ) : (
                    <Chip label="❌ Non affecté" color="error" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(demande.status)}
                    label={getStatusText(demande.status)}
                    color={getStatusColor(demande.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {demande.marchandises?.length || 0} article(s)
                  </Typography>
                  {demande.marchandises && demande.marchandises.length > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Val: {demande.marchandises.reduce((sum, m) => sum + (m.valeurDh || 0), 0)} DH
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {demande.decisionGlobale ? (
                    <Chip
                      label={demande.decisionGlobale}
                      color={demande.decisionGlobale === 'CONFORME' ? 'success' : 'error'}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      En attente
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Réaffecter à un autre agent">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleReaffecter(demande)}
                        disabled={demande.status === 'CLOTURE'}
                      >
                        <SwapHoriz />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Voir détails de la demande">
                      <IconButton
                        size="small"
                        color="secondary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredDemandes.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Box sx={{ py: 4 }}>
                    <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      {demandes.length === 0 ? 'Aucune demande dans ce bureau' : 'Aucune demande ne correspond aux filtres'}
                    </Typography>
                    {searchTerm && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('ALL');
                          setAgentFilter('ALL');
                        }}
                        sx={{ mt: 1 }}
                      >
                        Effacer les filtres
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de réaffectation - FONCTIONNALITÉ CLÉ SUPERVISEUR */}
      <Dialog open={openReaffectation} onClose={() => setOpenReaffectation(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <SwapHoriz color="primary" />
            Réaffecter la demande {selectedDemande?.numeroDemande}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Agent actuel :</strong> {selectedDemande?.agentNom || 'Non affecté'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Statut :</strong> {selectedDemande && getStatusText(selectedDemande.status)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Importateur :</strong> {selectedDemande?.importateurNom}
            </Typography>
          </Box>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            En tant que superviseur, vous pouvez réaffecter cette demande à n'importe quel agent disponible du bureau.
          </Alert>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Nouvel Agent</InputLabel>
            <Select
              value={nouvelAgent}
              onChange={(e) => setNouvelAgent(e.target.value)}
              label="Nouvel Agent"
            >
              {agents
                .filter(agent => 
                  agent.disponible && 
                  !agent.enConge && 
                  agent.nom !== selectedDemande?.agentNom
                )
                .map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    <Box>
                      <Typography variant="body2">
                        {agent.nom}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Charge actuelle: {agent.chargeTravail || 0}/10 demandes
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          
          {agents.filter(agent => agent.disponible && !agent.enConge).length === 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              ⚠️ Aucun agent disponible pour la réaffectation. Vérifiez la disponibilité des agents.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReaffectation(false)} disabled={reaffectationLoading}>
            Annuler
          </Button>
          <Button 
            onClick={confirmerReaffectation}
            variant="contained"
            disabled={!nouvelAgent || reaffectationLoading}
            startIcon={reaffectationLoading ? <CircularProgress size={16} /> : <SwapHoriz />}
          >
            {reaffectationLoading ? 'Réaffectation...' : 'Confirmer la réaffectation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Informations superviseur */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          📊 Fonctions Superviseur - Vue d'Ensemble
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              <strong>🎯 Supervision complète :</strong> Visualisez toutes les demandes du bureau de contrôle en temps réel
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>🔄 Réaffectation intelligente :</strong> Redistribuez les demandes selon la charge de travail des agents
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>🔍 Filtrage avancé :</strong> Recherchez et filtrez par statut, agent, ou mots-clés
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              <strong>⚠️ Alertes visuelles :</strong> Les demandes non affectées sont mises en évidence en rouge
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>📈 KPIs en direct :</strong> Statistiques temps réel sur l'activité du bureau
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>⚡ Actions rapides :</strong> Réaffectation et consultation en un clic
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Résumé des responsabilités superviseur */}
      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>🏢 Vous supervisez actuellement :</strong> {stats.totalDemandes} demandes • {agents.length} agents • 
          {stats.nonAffectees > 0 && ` ⚠️ ${stats.nonAffectees} demandes nécessitent une affectation`}
        </Typography>
      </Alert>
    </Box>
  );
};

export default SuperviseurVueEnsemble;