import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { agentService } from '../../services/agentService';
import { AVIS_MARCHANDISE } from '../../utils/constants';

const TraiterDemande = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { demande } = location.state || {};
  
  const [avisData, setAvisData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!demande) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Demande non trouvée. Veuillez retourner à la liste des demandes.
        </Alert>
      </Box>
    );
  }

  const handleAvisChange = (marchandiseId, field, value) => {
    setAvisData(prev => ({
      ...prev,
      [marchandiseId]: {
        ...prev[marchandiseId],
        [field]: value,
        marchandiseId: marchandiseId,
      }
    }));
  };

  const handleSubmitAvis = async (marchandiseId) => {
    const avis = avisData[marchandiseId];
    if (!avis || !avis.avis) {
      setError('Veuillez sélectionner un avis');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await agentService.donnerAvisMarchandise(avis);
      setSuccess('Avis enregistré avec succès');
      
      // Marquer comme traité localement
      setAvisData(prev => ({
        ...prev,
        [marchandiseId]: {
          ...prev[marchandiseId],
          submitted: true,
        }
      }));
    } catch (error) {
      setError('Erreur lors de l\'enregistrement de l\'avis');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvisColor = (avis) => {
    switch (avis) {
      case AVIS_MARCHANDISE.CONFORME:
        return 'success';
      case AVIS_MARCHANDISE.NON_CONFORME:
        return 'error';
      case AVIS_MARCHANDISE.CONFORME_AVEC_RESERVE:
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Traiter la Demande - {demande.numeroDemande}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Informations générales */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informations de la demande
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><strong>Importateur:</strong> {demande.importateurNom}</Typography>
            <Typography><strong>Exportateur:</strong> {demande.exportateurNom}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Date de création:</strong> {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}</Typography>
            <Typography><strong>Statut:</strong> {demande.status}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Liste des marchandises */}
      <Typography variant="h6" gutterBottom>
        Marchandises à contrôler ({demande.marchandises?.length || 0})
      </Typography>

      {demande.marchandises?.map((marchandise, index) => (
        <Card key={marchandise.id} sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              {/* Informations marchandise */}
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  {marchandise.nomProduit}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography><strong>Catégorie:</strong> {marchandise.categorie?.replace(/_/g, ' ')}</Typography>
                    <Typography><strong>Quantité:</strong> {marchandise.quantite} {marchandise.uniteQuantite}</Typography>
                    <Typography><strong>Valeur:</strong> {marchandise.valeurDh} DH</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography><strong>Fabricant:</strong> {marchandise.fabricant}</Typography>
                    <Typography><strong>Pays d'origine:</strong> {marchandise.paysOrigine}</Typography>
                    <Typography><strong>Adresse fabricant:</strong> {marchandise.adresseFabricant}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Section avis */}
              <Grid item xs={12} md={4}>
                <Divider orientation="vertical" sx={{ mr: 2, display: { xs: 'none', md: 'block' } }} />
                <Typography variant="subtitle1" gutterBottom>
                  Donner un avis
                </Typography>
                
                {avisData[marchandise.id]?.submitted ? (
                  <Alert severity="success" size="small">
                    Avis enregistré: {avisData[marchandise.id].avis}
                  </Alert>
                ) : marchandise.avis ? (
                  <Alert severity={getAvisColor(marchandise.avis)} size="small">
                    Déjà traité: {marchandise.avis}
                  </Alert>
                ) : (
                  <Box>
                    <TextField
                      fullWidth
                      select
                      label="Avis de conformité"
                      value={avisData[marchandise.id]?.avis || ''}
                      onChange={(e) => handleAvisChange(marchandise.id, 'avis', e.target.value)}
                      margin="normal"
                      size="small"
                    >
                      {Object.values(AVIS_MARCHANDISE).map((avis) => (
                        <MenuItem key={avis} value={avis}>
                          {avis.replace(/_/g, ' ')}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      label="Commentaire (optionnel)"
                      value={avisData[marchandise.id]?.commentaire || ''}
                      onChange={(e) => handleAvisChange(marchandise.id, 'commentaire', e.target.value)}
                      margin="normal"
                      multiline
                      rows={2}
                      size="small"
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleSubmitAvis(marchandise.id)}
                      disabled={isLoading || !avisData[marchandise.id]?.avis}
                      sx={{ mt: 1 }}
                      size="small"
                    >
                      {isLoading ? 'Enregistrement...' : 'Enregistrer l\'avis'}
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/agent/demandes')}
        >
          Retour à la liste
        </Button>
      </Box>
    </Box>
  );
};

export default TraiterDemande;
