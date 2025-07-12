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
  Divider,
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
  StepContent,
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
import { useLocation, useNavigate } from 'react-router-dom';
import { AVIS_MARCHANDISE, DECISION_GLOBALE, STATUS_DEMANDE } from '../../utils/constants';

const TraiterDemandeComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { demande } = location.state || {};
  
  const [avisData, setAvisData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [demandeStatus, setDemandeStatus] = useState(demande?.status || STATUS_DEMANDE.DEPOSE);
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [decisionGlobale, setDecisionGlobale] = useState(null);

  // Données enrichies pour la démonstration
  const demandeComplete = {
    ...demande,
    id: demande?.id || 1,
    numeroDemande: demande?.numeroDemande || 'COC-000001',
    dateCreation: demande?.dateCreation || '2024-12-15',
    importateurNom: demande?.importateurNom || 'Société Import Maroc',
    importateurEmail: 'import@societe.ma',
    exportateurNom: demande?.exportateurNom || 'Société Export France',
    exportateurEmail: 'export@societe.fr',
    exportateurPays: 'France',
    status: demandeStatus,
    marchandises: demande?.marchandises || [
      {
        id: 1,
        nomProduit: 'Lampe LED',
        categorie: 'Équipements d\'éclairage',
        quantite: 100,
        uniteQuantite: 'pièce',
        valeurDh: 15000,
        fabricant: 'LightTech SA',
        adresseFabricant: '123 Rue de la Lumière, Lyon',
        paysOrigine: 'France',
        avis: null,
        commentaire: '',
      },
      {
        id: 2,
        nomProduit: 'Jouet Robot',
        categorie: 'Jouets et articles pour enfants',
        quantite: 50,
        uniteQuantite: 'pièce',
        valeurDh: 8500,
        fabricant: 'ToyMaker Ltd',
        adresseFabricant: '456 Kids Street, Paris',
        paysOrigine: 'France',
        avis: null,
        commentaire: '',
      }
    ],
    documents: {
      facture: { nom: 'facture_001.pdf', url: '/documents/facture_001.pdf' },
      ficheTechnique: { nom: 'fiche_technique.pdf', url: '/documents/fiche_technique.pdf' }
    },
    bureauControle: 'TUV',
    agentNom: 'Agent Dupont'
  };

  if (!demande) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Demande non trouvée. Veuillez retourner à la liste des demandes.
        </Alert>
      </Box>
    );
  }

  const handlePrendreEnCharge = () => {
    setDemandeStatus(STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT);
    setSuccess('Demande prise en charge avec succès');
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
    setError(null);

    try {
      // Simuler l'appel API
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
    } catch (error) {
      setError('Erreur lors de l\'enregistrement de l\'avis');
    } finally {
      setIsLoading(false);
    }
  };

  const calculerDecisionGlobale = () => {
    const avisSubmitted = Object.values(avisData).filter(a => a.submitted);
    
    if (avisSubmitted.length === 0) return null;
    
    // Logique selon le cahier des charges
    const hasNonConforme = avisSubmitted.some(a => a.avis === AVIS_MARCHANDISE.NON_CONFORME);
    if (hasNonConforme) return DECISION_GLOBALE.NON_CONFORME;
    
    const hasConformeAvecReserve = avisSubmitted.some(a => a.avis === AVIS_MARCHANDISE.CONFORME_AVEC_RESERVE);
    if (hasConformeAvecReserve) return DECISION_GLOBALE.CONFORME_AVEC_RESERVE;
    
    return DECISION_GLOBALE.CONFORME;
  };

  const handleFinaliserDossier = () => {
    const avisSubmitted = Object.values(avisData).filter(a => a.submitted);
    const totalMarchandises = demandeComplete.marchandises.length;
    
    if (avisSubmitted.length < totalMarchandises) {
      setError('Veuillez donner un avis sur toutes les marchandises avant de finaliser');
      return;
    }
    
    const decision = calculerDecisionGlobale();
    setDecisionGlobale(decision);
    setShowFinalDialog(true);
  };

  const confirmerFinalisation = () => {
    setDemandeStatus(STATUS_DEMANDE.CLOTURE);
    setShowFinalDialog(false);
    setSuccess(`Dossier finalisé avec la décision: ${decisionGlobale}`);
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
    switch (demandeStatus) {
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

  const avisSubmitted = Object.values(avisData).filter(a => a.submitted);
  const totalMarchandises = demandeComplete.marchandises.length;
  const peutFinaliser = avisSubmitted.length === totalMarchandises && demandeStatus === STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT;

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Traiter la Demande - {demandeComplete.numeroDemande}
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
        
        {demandeStatus === STATUS_DEMANDE.DEPOSE && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handlePrendreEnCharge}
              size="large"
            >
              Prendre en charge cette demande
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
                <ListItemText primary="Numéro" secondary={demandeComplete.numeroDemande} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Date de création" secondary={new Date(demandeComplete.dateCreation).toLocaleDateString('fr-FR')} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Bureau de contrôle" secondary={demandeComplete.bureauControle} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Agent affecté" secondary={demandeComplete.agentNom} />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Statut" 
                  secondary={
                    <Chip 
                      label={demandeStatus} 
                      color={demandeStatus === STATUS_DEMANDE.CLOTURE ? 'success' : 'primary'} 
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
            <Typography><strong>Nom:</strong> {demandeComplete.importateurNom}</Typography>
            <Typography><strong>Email:</strong> {demandeComplete.importateurEmail}</Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Exportateur
            </Typography>
            <Typography><strong>Nom:</strong> {demandeComplete.exportateurNom}</Typography>
            <Typography><strong>Email:</strong> {demandeComplete.exportateurEmail}</Typography>
            <Typography><strong>Pays:</strong> {demandeComplete.exportateurPays}</Typography>
          </Paper>

          {/* Documents */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Documents fournis
            </Typography>
            <List dense>
              {demandeComplete.documents.facture && (
                <ListItem>
                  <ListItemIcon>
                    <Description color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Facture" 
                    secondary={demandeComplete.documents.facture.nom}
                  />
                </ListItem>
              )}
              {demandeComplete.documents.ficheTechnique && (
                <ListItem>
                  <ListItemIcon>
                    <Description color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Fiche technique" 
                    secondary={demandeComplete.documents.ficheTechnique.nom}
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
                label={`${avisSubmitted.length}/${totalMarchandises} traités`}
                color={avisSubmitted.length === totalMarchandises ? 'success' : 'warning'}
              />
              {peutFinaliser && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Gavel />}
                  onClick={handleFinaliserDossier}
                  sx={{ ml: 2 }}
                >
                  Finaliser le dossier
                </Button>
              )}
            </Box>
          </Box>

          {demandeComplete.marchandises?.map((marchandise, index) => (
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
                    <Divider orientation="vertical" sx={{ mr: 2, display: { xs: 'none', md: 'block' } }} />
                    <Typography variant="subtitle1" gutterBottom>
                      <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Contrôle de conformité
                    </Typography>
                    
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
                    ) : marchandise.avis ? (
                      <Alert severity={getAvisColor(marchandise.avis)} icon={getAvisIcon(marchandise.avis)}>
                        Déjà traité: {marchandise.avis}
                      </Alert>
                    ) : demandeStatus === STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT ? (
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
          <Alert severity={getAvisColor(decisionGlobale)} icon={getAvisIcon(decisionGlobale)}>
            <Typography variant="h6">
              {decisionGlobale}
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
          <Button onClick={() => setShowFinalDialog(false)}>
            Annuler
          </Button>
          <Button 
            onClick={confirmerFinalisation}
            variant="contained"
            color="success"
          >
            Confirmer la finalisation
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
        
        {demandeStatus === STATUS_DEMANDE.CLOTURE && (
          <Chip 
            label={`Dossier clôturé - ${decisionGlobale || calculerDecisionGlobale()}`}
            color="success"
            size="large"
          />
        )}
      </Box>
    </Box>
  );
};

export default TraiterDemandeComplete;