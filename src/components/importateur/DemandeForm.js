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
import { demandeService } from '../../services/demandeService';

const steps = ['Informations Importateur', 'Informations Exportateur', 'Marchandises', 'Confirmation'];

const DemandeForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Vérifier que l'utilisateur est autorisé (Importateur OU Exportateur)
  const isAuthorized = user?.typeUser === USER_TYPES.IMPORTATEUR || user?.typeUser === USER_TYPES.EXPORTATEUR;
  const isImportateur = user?.typeUser === USER_TYPES.IMPORTATEUR;
  const isExportateur = user?.typeUser === USER_TYPES.EXPORTATEUR;
  
  const [formData, setFormData] = useState({
    // Informations importateur
    importateurNom: isImportateur ? (user?.nom || '') : '',
    importateurTelephone: isImportateur ? (user?.telephone || '') : '',
    importateurEmail: isImportateur ? (user?.email || '') : '',
    importateurAdresse: '',
    importateurCodeDouane: '',
    importateurIce: '',
    
    // Informations exportateur
    exportateurNom: isExportateur ? (user?.nom || '') : '',
    exportateurTelephone: isExportateur ? (user?.telephone || '') : '',
    exportateurEmail: isExportateur ? (user?.email || '') : '',
    exportateurAdresse: '',
    exportateurPays: '',
    exportateurIfu: '',
    
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
  const [success, setSuccess] = useState('');

  // Vérification d'autorisation
  if (!isAuthorized) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        <Alert severity="error">
          Seuls les importateurs et exportateurs peuvent créer des demandes COC.
        </Alert>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Votre rôle actuel : {user?.typeUser}
        </Typography>
      </Box>
    );
  }

  // Gestionnaires d'événements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur tape
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
    
    // Effacer l'erreur
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

  // Validation par étape
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      // Validation informations importateur
      if (!formData.importateurNom.trim()) {
        newErrors.importateurNom = 'Nom/Raison sociale importateur est obligatoire';
      }
      if (!formData.importateurEmail) {
        newErrors.importateurEmail = 'Email importateur est obligatoire';
      } else if (!/\S+@\S+\.\S+/.test(formData.importateurEmail)) {
        newErrors.importateurEmail = 'Format d\'email invalide';
      }
    }

    if (step === 1) {
      // Validation informations exportateur
      if (!formData.exportateurNom.trim()) {
        newErrors.exportateurNom = 'Nom/Raison sociale exportateur est obligatoire';
      }
      if (!formData.exportateurPays.trim()) {
        newErrors.exportateurPays = 'Pays exportateur est obligatoire';
      }
      if (formData.exportateurEmail && !/\S+@\S+\.\S+/.test(formData.exportateurEmail)) {
        newErrors.exportateurEmail = 'Format d\'email invalide';
      }
    }

    if (step === 2) {
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

  // Navigation entre les étapes
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Soumission finale
  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    try {
      setLoading(true);
      setErrors({});
      
      const demandeData = {
        importateurNom: formData.importateurNom,
        importateurTelephone: formData.importateurTelephone,
        importateurEmail: formData.importateurEmail,
        importateurAdresse: formData.importateurAdresse,
        importateurCodeDouane: formData.importateurCodeDouane,
        importateurIce: formData.importateurIce,
        
        exportateurNom: formData.exportateurNom,
        exportateurTelephone: formData.exportateurTelephone,
        exportateurEmail: formData.exportateurEmail,
        exportateurAdresse: formData.exportateurAdresse,
        exportateurPays: formData.exportateurPays,
        exportateurIfu: formData.exportateurIfu,
        
        marchandises: formData.marchandises
      };

      console.log('Envoi de la demande:', demandeData);
      const response = await demandeService.creerDemande(demandeData);
      
      setSuccess('Demande créée avec succès ! Redirection en cours...');
      setTimeout(() => navigate('/mes-demandes'), 2000);
    } catch (error) {
      console.error('Erreur création demande:', error);
      setErrors({ 
        submit: error.response?.data?.message || error.message || 'Erreur lors de la création de la demande' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Rendu des formulaires par étape
  const renderImportateurForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Informations Importateur
        </Typography>
        <Alert severity={isImportateur ? "success" : "info"} sx={{ mb: 3 }}>
          {isImportateur 
            ? "Vos informations d'importateur (vous pouvez les modifier/compléter)" 
            : "Renseignez les informations de l'importateur destinataire"
          }
        </Alert>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom/Raison sociale *"
              name="importateurNom"
              value={formData.importateurNom}
              onChange={handleChange}
              error={!!errors.importateurNom}
              helperText={errors.importateurNom}
              disabled={isImportateur && !!user?.nom}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Téléphone"
              name="importateurTelephone"
              value={formData.importateurTelephone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email *"
              name="importateurEmail"
              type="email"
              value={formData.importateurEmail}
              onChange={handleChange}
              error={!!errors.importateurEmail}
              helperText={errors.importateurEmail}
              disabled={isImportateur && !!user?.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Code douane"
              name="importateurCodeDouane"
              value={formData.importateurCodeDouane}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ICE"
              name="importateurIce"
              value={formData.importateurIce}
              onChange={handleChange}
              helperText="Identifiant Commun de l'Entreprise (Maroc)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse"
              name="importateurAdresse"
              value={formData.importateurAdresse}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderExportateurForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Informations Exportateur
        </Typography>
        <Alert severity={isExportateur ? "success" : "info"} sx={{ mb: 3 }}>
          {isExportateur 
            ? "Vos informations d'exportateur (vous pouvez les modifier/compléter)" 
            : "Renseignez les informations de l'exportateur fournisseur"
          }
        </Alert>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom/Raison sociale *"
              name="exportateurNom"
              value={formData.exportateurNom}
              onChange={handleChange}
              error={!!errors.exportateurNom}
              helperText={errors.exportateurNom}
              disabled={isExportateur && !!user?.nom}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Pays *"
              name="exportateurPays"
              value={formData.exportateurPays}
              onChange={handleChange}
              error={!!errors.exportateurPays}
              helperText={errors.exportateurPays}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Téléphone"
              name="exportateurTelephone"
              value={formData.exportateurTelephone}
              onChange={handleChange}
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
              error={!!errors.exportateurEmail}
              helperText={errors.exportateurEmail}
              disabled={isExportateur && !!user?.email}
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
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="IFU"
              name="exportateurIfu"
              value={formData.exportateurIfu}
              onChange={handleChange}
              helperText="Identifiant Fiscal Unique"
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

  const renderConfirmationForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Confirmation de la Demande
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Vérifiez toutes les informations avant de soumettre votre demande COC.
        </Alert>
        
        {/* Résumé importateur */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          📋 Importateur
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Nom:</strong> {formData.importateurNom}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Email:</strong> {formData.importateurEmail}</Typography>
          </Grid>
        </Grid>

        {/* Résumé exportateur */}
        <Typography variant="subtitle1" gutterBottom>
          🌍 Exportateur
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Nom:</strong> {formData.exportateurNom}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Pays:</strong> {formData.exportateurPays}</Typography>
          </Grid>
        </Grid>

        {/* Résumé marchandises */}
        <Typography variant="subtitle1" gutterBottom>
          📦 Marchandises ({formData.marchandises.length})
        </Typography>
        {formData.marchandises.map((marchandise, index) => (
          <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
            <Typography variant="body2">
              <strong>{index + 1}. {marchandise.nomProduit}</strong> - {marchandise.quantite} {marchandise.uniteQuantite}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {marchandise.categorie.replace(/_/g, ' ')} - {marchandise.valeurDh} DH
            </Typography>
          </Box>
        ))}

        <Alert severity="warning" sx={{ mt: 3 }}>
          Une fois soumise, votre demande sera automatiquement affectée à un bureau de contrôle et un agent pour traitement.
        </Alert>
      </CardContent>
    </Card>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderImportateurForm();
      case 1:
        return renderExportateurForm();
      case 2:
        return renderMarchandisesForm();
      case 3:
        return renderConfirmationForm();
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Nouvelle Demande COC
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        {isImportateur && "En tant qu'importateur, vous créez une demande COC pour des marchandises que vous voulez importer."}
        {isExportateur && "En tant qu'exportateur, vous créez une demande COC pour des marchandises que vous voulez exporter vers le Maroc."}
      </Alert>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
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
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              size="large"
            >
              {loading ? 'Création...' : 'Créer la demande'}
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