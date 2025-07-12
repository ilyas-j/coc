import React from 'react';
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
  IconButton,
} from '@mui/material';
import { Visibility, Refresh } from '@mui/icons-material';

const MesDemandesList = () => {
  // Données de démonstration
  const demandes = [
    {
      id: 1,
      numeroDemande: 'COC-000001',
      dateCreation: '2024-12-15',
      exportateurNom: 'Société Export France',
      status: 'DEPOSE',
      bureauControle: 'TUV',
      decisionGlobale: null,
    },
    {
      id: 2,
      numeroDemande: 'COC-000002',
      dateCreation: '2024-12-14',
      exportateurNom: 'Export International',
      status: 'CLOTURE',
      bureauControle: 'SGS',
      decisionGlobale: 'CONFORME',
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

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Mes Demandes COC
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
        >
          Actualiser
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Exportateur</TableCell>
              <TableCell>Bureau de contrôle</TableCell>
              <TableCell>Statut</TableCell>
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
                <TableCell>{demande.exportateurNom}</TableCell>
                <TableCell>{demande.bureauControle || 'En attente'}</TableCell>
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
                  <IconButton size="small" color="primary">
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {demandes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Aucune demande trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MesDemandesList;
