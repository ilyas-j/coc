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
  Button,
  Chip,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

const DemandesAgent = () => {
  // Données de démonstration
  const demandes = [
    {
      id: 1,
      numeroDemande: 'COC-000001',
      dateCreation: '2024-12-15',
      importateurNom: 'Société Import Maroc',
      exportateurNom: 'Société Export France',
      status: 'DEPOSE',
      marchandises: 3,
    },
  ];

  const handlePrendreEnCharge = (demandeId) => {
    alert(`Demande ${demandeId} prise en charge !`);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Demandes à Traiter
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Importateur</TableCell>
              <TableCell>Exportateur</TableCell>
              <TableCell>Marchandises</TableCell>
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
                <TableCell>{demande.exportateurNom}</TableCell>
                <TableCell>
                  <Chip
                    label={`${demande.marchandises} articles`}
                    color="info"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PlayArrow />}
                    onClick={() => handlePrendreEnCharge(demande.id)}
                  >
                    Prendre en charge
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {demandes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Aucune demande affectée
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

export default DemandesAgent;