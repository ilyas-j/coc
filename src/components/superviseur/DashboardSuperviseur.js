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
} from '@mui/material';
import {
  Assignment,
  People,
  SwapHoriz,
  Visibility,
  Analytics,
} from '@mui/icons-material';
import { STATUS_DEMANDE } from '../../utils/constants';
import { superviseurService } from '../../services/superviseurService';

const DashboardSuperviseur = () => {
  const [demandes, setDemandes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReaffectation, setOpenReaffectation] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [nouvelAgent, setNouvelAgent] = useState('');

  // Récupérer les données depuis le backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [demandesResponse, agentsResponse] = await Promise.all([
        superviseurService.getDemandesBureau(),
        superviseurService.getAgentsBureau()
      ]);
      
      setDemandes(demandesResponse);
      setAgents(agentsResponse);
    } catch (err) {
      console.error('Erreur chargement données superviseur:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        
        const agentNom = agents.find(a => a.id === parseInt(nouvelAgent))?.user?.nom;
        alert(`Demande ${selectedDemande.numeroDemande} réaffectée à ${agentNom}`);
        
        setOpenReaffectation(false);
        // Recharger les données
        await fetchData();
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Calcul des statistiques
  const stats = {
    totalDemandes: demandes.length,
    enCours: demandes.filter(d => d.status === STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT).length,
    deposees: demandes.filter(d => d.status === STATUS_DEMANDE.DEPOSE).length,
    clôturees: demandes.filter(d => d.status === STATUS_DEMANDE.CLOTURE).length,
    agentsActifs: agents.filter(a => a.disponible && !a.enConge).length,
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement du dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Superviseur
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment fontSize="large" color="primary" />
              <Typography variant="h4">{stats.totalDemandes}</Typography>
              <Typography variant="body2">Total Demandes</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Analytics fontSize="large" color="info" />
              <Typography variant="h4">{stats.deposees}</Typography>
              <Typography variant="body2">Déposées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment fontSize="large" color="warning" />
              <Typography variant="h4">{stats.enCours}</Typography>
              <Typography variant="body2">En Cours</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment fontSize="large" color="success" />
              <Typography variant="h4">{stats.clôturees}</Typography>
              <Typography variant="body2">Clôturées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People fontSize="large" color="secondary" />
              <Typography variant="h4">{stats.agentsActifs}</Typography>
              <Typography variant="body2">Agents Actifs</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liste des demandes */}
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
              <TableCell>Agent Affecté</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Marchandises</TableCell>
              <TableCell>Décision</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {demandes.map((demande) => (
              <TableRow key={demande.id}>
                <TableCell>{demande.numeroDemande}</TableCell>
                <TableCell>
                  {formatDate(demande.dateCreation)}
                </TableCell>
                <TableCell>{demande.importateurNom}</TableCell>
                <TableCell>{demande.agentNom || 'Non affecté'}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(demande.status)}
                    color={getStatusColor(demande.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{demande.marchandises?.length || 0}</TableCell>
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
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<SwapHoriz />}
                    onClick={() => handleReaffecter(demande)}
                    sx={{ mr: 1 }}
                    disabled={demande.status === STATUS_DEMANDE.CLOTURE}
                  >
                    Réaffecter
                  </Button>
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
            {demandes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box sx={{ py: 4 }}>
                    <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
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
                .filter(agent => agent.disponible && !agent.enConge && agent.id !== selectedDemande?.agent?.id)
                .map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.user?.nom} (Charge: {agent.chargeTravail || 0})
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
    </Box>
  );
};

export default DashboardSuperviseur;