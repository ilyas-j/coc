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
} from '@mui/material';
import {
  Edit,
  PersonAdd,
  Analytics,
  WorkOff,
  Work,
} from '@mui/icons-material';

const GestionAgents = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Données de démonstration
  const [agents, setAgents] = useState([
    {
      id: 1,
      nom: 'Agent Dupont',
      email: 'dupont@tuv.ma',
      telephone: '+212666123456',
      disponible: true,
      enConge: false,
      chargeTravail: 3,
      specialites: ['Électronique', 'Automobile'],
      demandesTraitees: 45,
      tauxConformite: 92,
    },
    {
      id: 2,
      nom: 'Agent Martin',
      email: 'martin@tuv.ma',
      telephone: '+212666123457',
      disponible: true,
      enConge: false,
      chargeTravail: 5,
      specialites: ['Textile', 'Agroalimentaire'],
      demandesTraitees: 38,
      tauxConformite: 88,
    },
    {
      id: 3,
      nom: 'Agent Rousseau',
      email: 'rousseau@tuv.ma',
      telephone: '+212666123458',
      disponible: false,
      enConge: true,
      chargeTravail: 0,
      specialites: ['Chimie', 'Pharmaceutique'],
      demandesTraitees: 52,
      tauxConformite: 95,
    },
  ]);

  const handleToggleDisponibilite = (agentId) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, disponible: !agent.disponible }
        : agent
    ));
  };

  const handleToggleConge = (agentId) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            enConge: !agent.enConge,
            disponible: agent.enConge ? true : false,
            chargeTravail: agent.enConge ? agent.chargeTravail : 0
          }
        : agent
    ));
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

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Gestion des Agents
        </Typography>
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

      {/* Statistiques des agents */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4">{agents.length}</Typography>
              <Typography variant="body2">Total Agents</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Work fontSize="large" color="success" />
              <Typography variant="h4">
                {agents.filter(a => a.disponible && !a.enConge).length}
              </Typography>
              <Typography variant="body2">Disponibles</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WorkOff fontSize="large" color="warning" />
              <Typography variant="h4">
                {agents.filter(a => a.enConge).length}
              </Typography>
              <Typography variant="body2">En Congé</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Analytics fontSize="large" color="info" />
              <Typography variant="h4">
                {Math.round(agents.reduce((acc, a) => acc + a.tauxConformite, 0) / agents.length)}%
              </Typography>
              <Typography variant="body2">Taux Conformité</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table des agents */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Agent</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Spécialités</TableCell>
              <TableCell>Charge de Travail</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <Typography variant="subtitle2">{agent.nom}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {agent.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{agent.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {agent.telephone}
                  </Typography>
                </TableCell>
                <TableCell>
                  {agent.specialites.map((spec, index) => (
                    <Chip
                      key={index}
                      label={spec}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {agent.chargeTravail}/10
                      </Typography>
                      <Chip
                        label={agent.chargeTravail === 0 ? 'Libre' : 'Occupé'}
                        color={getChargeColor(agent.chargeTravail)}
                        size="small"
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getChargeProgress(agent.chargeTravail)}
                      color={getChargeColor(agent.chargeTravail)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {agent.demandesTraitees} demandes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {agent.tauxConformite}% conformité
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={agent.disponible}
                          onChange={() => handleToggleDisponibilite(agent.id)}
                          size="small"
                        />
                      }
                      label="Disponible"
                      sx={{ m: 0 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={agent.enConge}
                          onChange={() => handleToggleConge(agent.id)}
                          size="small"
                        />
                      }
                      label="En congé"
                      sx={{ m: 0 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => handleEditAgent(agent)}
                  >
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal d'édition */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAgent ? 'Modifier l\'Agent' : 'Nouvel Agent'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom complet"
                defaultValue={selectedAgent?.nom || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue={selectedAgent?.email || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                defaultValue={selectedAgent?.telephone || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Spécialités"
                defaultValue={selectedAgent?.specialites?.join(', ') || ''}
                helperText="Séparer par des virgules"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            {selectedAgent ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionAgents;
