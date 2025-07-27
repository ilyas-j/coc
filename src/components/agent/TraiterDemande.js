import React, { useState, useEffect } from 'react';
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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Cancel,
  Warning,
  Description,
  Assignment,
  Gavel,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { AVIS_MARCHANDISE, STATUS_DEMANDE } from '../../utils/constants';

const TraiterDemandeComplete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [demande, setDemande] = useState(null);
  const [avisData, setAvisData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showFinalDialog, setShowFinalDialog] = useState(false);

useEffect(() => {
  const fetchDemandeDetails = async () => {
    try {
      const response = await agentService.getDemandeDetails(id);
      setDemande(response);
    } catch (error) {
      setError('Erreur lors du chargement de la demande');
    }
  };
  
  fetchDemandeDetails();
}, [id]);
  
  const handlePrendreEnCharge = async () => {
    setIsLoading(true);
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDemande(prev => ({
        ...prev,
        status: STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT,
        dateTraitement: new Date().toISOString()
      }));
      
      setSuccess('Demande prise en charge avec succès');
    } catch (error) {
      setError('Erreur lors de la prise en charge');
    } finally {
      setIsLoading(false);
    }
  };

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
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Avis enregistré avec succès');
      
      // Marquer comme traité localement
      setAvisData(prev => ({
        ...prev,
        [marchandiseId]: {
          ...prev[marchandiseId],
          submitted: true,
        }
      }));

      // Mettre à jour la marchandise dans la demande
      setDemande(prev => ({
        ...prev,
        marchandises: prev.marchandises.map(m => 
          m.id === marchandiseId 
            ? { ...m, avis: avis.avis, commentaire: avis.commentaire }
            : m
        )
      }));
    } catch (error) {
      setError('Erreur lors de l\'enregistrement de l\'avis');
    } finally {
      setIsLoading(false);
    }
  };

  const calculerDecisionGlobale = () => {
    const marchandisesAvecAvis = demande.marchandises.filter(m => m.avis);
    const avisSubmitted = Object.values(avisData).filter(a => a.submitted);
    
    if (marchandisesAvecAvis.length + avisSubmitted.length === 0) return null;
    
    // Combiner les avis existants et nouveaux
    const tousLesAvis = [
      ...marchandisesAvecAvis.map(m => m.avis),
      ...avisSubmitted.map(a => a.avis)
    ];
    
    // Règles selon le cahier des charges
    const hasNonConforme = tousLesAvis.some(a => a === AVIS_MARCHANDISE.NON_CONFORME);
    if (hasNonConforme) return 'NON_CONFORME';
    
    const hasConformeAvecReserve = tousLesAvis.some(a => a === AVIS_MARCHANDISE.CONFORME_AVEC_RESERVE);
    if (hasConformeAvecReserve) return 'CONFORME_AVEC_RESERVE';
    
    return 'CONFORME';
  };

  const handleFinaliserDossier = () => {
    const marchandisesTraitees = demande.marchandises.filter(m => m.avis).length;
    const avisSubmitted = Object.values(avisData).filter(a => a.submitted).length;
    const totalMarchandises = demande.marchandises.length;
    
    if (marchandisesTraitees + avisSubmitted < totalMarchandises) {
      setError('Veuillez donner un avis sur toutes les marchandises avant de finaliser');
      return;
    }
    
    setShowFinalDialog(true);
  };

  const confirmerFinalisation = async () => {
    setIsLoading(true);
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const decisionGlobale = calculerDecisionGlobale();
      
      setDemande(prev => ({
        ...prev,
        status: STATUS_DEMANDE.CLOTURE,
        decisionGlobale,
        dateCloture: new Date().toISOString()
      }));
      
      setShowFinalDialog(false);
      setSuccess(`Dossier finalisé avec la décision: ${decisionGlobale}`);
    } catch (error) {
      setError('Erreur lors de la finalisation');
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

  const getAvisIcon = (avis) => {
    switch (avis) {
      case AVIS_MARCHANDISE.CONFORME:
        return <CheckCircle color="success" />;
      case AVIS_MARCHANDISE.NON_CONFORME:
        return <Cancel color="error" />;
      case AVIS_MARCHANDISE.CONFORME_AVEC_RESERVE:
        return <Warning color="warning" />;
      default:
        return null;
    }
  };

  const getStatusStep = () => {
    switch (demande?.status) {
      case STATUS_DEMANDE.DEPOSE:
        return 0;
      case STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT:
        return 1;
      case STATUS_DEMANDE.CLOTURE:
        return 2;
      default:
        return 0;
    }
  };

  if (!demande) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Chargement des détails de la demande...</Alert>
      </Box>
    );
  }

  const avisSubmitted = Object.values(avisData).filter(a => a.submitted);
  const marchandisesTraitees = demande.marchandises.filter(m => m.avis).length;
  const totalMarchandises = demande.marchandises.length;
  const peutFinaliser = (marchandisesTraitees + avisSubmitted.length) === totalMarchandises && 
                        demande.status === STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT;

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Traiter la Demande - {demande.numeroDemande}
      </Typography>

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

      {/* Progression du traitement */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Progression du traitement
        </Typography>
        <Stepper activeStep={getStatusStep()} orientation="horizontal">
          <Step>
            <StepLabel>Demande déposée</StepLabel>
          </Step>
          <Step>
            <StepLabel>En cours de traitement</StepLabel>
          </Step>
          <Step>
            <StepLabel>Dossier clôturé</StepLabel>
          </Step>
        </Stepper>
        
        {demande.status === STATUS_DEMANDE.DEPOSE && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handlePrendreEnCharge}
              size="large"
              disabled={isLoading}
            >
              {isLoading ? 'Prise en charge...' : 'Prendre en charge cette demande'}
            </Button>
          </Box>
        )}
      </Paper>

      <Grid container spacing={3}>
        {/* Informations générales */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations de la demande
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Numéro" secondary={demande.numeroDemande} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Date de création" secondary={new Date(demande.dateCreation).toLocaleDateString('fr-FR')} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Bureau de contrôle" secondary={demande.bureauControle} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Agent affecté" secondary={demande.agentNom} />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Statut" 
                  secondary={
                    <Chip 
                      label={demande.status} 
                      color={demande.status === STATUS_DEMANDE.CLOTURE ? 'success' : 'primary'} 
                      size="small" 
                    />
                  } 
                />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Importateur
            </Typography>
            <Typography><strong>Nom:</strong> {demande.importateurNom}</Typography>
            <Typography><strong>Email:</strong> {demande.importateurEmail}</Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Exportateur
            </Typography>
            <Typography><strong>Nom:</strong> {demande.exportateurNom}</Typography>
            <Typography><strong>Email:</strong> {demande.exportateurEmail}</Typography>
            <Typography><strong>Pays:</strong> {demande.exportateurPays}</Typography>
          </Paper>

          {/* Documents */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Documents fournis
            </Typography>
            <List dense>
              {demande.documents.facture && (
                <ListItem>
                  <ListItemIcon>
                    <Description color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Facture" 
                    secondary={demande.documents.facture.nom}
                  />
                </ListItem>
              )}
              {demande.documents.ficheTechnique && (
                <ListItem>
                  <ListItemIcon>
                    <Description color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Fiche technique" 
                    secondary={demande.documents.ficheTechnique.nom}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Marchandises à contrôler */}
        <Grid item xs={12} md={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              Marchandises à contrôler ({totalMarchandises})
            </Typography>
            <Box>
              <Chip 
                label={`${marchandisesTraitees + avisSubmitted.length}/${totalMarchandises} traités`}
                color={(marchandisesTraitees + avisSubmitted.length) === totalMarchandises ? 'success' : 'warning'}
              />
              {peutFinaliser && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Gavel />}
                  onClick={handleFinaliserDossier}
                  sx={{ ml: 2 }}
                  disabled={isLoading}
                >
                  Finaliser le dossier
                </Button>
              )}
            </Box>
          </Box>

          {demande.marchandises?.map((marchandise, index) => (
            <Card key={marchandise.id} sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  {/* Informations marchandise */}
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>
                      {index + 1}. {marchandise.nomProduit}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography><strong>Catégorie:</strong> {marchandise.categorie}</Typography>
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
                  <Grid item xs={12} md={5}>
                    <Typography variant="subtitle1" gutterBottom>
                      <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Contrôle de conformité
                    </Typography>
                    
                    {/* Avis déjà soumis */}
                    {avisData[marchandise.id]?.submitted ? (
                      <Alert severity="success" icon={getAvisIcon(avisData[marchandise.id].avis)}>
                        <Typography variant="subtitle2">
                          Avis: {avisData[marchandise.id].avis}
                        </Typography>
                        {avisData[marchandise.id].commentaire && (
                          <Typography variant="body2">
                            Commentaire: {avisData[marchandise.id].commentaire}
                          </Typography>
                        )}
                      </Alert>
                    ) : 
                    /* Avis existant */
                    marchandise.avis ? (
                      <Alert severity={getAvisColor(marchandise.avis)} icon={getAvisIcon(marchandise.avis)}>
                        <Typography variant="subtitle2">
                          Avis: {marchandise.avis}
                        </Typography>
                        {marchandise.commentaire && (
                          <Typography variant="body2">
                            Commentaire: {marchandise.commentaire}
                          </Typography>
                        )}
                      </Alert>
                    ) : 
                    /* Formulaire d'avis */
                    demande.status === STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT ? (
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
                              <Box display="flex" alignItems="center">
                                {getAvisIcon(avis)}
                                <Typography sx={{ ml: 1 }}>
                                  {avis.replace(/_/g, ' ')}
                                </Typography>
                              </Box>
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
                    ) : (
                      <Alert severity="info">
                        Prenez d'abord la demande en charge pour donner un avis
                      </Alert>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>

      {/* Dialog de finalisation */}
      <Dialog open={showFinalDialog} onClose={() => setShowFinalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Gavel sx={{ mr: 1 }} />
            Finaliser le dossier
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Décision globale calculée:
          </Typography>
          <Alert severity={getAvisColor(calculerDecisionGlobale())} icon={getAvisIcon(calculerDecisionGlobale())}>
            <Typography variant="h6">
              {calculerDecisionGlobale()}
            </Typography>
          </Alert>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            Cette décision est calculée automatiquement selon les règles suivantes:
          </Typography>
          <List dense sx={{ mt: 1 }}>
            <ListItem>
              <ListItemText 
                primary="• Si au moins une marchandise est NON CONFORME → Dossier NON CONFORME"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Sinon, si au moins une est CONFORME AVEC RÉSERVE → Dossier CONFORME AVEC RÉSERVE"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Sinon → Dossier CONFORME"
              />
            </ListItem>
          </List>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            Une fois finalisé, le dossier sera clôturé et la décision sera communiquée à l'importateur.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFinalDialog(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button 
            onClick={confirmerFinalisation}
            variant="contained"
            color="success"
            disabled={isLoading}
          >
            {isLoading ? 'Finalisation...' : 'Confirmer la finalisation'}
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/agent/demandes')}
        >
          Retour à la liste
        </Button>
        
        {demande.status === STATUS_DEMANDE.CLOTURE && (
          <Chip 
            label={`Dossier clôturé - ${demande.decisionGlobale || calculerDecisionGlobale()}`}
            color="success"
            size="large"
          />
        )}
      </Box>
    </Box>
  );
};

export default TraiterDemandeComplete;