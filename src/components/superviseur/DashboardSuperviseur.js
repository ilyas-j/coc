import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Assignment,
  People,
  SwapHoriz,
  Visibility,
  Analytics,
} from '@mui/icons-material';

const DashboardSuperviseur = () => {
  const [openReaffectation, setOpenReaffectation] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [nouvelAgent, setNouvelAgent] = useState('');

  // Données de démonstration - Demandes du bureau
  const demandes = [
    {
      id: 1,
      numeroDemande: 'COC-000001',
      dateCreation: '2024-12-15',
      importateurNom: 'Société Import Maroc',
      exportateurNom: 'Société Export France',
      status: 'DEPOSE',
      agentNom: 'Agent Dupont',
      agentId: 1,
      marchandises: 3,
    },
    {
      id: 2,
      numeroDemande: 'COC-000002',
      dateCreation: '2024-12-14',
      importateurNom: 'Import Plus SARL',
      exportateurNom: 'International Export',
      status: 'EN_COURS_DE_TRAITEMENT',
      agentNom: 'Agent Martin',
      agentId: 2,
      marchandises: 5,
    },
    {
      id: 3,
      numeroDemande: 'COC-000003',
      dateCreation: '2024-12-13',
      importateurNom: 'Global Trade',
      exportateurNom: 'Europe Export',
      status: 'CLOTURE',
      agentNom: 'Agent Dupont',
      agentId: 1,
      marchandises: 2,
      decisionGlobale: 'CONFORME',
    },
  ];

  // Données de démonstration - Agents du bureau
  const agents = [
    {
      id: 1,
      nom: 'Agent Dupont',
      email: 'dupont@tuv.ma',
      disponible: true,
      enConge: false,
      chargeTravail: 3,
    },
    {
      id: 2,
      nom: 'Agent Martin',
      email: 'martin@tuv.ma',
      disponible: true,
      enConge: false,
      chargeTravail: 5,
    },
    {
      id: 3,
      nom: 'Agent Rousseau',
      email: 'rousseau@tuv.ma',
      disponible: false,
      enConge: true,
      chargeTravail: 0,
    },
  ];

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

  const handleReaffecter = (demande) => {
    setSelectedDemande(demande);
    setNouvelAgent('');
    setOpenReaffectation(true);
  };

  const confirmerReaffectation = () => {
    if (nouvelAgent && selectedDemande) {
      const agentNom = agents.find(a => a.id === parseInt(nouvelAgent))?.nom;
      alert(`Demande ${selectedDemande.numeroDemande} réaffectée à ${agentNom}`);
      setOpenReaffectation(false);
    }
  };

  // Statistiques du bureau
  const stats = {
    totalDemandes: demandes.length,
    enCours: demandes.filter(d => d.status === 'EN_COURS_DE_TRAITEMENT').length,
    deposees: demandes.filter(d => d.status === 'DEPOSE').length,
    clôturees: demandes.filter(d => d.status === 'CLOTURE').length,
    agentsActifs: agents.filter(a => a.disponible && !a.enConge).length,
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Superviseur - Bureau TUV
      </Typography>

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
                  {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>{demande.importateurNom}</TableCell>
                <TableCell>{demande.agentNom}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(demande.status)}
                    color={getStatusColor(demande.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{demande.marchandises}</TableCell>
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
            Agent actuel : {selectedDemande?.agentNom}
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Nouvel Agent</InputLabel>
            <Select
              value={nouvelAgent}
              onChange={(e) => setNouvelAgent(e.target.value)}
              label="Nouvel Agent"
            >
              {agents
                .filter(agent => agent.disponible && !agent.enConge && agent.id !== selectedDemande?.agentId)
                .map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.nom} (Charge: {agent.chargeTravail})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
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

