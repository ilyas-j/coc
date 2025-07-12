import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DemandeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    exportateurNom: '',
    exportateurPays: '',
    exportateurEmail: '',
    exportateurTelephone: '',
    exportateurAdresse: '',
    exportateurIfu: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simuler la création d'une demande
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/mes-demandes');
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Nouvelle Demande COC
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Demande créée avec succès ! Redirection en cours...
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Informations Exportateur
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom/Raison sociale *"
                name="exportateurNom"
                value={formData.exportateurNom}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pays *"
                name="exportateurPays"
                value={formData.exportateurPays}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="exportateurTelephone"
                value={formData.exportateurTelephone}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="exportateurEmail"
                type="email"
                value={formData.exportateurEmail}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="exportateurAdresse"
                value={formData.exportateurAdresse}
                onChange={handleChange}
                multiline
                rows={2}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IFU"
                name="exportateurIfu"
                value={formData.exportateurIfu}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              disabled={showSuccess}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={showSuccess}
            >
              {showSuccess ? 'Création...' : 'Créer la demande'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default DemandeForm;