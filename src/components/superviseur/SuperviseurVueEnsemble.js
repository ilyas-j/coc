import React from 'react';
import { USER_TYPES } from '../../utils/constants';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const getMenuItems = () => {
    if (!user) return [];

    const commonItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    ];

    switch (user.typeUser) {
      case USER_TYPES.IMPORTATEUR:
        return [
          ...commonItems,
          { text: 'Nouvelle Demande', icon: <Add />, path: '/demande/nouvelle' },
          { text: 'Mes Demandes', icon: <ListIcon />, path: '/mes-demandes' },
        ];
      
      case USER_TYPES.EXPORTATEUR:
        return [
          ...commonItems,
          { text: 'Nouvelle Demande', icon: <Add />, path: '/demande/nouvelle' },
          { text: 'Mes Demandes', icon: <ListIcon />, path: '/mes-demandes' },
        ];
      
      case USER_TYPES.AGENT:
        // AGENT SEULEMENT - peut traiter des demandes
        return [
          ...commonItems,
          { text: 'Mes Demandes Affectées', icon: <Assignment />, path: '/agent/demandes' },
        ];
      
      case USER_TYPES.SUPERVISEUR:
        // SUPERVISEUR - fonctionnalités complètes + traitement personnel
        return [
          ...commonItems,
          // Fonctions superviseur
          { text: 'Vue d\'Ensemble Bureau', icon: <SupervisorAccount />, path: '/superviseur/vue-ensemble' },
          { text: 'Gestion des Agents', icon: <People />, path: '/superviseur/agents' },
          { text: 'Statistiques Bureau', icon: <Analytics />, path: '/superviseur/statistiques' },
          // Traitement personnel (double rôle)
          { text: 'Mes Demandes Personnelles', icon: <Assignment />, path: '/superviseur/traitement' },
        ];
      
      default:
        return commonItems;
    }
  };

  // ... reste du composant
};

// 2. CRÉER SuperviseurVueEnsemble.js - Vue de toutes les demandes du bureau
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
} from '@mui/material';
import { SwapHoriz, Visibility, Analytics } from '@mui/icons-material';
import { STATUS_DEMANDE } from '../../utils/constants';
import { superviseurService } from '../../services/superviseurService';

const SuperviseurVueEnsemble = () => {
  const [demandes, setDemandes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [statistiques, setStatistiques] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReaffectation, setOpenReaffectation] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [nouvelAgent, setNouvelAgent] = useState('');

  // Récupérer toutes les données du dashboard superviseur
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await superviseurService.getDashboardData();
      
      setDemandes(response.demandes);
      setAgents(response.agents);
      setStatistiques(response.statistiques);
    } catch (err) {
      console.error('Erreur chargement dashboard superviseur:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReaffecter = (demande) => {
    setSelectedDemande(demande);
    setNouvelAgent('');
    setOpenReaffectation(true);
  };

  const confirmerReaffectation = async () => {
    if (nouvelAgent && selectedDemande) {
      try {
        await superviseurService.reaffecterDemande(selectedDemande.id, nouvelAgent);
        
        const agentNom = agents.find(a => a.id === parseInt(nouvelAgent))?.nom;
        alert(`Demande ${selectedDemande.numeroDemande} réaffectée à ${agentNom}`);
        
        setOpenReaffectation(false);
        await fetchDashboardData(); // Recharger les données
      } catch (error) {
        console.error('Erreur réaffectation:', error);
        alert('Erreur lors de la réaffectation');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case STATUS_DEMANDE.DEPOSE:
        return 'info';
      case STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT:
        return 'warning';
      case STATUS_DEMANDE.CLOTURE:
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case STATUS_DEMANDE.DEPOSE:
        return 'Déposée';
      case STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT:
        return 'En cours';
      case STATUS_DEMANDE.CLOTURE:
        return 'Clôturée';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Chargement de la vue d'ensemble...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vue d'Ensemble du Bureau - Superviseur
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {statistiques.totalDemandes || 0}
              </Typography>
              <Typography variant="body2">Total Demandes</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {statistiques.demandesDeposees || 0}
              </Typography>
              <Typography variant="body2">Déposées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {statistiques.demandesEnCours || 0}
              </Typography>
              <Typography variant="body2">En Cours</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {statistiques.demandesCloses || 0}
              </Typography>
              <Typography variant="body2">Clôturées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main">
                {statistiques.agentsDisponibles || 0}/{statistiques.totalAgents || 0}
              </Typography>
              <Typography variant="body2">Agents Disponibles</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tableau de toutes les demandes du bureau */}
      <Typography variant="h5" gutterBottom>
        Toutes les Demandes du Bureau
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Importateur</TableCell>
              <TableCell>Exportateur</TableCell>
              <TableCell>Agent Affecté</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Décision</TableCell>
              <TableCell>Actions Superviseur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {demandes.map((demande) => (
              <TableRow key={demande.id}>
                <TableCell>{demande.numeroDemande}</TableCell>
                <TableCell>
                  {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>{demande.importateurNom}</TableCell>
                <TableCell>{demande.exportateurNom}</TableCell>
                <TableCell>
                  {demande.agentNom || 
                    <Chip label="Non affecté" color="warning" size="small" />
                  }
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(demande.status)}
                    color={getStatusColor(demande.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {demande.decisionGlobale ? (
                    <Chip
                      label={demande.decisionGlobale}
                      color={demande.decisionGlobale === 'CONFORME' ? 'success' : 'error'}
                      size="small"
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<SwapHoriz />}
                      onClick={() => handleReaffecter(demande)}
                      disabled={demande.status === STATUS_DEMANDE.CLOTURE}
                    >
                      Réaffecter
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => window.open(`/demande/${demande.id}`, '_blank')}
                    >
                      Voir
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {demandes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      Aucune demande dans ce bureau
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de réaffectation */}
      <Dialog open={openReaffectation} onClose={() => setOpenReaffectation(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Réaffecter la demande {selectedDemande?.numeroDemande}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Agent actuel : {selectedDemande?.agentNom || 'Non affecté'}
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Nouvel Agent</InputLabel>
            <Select
              value={nouvelAgent}
              onChange={(e) => setNouvelAgent(e.target.value)}
              label="Nouvel Agent"
            >
              {agents
                .filter(agent => agent.disponible && !agent.enConge)
                .map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.nom} (Charge: {agent.chargeTravail || 0})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          
          {agents.filter(agent => agent.disponible && !agent.enConge).length === 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Aucun agent disponible pour la réaffectation
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReaffectation(false)}>
            Annuler
          </Button>
          <Button 
            onClick={confirmerReaffectation}
            variant="contained"
            disabled={!nouvelAgent}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Informations spéciales superviseur */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          👑 Fonctions Superviseur
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Vue d'ensemble :</strong> Vous voyez TOUTES les demandes de votre bureau de contrôle, pas seulement celles qui vous sont affectées.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Réaffectation :</strong> Vous pouvez réaffecter n'importe quelle demande à un autre agent disponible.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Gestion d'équipe :</strong> Accès aux outils de gestion des agents (disponibilité, congés, charge de travail).
        </Typography>
        <Typography variant="body2">
          <strong>Double rôle :</strong> Vous pouvez aussi traiter personnellement des demandes comme un agent.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SuperviseurVueEnsemble;