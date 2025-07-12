import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { registerService } from '../../services/authService';
import { USER_TYPES } from '../../utils/constants';

const steps = ['Type de compte', 'Informations générales', 'Informations spécifiques'];

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Informations générales
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    typeUser: '',

    // Informations importateur
    raisonSociale: '',
    adresse: '',
    codeDouane: '',
    ice: '',

    // Informations exportateur
    pays: '',
    ville: '',
    codePostal: '',
    numeroExportateur: '',
    secteurActivite: '',
    numeroRegistre: '',

    // Informations agent
    bureauControleId: '',
    superviseur: false,
  });

  const bureauxControle = [
    { id: 1, nom: 'TUV' },
    { id: 2, nom: 'ECF' },
    { id: 3, nom: 'AFNOR' },
    { id: 4, nom: 'ICUM' },
    { id: 5, nom: 'SGS' },
  ];

  const secteursActivite = [
    'Agriculture et Agroalimentaire',
    'Textile et Confection',
    'Automobile et Pièces détachées',
    'Électronique et Électroménager',
    'Chimie et Parachimie',
    'Cosmétiques et Parfumerie',
    'Artisanat et Décoration',
    'Machines et Équipements',
    'Matériaux de Construction',
    'Produits Pharmaceutiques',
    'Jouets et Articles de Sport',
    'Autre'
  ];

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.typeUser) {
          setError('Veuillez sélectionner un type de compte');
          return false;
        }
        break;
      case 1:
        if (!formData.nom || !formData.email || !formData.password) {
          setError('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return false;
        }
        break;
      case 2:
        if (formData.typeUser === USER_TYPES.IMPORTATEUR) {
          if (!formData.raisonSociale) {
            setError('Raison sociale est obligatoire pour un importateur');
            return false;
          }
        } else if (formData.typeUser === USER_TYPES.EXPORTATEUR) {
          if (!formData.raisonSociale || !formData.pays) {
            setError('Raison sociale et pays sont obligatoires pour un exportateur');
            return false;
          }
        } else if (formData.typeUser === USER_TYPES.AGENT) {
          if (!formData.bureauControleId) {
            setError('Bureau de contrôle est obligatoire pour un agent');
            return false;
          }
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    setError('');

    try {
      await registerService.register(formData);
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const renderTypeSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Quel type de compte souhaitez-vous créer ?
      </Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Type de compte</InputLabel>
        <Select
          name="typeUser"
          value={formData.typeUser}
          onChange={handleChange}
          label="Type de compte"
        >
          <MenuItem value={USER_TYPES.IMPORTATEUR}>
            Importateur - Soumettre des demandes COC
          </MenuItem>
          <MenuItem value={USER_TYPES.EXPORTATEUR}>
            Exportateur - Exporter des produits vers le Maroc
          </MenuItem>
          <MenuItem value={USER_TYPES.AGENT}>
            Agent - Contrôler et traiter les demandes
          </MenuItem>
        </Select>
      </FormControl>

      {formData.typeUser && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {formData.typeUser === USER_TYPES.IMPORTATEUR && 
            "En tant qu'importateur, vous pourrez soumettre des demandes de Certificat de Conformité et suivre leur traitement."
          }
          {formData.typeUser === USER_TYPES.EXPORTATEUR && 
            "En tant qu'exportateur, vous pourrez collaborer avec les importateurs marocains et suivre les demandes COC pour vos produits."
          }
          {formData.typeUser === USER_TYPES.AGENT && 
            "En tant qu'agent, vous pourrez traiter les demandes COC qui vous seront affectées par votre bureau de contrôle."
          }
        </Alert>
      )}
    </Box>
  );

  const renderGeneralInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nom complet *"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Téléphone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Mot de passe *"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          helperText="Au moins 6 caractères"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Confirmer le mot de passe *"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </Grid>
    </Grid>
  );

  const renderImportateurInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Informations Entreprise (Importateur)
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Raison sociale *"
          name="raisonSociale"
          value={formData.raisonSociale}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Code douane"
          name="codeDouane"
          value={formData.codeDouane}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="ICE"
          name="ice"
          value={formData.ice}
          onChange={handleChange}
          helperText="Identifiant Commun de l'Entreprise"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Adresse"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          multiline
          rows={3}
        />
      </Grid>
    </Grid>
  );

  const renderExportateurInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Informations Entreprise (Exportateur)
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Raison sociale *"
          name="raisonSociale"
          value={formData.raisonSociale}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Pays *"
          name="pays"
          value={formData.pays}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Ville"
          name="ville"
          value={formData.ville}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Code postal"
          name="codePostal"
          value={formData.codePostal}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Adresse"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          multiline
          rows={2}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Secteur d'activité</InputLabel>
          <Select
            name="secteurActivite"
            value={formData.secteurActivite}
            onChange={handleChange}
            label="Secteur d'activité"
          >
            {secteursActivite.map((secteur) => (
              <MenuItem key={secteur} value={secteur}>
                {secteur}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="IFU"
          name="ifu"
          value={formData.ifu}
          onChange={handleChange}
          helperText="Identifiant Fiscal Unique"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Numéro exportateur"
          name="numeroExportateur"
          value={formData.numeroExportateur}
          onChange={handleChange}
          helperText="Numéro d'enregistrement exportateur"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Numéro registre commerce"
          name="numeroRegistre"
          value={formData.numeroRegistre}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );

  const renderAgentInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Informations Agent
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Bureau de contrôle</InputLabel>
          <Select
            name="bureauControleId"
            value={formData.bureauControleId}
            onChange={handleChange}
            label="Bureau de contrôle"
          >
            {bureauxControle.map((bureau) => (
              <MenuItem key={bureau.id} value={bureau.id}>
                {bureau.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              name="superviseur"
              checked={formData.superviseur}
              onChange={handleChange}
            />
          }
          label="Rôle de superviseur"
        />
        <Typography variant="caption" display="block" color="text.secondary">
          Les superviseurs peuvent gérer les autres agents du bureau
        </Typography>
      </Grid>
    </Grid>
  );

  const renderSpecificInfo = () => {
    if (formData.typeUser === USER_TYPES.IMPORTATEUR) {
      return renderImportateurInfo();
    } else if (formData.typeUser === USER_TYPES.EXPORTATEUR) {
      return renderExportateurInfo();
    } else if (formData.typeUser === USER_TYPES.AGENT) {
      return renderAgentInfo();
    }
    return null;
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderTypeSelection();
      case 1:
        return renderGeneralInfo();
      case 2:
        return renderSpecificInfo();
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Créer un compte COC
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejoignez la plateforme PortNet COC
            </Typography>
          </Box>

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

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2, mb: 2 }}>
            {getStepContent(activeStep)}
          </Box>

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
              >
                {loading ? 'Création...' : 'Créer le compte'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Suivant
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Se connecter
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;