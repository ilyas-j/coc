import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Description as FileIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CATEGORIES_MARCHANDISE,
  UNITES_QUANTITE,
  CATEGORIES_FICHE_TECHNIQUE_OBLIGATOIRE,
  EXTENSIONS_AUTORISEES,
  TAILLE_MAX_FICHIER,
} from '../../utils/constants';

const steps = ['Informations Exportateur', 'Marchandises', 'Documents', 'Récapitulatif'];

const DemandeFormComplete = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    // Informations exportateur
    exportateur: {
      nom: '',
      telephone: '',
      email: '',
      adresse: '',
      pays: '',
      ifu: '',
    },
    // Liste des marchandises
    marchandises: [
      {
        id: Date.now(),
        categorie: '',
        quantite: '',
        uniteQuantite: '',
        valeurDh: '',
        nomProduit: '',
        fabricant: '',
        adresseFabricant: '',
        paysOrigine: '',
      }
    ],
    // Documents
    documents: {
      facture: null,
      ficheTechnique: null,
    }
  });

  const handleExportateurChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      exportateur: {
        ...prev.exportateur,
        [field]: value
      }
    }));
    setError('');
  };

  const handleMarchandiseChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      marchandises: prev.marchandises.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      )
    }));
    setError('');
  };

  const ajouterMarchandise = () => {
    const nouvelleMarchandise = {
      id: Date.now(),
      categorie: '',
      quantite: '',
      uniteQuantite: '',
      valeurDh: '',
      nomProduit: '',
      fabricant: '',
      adresseFabricant: '',
      paysOrigine: '',
    };
    setFormData(prev => ({
      ...prev,
      marchandises: [...prev.marchandises, nouvelleMarchandise]
    }));
  };

  const supprimerMarchandise = (id) => {
    if (formData.marchandises.length > 1) {
      setFormData(prev => ({
        ...prev,
        marchandises: prev.marchandises.filter(m => m.id !== id)
      }));
    }
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation de l'extension
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!EXTENSIONS_AUTORISEES.includes(extension)) {
      setError(`Extension non autorisée. Extensions acceptées: ${EXTENSIONS_AUTORISEES.join(', ')}`);
      return;
    }

    // Validation de la taille
    if (file.size > TAILLE_MAX_FICHIER * 1024 * 1024) {
      setError(`Fichier trop volumineux. Taille maximum: ${TAILLE_MAX_FICHIER}MB`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: file
      }
    }));
    setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Exportateur
        const { nom, email, pays } = formData.exportateur;
        if (!nom || !email || !pays) {
          setError('Veuillez remplir les champs obligatoires de l\'exportateur (nom, email, pays)');
          return false;
        }
        break;
      
      case 1: // Marchandises
        for (const marchandise of formData.marchandises) {
          const { categorie, quantite, uniteQuantite, valeurDh, nomProduit, fabricant, paysOrigine } = marchandise;
          if (!categorie || !quantite || !uniteQuantite || !valeurDh || !nomProduit || !fabricant || !paysOrigine) {
            setError('Veuillez remplir tous les champs obligatoires pour chaque marchandise');
            return false;
          }
          if (isNaN(quantite) || quantite <= 0) {
            setError('La quantité doit être un nombre positif');
            return false;
          }
          if (isNaN(valeurDh) || valeurDh <= 0) {
            setError('La valeur doit être un nombre positif');
            return false;
          }
        }
        break;
      
      case 2: // Documents
        if (!formData.documents.facture) {
          setError('La facture est obligatoire');
          return false;
        }
        
        // Vérifier si fiche technique obligatoire
        const needsFicheTechnique = formData.marchandises.some(m =>
          CATEGORIES_FICHE_TECHNIQUE_OBLIGATOIRE.includes(m.categorie)
        );
        
        if (needsFicheTechnique && !formData.documents.ficheTechnique) {
          setError('La fiche technique est obligatoire pour au moins une de vos marchandises');
          return false;
        }
        break;
      
      default:
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      // Simuler l'envoi de la demande
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Demande créée avec succès ! Numéro: COC-' + Date.now().toString().slice(-6));
      navigate('/mes-demandes');
    } catch (error) {
      setError('Erreur lors de la création de la demande');
    } finally {
      setLoading(false);
    }
  };

  const renderExportateurForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Informations sur l'exportateur
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nom/Raison sociale *"
          value={formData.exportateur.nom}
          onChange={(e) => handleExportateurChange('nom', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Pays *"
          value={formData.exportateur.pays}
          onChange={(e) => handleExportateurChange('pays', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Téléphone"
          value={formData.exportateur.telephone}
          onChange={(e) => handleExportateurChange('telephone', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email *"
          type="email"
          value={formData.exportateur.email}
          onChange={(e) => handleExportateurChange('email', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Adresse"
          value={formData.exportateur.adresse}
          onChange={(e) => handleExportateurChange('adresse', e.target.value)}
          multiline
          rows={2}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="IFU"
          value={formData.exportateur.ifu}
          onChange={(e) => handleExportateurChange('ifu', e.target.value)}
          helperText="Identifiant Fiscal Unique"
        />
      </Grid>
    </Grid>
  );

  const renderMarchandisesForm = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Liste des marchandises ({formData.marchandises.length})
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={ajouterMarchandise}
        >
          Ajouter une marchandise
        </Button>
      </Box>

      {formData.marchandises.map((marchandise, index) => (
        <Card key={marchandise.id} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">
                Marchandise {index + 1}
              </Typography>
              {formData.marchandises.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => supprimerMarchandise(marchandise.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Catégorie *"
                  value={marchandise.categorie}
                  onChange={(e) => handleMarchandiseChange(marchandise.id, 'categorie', e.target.value)}
                  required
                >
                  {CATEGORIES_MARCHANDISE.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
                {CATEGORIES_FICHE_TECHNIQUE_OBLIGATOIRE.includes(marchandise.categorie) && (
                  <FormHelperText>
                    <Chip size="small" color="warning" label="Fiche technique obligatoire" />
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom du produit *"
                  value={marchandise.nomProduit}
                  onChange={(e) => handleMarchandiseChange(marchandise.id, 'nomProduit', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Quantité *"
                  type="number"
                  value={marchandise.quantite}
                  onChange={(e) => handleMarchandiseChange(marchandise.id, 'quantite', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Unité *"
                  value={marchandise.uniteQuantite}
                  onChange={(e) => handleMarchandiseChange(marchandise.id, 'uniteQuantite', e.target.value)}
                  required
                >
                  {UNITES_QUANTITE.map((unite) => (
                    <MenuItem key={unite} value={unite}>
                      {unite}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Valeur en DH *"
                  type="number"
                  value={marchandise.valeurDh}
                  onChange={(e) => handleMarchandiseChange(marchandise.id, 'valeurDh', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fabricant *"
                  value={marchandise.fabricant}
                  onChange={(e) => handleMarchandiseChange(marchandise.id, 'fabricant', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pays d'origine *"
                  value={marchandise.paysOrigine}
                  onChange={(e) => handleMarchandiseChange(marchandise.id, 'paysOrigine', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse du fabricant"
                  value={marchandise.adresseFabricant}
                  onChange={(e) => handleMarchandiseChange(marchandise.id, 'adresseFabricant', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderDocumentsForm = () => {
    const needsFicheTechnique = formData.marchandises.some(m =>
      CATEGORIES_FICHE_TECHNIQUE_OBLIGATOIRE.includes(m.categorie)
    );

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Documents requis
        </Typography>
        
        <Grid container spacing={3}>
          {/* Facture obligatoire */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center', border: '2px dashed #ccc' }}>
              <Typography variant="subtitle1" gutterBottom>
                Facture * <Chip size="small" color="error" label="Obligatoire" />
              </Typography>
              
              <input
                accept={EXTENSIONS_AUTORISEES.join(',')}
                style={{ display: 'none' }}
                id="facture-upload"
                type="file"
                onChange={(e) => handleFileUpload('facture', e)}
              />
              <label htmlFor="facture-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Choisir un fichier
                </Button>
              </label>
              
              {formData.documents.facture && (
                <Box display="flex" alignItems="center" justifyContent="center">
                  <FileIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {formData.documents.facture.name}
                  </Typography>
                </Box>
              )}
              
              <Typography variant="caption" display="block" color="text.secondary">
                Formats acceptés: {EXTENSIONS_AUTORISEES.join(', ')}
                <br />
                Taille max: {TAILLE_MAX_FICHIER}MB
              </Typography>
            </Paper>
          </Grid>

          {/* Fiche technique conditionnelle */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center', 
              border: needsFicheTechnique ? '2px dashed #ff9800' : '2px dashed #ccc',
              bgcolor: needsFicheTechnique ? '#fff3e0' : 'inherit'
            }}>
              <Typography variant="subtitle1" gutterBottom>
                Fiche technique
                {needsFicheTechnique && (
                  <Chip size="small" color="warning" label="Obligatoire" sx={{ ml: 1 }} />
                )}
              </Typography>
              
              <input
                accept={EXTENSIONS_AUTORISEES.join(',')}
                style={{ display: 'none' }}
                id="fiche-technique-upload"
                type="file"
                onChange={(e) => handleFileUpload('ficheTechnique', e)}
              />
              <label htmlFor="fiche-technique-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2 }}
                  color={needsFicheTechnique ? "warning" : "primary"}
                >
                  Choisir un fichier
                </Button>
              </label>
              
              {formData.documents.ficheTechnique && (
                <Box display="flex" alignItems="center" justifyContent="center">
                  <FileIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {formData.documents.ficheTechnique.name}
                  </Typography>
                </Box>
              )}
              
              {needsFicheTechnique && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Obligatoire pour vos catégories de marchandises
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderRecapitulatif = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Récapitulatif de la demande
      </Typography>
      
      {/* Informations exportateur */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Exportateur
        </Typography>
        <Typography><strong>Nom:</strong> {formData.exportateur.nom}</Typography>
        <Typography><strong>Pays:</strong> {formData.exportateur.pays}</Typography>
        <Typography><strong>Email:</strong> {formData.exportateur.email}</Typography>
      </Paper>

      {/* Marchandises */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Marchandises ({formData.marchandises.length})
        </Typography>
        <List dense>
          {formData.marchandises.map((marchandise, index) => (
            <ListItem key={marchandise.id}>
              <ListItemText
                primary={`${index + 1}. ${marchandise.nomProduit}`}
                secondary={`${marchandise.categorie} - ${marchandise.quantite} ${marchandise.uniteQuantite} - ${marchandise.valeurDh} DH`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Documents */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Documents
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Facture"
              secondary={formData.documents.facture?.name || 'Non fournie'}
            />
            <ListItemSecondaryAction>
              <Chip
                size="small"
                label={formData.documents.facture ? 'OK' : 'Manquant'}
                color={formData.documents.facture ? 'success' : 'error'}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Fiche technique"
              secondary={formData.documents.ficheTechnique?.name || 'Non fournie'}
            />
            <ListItemSecondaryAction>
              <Chip
                size="small"
                label={formData.documents.ficheTechnique ? 'OK' : 'Non fournie'}
                color={formData.documents.ficheTechnique ? 'success' : 'default'}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderExportateurForm();
      case 1:
        return renderMarchandisesForm();
      case 2:
        return renderDocumentsForm();
      case 3:
        return renderRecapitulatif();
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Nouvelle Demande COC
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Importateur: {user?.nom} - {user?.email}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 3 }}>
          {getStepContent(activeStep)}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Précédent
          </Button>
          
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              Annuler
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Création...' : 'Créer la demande'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Suivant
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DemandeFormComplete;