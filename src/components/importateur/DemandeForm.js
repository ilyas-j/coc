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
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CATEGORIES_MARCHANDISE, UNITES_QUANTITE, USER_TYPES } from '../../utils/constants';

const steps = ['Informations Partenaire', 'Marchandises', 'Documents'];

const DemandeForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  
  // Adapter les labels selon le type d'utilisateur
  const isExportateur = user?.typeUser === USER_TYPES.EXPORTATEUR;
  const partenaireLabel = isExportateur ? 'Importateur' : 'Exportateur';
  const stepLabels = [`Informations ${partenaireLabel}`, 'Marchandises', 'Documents'];
  
  const [formData, setFormData] = useState({
    // Informations du partenaire (importateur OU exportateur selon qui fait la demande)
    partenaireNom: '',
    partenairePays: isExportateur ? 'Maroc' : '', // Si exportateur, le partenaire est au Maroc
    partenaireEmail: '',
    partenaireTelephone: '',
    partenaireAdresse: '',
    partenaireIfu: '',
    
    // Marchandises
    marchandises: [{
      categorie: '',
      quantite: '',
      uniteQuantite: '',
      valeurDh: '',
      nomProduit: '',
      fabricant: '',
      adresseFabricant: '',
      paysOrigine: '',
    }]
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleMarchandiseChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      marchandises: prev.marchandises.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
    
    // Clear error
    const errorKey = `marchandises.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: null
      }));
    }
  };

  const addMarchandise = () => {
    setFormData(prev => ({
      ...prev,
      marchandises: [...prev.marchandises, {
        categorie: '',
        quantite: '',
        uniteQuantite: '',
        valeurDh: '',
        nomProduit: '',
        fabricant: '',
        adresseFabricant: '',
        paysOrigine: '',
      }]
    }));
  };

  const removeMarchandise = (index) => {
    if (formData.marchandises.length > 1) {
      setFormData(prev => ({
        ...prev,
        marchandises: prev.marchandises.filter((_, i) => i !== index)
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      // Validation partenaire
      if (!formData.partenaireNom.trim()) {
        newErrors.partenaireNom = `Nom/Raison sociale du ${partenaireLabel.toLowerCase()} est obligatoire`;
      }
      if (!isExportateur && !formData.partenairePays.trim()) {
        newErrors.partenairePays = `Pays du ${partenaireLabel.toLowerCase()} est obligatoire`;
      }
      if (formData.partenaireEmail && !/\S+@\S+\.\S+/.test(formData.partenaireEmail)) {
        newErrors.partenaireEmail = 'Format d\'email invalide';
      }
    }

    if (step === 1) {
      // Validation marchandises
      formData.marchandises.forEach((marchandise, index) => {
        if (!marchandise.categorie) {
          newErrors[`marchandises.${index}.categorie`] = 'Catégorie obligatoire';
        }
        if (!marchandise.quantite || marchandise.quantite <= 0) {
          newErrors[`marchandises.${index}.quantite`] = 'Quantité obligatoire et positive';
        }
        if (!marchandise.uniteQuantite) {
          newErrors[`marchandises.${index}.uniteQuantite`] = 'Unité obligatoire';
        }
        if (!marchandise.valeurDh || marchandise.valeurDh <= 0) {
          newErrors[`marchandises.${index}.valeurDh`] = 'Valeur obligatoire et positive';
        }
        if (!marchandise.nomProduit.trim()) {
          newErrors[`marchandises.${index}.nomProduit`] = 'Nom du produit obligatoire';
        }
        if (!marchandise.fabricant.trim()) {
          newErrors[`marchandises.${index}.fabricant`] = 'Fabricant obligatoire';
        }
        if (!marchandise.adresseFabricant.trim()) {
          newErrors[`marchandises.${index}.adresseFabricant`] = 'Adresse fabricant obligatoire';
        }
        if (!marchandise.paysOrigine.trim()) {
          newErrors[`marchandises.${index}.paysOrigine`] = 'Pays d\'origine obligatoire';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;

    try {
      // Simulation de l'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/mes-demandes');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const renderPartenaireForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Informations du {partenaireLabel}
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          {isExportateur 
            ? "Renseignez les informations de l'importateur marocain qui recevra vos marchandises."
            : "Renseignez les informations de l'exportateur qui vous fournit les marchandises."
          }
        </Alert>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={`Nom/Raison sociale du ${partenaireLabel.toLowerCase()} *`}
              name="partenaireNom"
              value={formData.partenaireNom}
              onChange={handleChange}
              error={!!errors.partenaireNom}
              helperText={errors.partenaireNom}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={`Pays du ${partenaireLabel.toLowerCase()} ${isExportateur ? '' : '*'}`}
              name="partenairePays"
              value={formData.partenairePays}
              onChange={handleChange}
              error={!!errors.partenairePays}
              helperText={errors.partenairePays}
              disabled={isExportateur} // Si exportateur, le pays est toujours Maroc
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Téléphone"
              name="partenaireTelephone"
              value={formData.partenaireTelephone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="partenaireEmail"
              type="email"
              value={formData.partenaireEmail}
              onChange={handleChange}
              error={!!errors.partenaireEmail}
              helperText={errors.partenaireEmail}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse"
              name="partenaireAdresse"
              value={formData.partenaireAdresse}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={isExportateur ? "ICE (Maroc)" : "IFU"}
              name="partenaireIfu"
              value={formData.partenaireIfu}
              onChange={handleChange}
              helperText={isExportateur ? "Identifiant Commun de l'Entreprise (Maroc)" : "Identifiant Fiscal Unique"}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderMarchandisesForm = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Liste des Marchandises ({formData.marchandises.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addMarchandise}
        >
          Ajouter une marchandise
        </Button>
      </Box>

      {formData.marchandises.map((marchandise, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">
                Marchandise #{index + 1}
              </Typography>
              {formData.marchandises.length > 1 && (
                <IconButton 
                  color="error" 
                  onClick={() => removeMarchandise(index)}
                  size="small"
                >
                  <Delete />
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
                  onChange={(e) => handleMarchandiseChange(index, 'categorie', e.target.value)}
                  error={!!errors[`marchandises.${index}.categorie`]}
                  helperText={errors[`marchandises.${index}.categorie`]}
                >
                  {CATEGORIES_MARCHANDISE.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom du produit *"
                  value={marchandise.nomProduit}
                  onChange={(e) => handleMarchandiseChange(index, 'nomProduit', e.target.value)}
                  error={!!errors[`marchandises.${index}.nomProduit`]}
                  helperText={errors[`marchandises.${index}.nomProduit`]}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Quantité *"
                  type="number"
                  value={marchandise.quantite}
                  onChange={(e) => handleMarchandiseChange(index, 'quantite', e.target.value)}
                  error={!!errors[`marchandises.${index}.quantite`]}
                  helperText={errors[`marchandises.${index}.quantite`]}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Unité *"
                  value={marchandise.uniteQuantite}
                  onChange={(e) => handleMarchandiseChange(index, 'uniteQuantite', e.target.value)}
                  error={!!errors[`marchandises.${index}.uniteQuantite`]}
                  helperText={errors[`marchandises.${index}.uniteQuantite`]}
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
                  label="Valeur (DH) *"
                  type="number"
                  value={marchandise.valeurDh}
                  onChange={(e) => handleMarchandiseChange(index, 'valeurDh', e.target.value)}
                  error={!!errors[`marchandises.${index}.valeurDh`]}
                  helperText={errors[`marchandises.${index}.valeurDh`]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fabricant *"
                  value={marchandise.fabricant}
                  onChange={(e) => handleMarchandiseChange(index, 'fabricant', e.target.value)}
                  error={!!errors[`marchandises.${index}.fabricant`]}
                  helperText={errors[`marchandises.${index}.fabricant`]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pays d'origine *"
                  value={marchandise.paysOrigine}
                  onChange={(e) => handleMarchandiseChange(index, 'paysOrigine', e.target.value)}
                  error={!!errors[`marchandises.${index}.paysOrigine`]}
                  helperText={errors[`marchandises.${index}.paysOrigine`]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse du fabricant *"
                  value={marchandise.adresseFabricant}
                  onChange={(e) => handleMarchandiseChange(index, 'adresseFabricant', e.target.value)}
                  error={!!errors[`marchandises.${index}.adresseFabricant`]}
                  helperText={errors[`marchandises.${index}.adresseFabricant`]}
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

  const renderDocumentsForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Documents Requis
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Les documents seront demandés après la validation du formulaire. 
          La facture est obligatoire pour toutes les demandes.
          La fiche technique est requise pour certaines catégories de marchandises.
        </Alert>
        
        <Typography variant="body1" gutterBottom>
          <strong>Documents obligatoires :</strong>
        </Typography>
        <ul>
          <li>Facture (obligatoire)</li>
          <li>Fiche technique (si requis selon la catégorie)</li>
        </ul>

        <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
          <strong>Catégories nécessitant une fiche technique :</strong>
        </Typography>
        <ul>
          <li>Produits industriels et techniques</li>
          <li>Équipements d'éclairage</li>
          <li>Jouets et articles pour enfants</li>
          <li>Véhicules et pièces détachées</li>
          <li>Équipements informatiques et de télécommunication</li>
        </ul>
      </CardContent>
    </Card>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPartenaireForm();
      case 1:
        return renderMarchandisesForm();
      case 2:
        return renderDocumentsForm();
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Nouvelle Demande COC
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Demande créée avec succès ! Redirection en cours...
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {stepLabels.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Précédent
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === stepLabels.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={showSuccess}
            >
              {showSuccess ? 'Création...' : 'Créer la demande'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Suivant
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DemandeForm;