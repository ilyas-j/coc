import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { USER_TYPES } from '../../utils/constants';
import DemandesAgent from '../agent/DemandesAgent'; // Réutiliser le composant agent

const SuperviseurTraitement = () => {
  const { user } = useSelector((state) => state.auth);

  // Vérifier que c'est bien un superviseur
  if (user?.typeUser !== USER_TYPES.SUPERVISEUR) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Alert severity="error">
          Accès réservé aux superviseurs
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mes Demandes Personnelles - Traitement Superviseur
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        En tant que superviseur, vous pouvez aussi traiter personnellement des demandes COC comme un agent. 
        Ces demandes vous sont affectées en plus de vos fonctions de supervision.
      </Alert>

      {/* Réutiliser le composant DemandesAgent mais avec un endpoint différent */}
      <DemandesAgent 
        endpoint="/api/superviseur/traitement/demandes" 
        title="Mes Demandes Personnelles"
        subtitle="Demandes COC que vous traitez personnellement en tant que superviseur"
      />
    </Box>
  );
};

export default SuperviseurTraitement;