import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  Business,
  LocalShipping,
  Assignment,
  SupervisorAccount,
  ExpandMore,
  Login as LoginIcon,
  Info,
  CheckCircle,
  Speed
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // const navigate = useNavigate(); // Removed duplicate declaration
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, error: authError } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await dispatch(loginUser(formData)).unwrap();
      // La redirection se fait dans useEffect
    } catch (err) {
      setError(err || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const executeQuickLogin = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
    // Auto-submit après un court délai
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  const handleQuickLogin = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
    setError('');
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.typeUser === 'SUPERVISEUR') {
        navigate('/superviseur/vue-ensemble');
      } else if (user.typeUser === 'AGENT') {
        navigate('/agent/demandes');
      } else if (user.typeUser === 'IMPORTATEUR') {
        navigate('/mes-demandes');
      } else if (user.typeUser === 'EXPORTATEUR') {
        navigate('/mes-demandes');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Grid container spacing={4} alignItems="stretch">
          {/* Colonne de gauche - Formulaire de connexion */}
          <Grid item xs={12} md={5}>
            <Paper elevation={6} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box textAlign="center" mb={3}>
                <LoginIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom color="primary">
                  Connexion COC
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Plateforme PortNet - Certificat de Conformité
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {(error || authError) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error || authError}
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Adresse email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Mot de passe"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || isLoading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {(loading || isLoading) ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>
              <Typography variant="body2" color="text.secondary" align="center">
                Nouveau sur la plateforme ?{' '}
                <Button 
                  onClick={() => navigate('/register')}
                  color="primary"
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  Créer un compte
                </Button>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;