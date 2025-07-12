// src/components/auth/Login.js
import React, { useState } from 'react';
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
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    dispatch(loginUser({ email, password })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard');
      }
    });
  };

  return (
    <Container maxWidth="sm">
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
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Connexion COC
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connectez-vous à votre espace PortNet
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
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
                      aria-label="toggle password visibility"
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
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" gutterBottom>
              Vous n'avez pas de compte ?{' '}
              <Link 
                to="/register" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#1976d2',
                  fontWeight: 'bold'
                }}
              >
                Créer un compte
              </Link>
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Comptes de démonstration
            </Typography>
          </Divider>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center" gutterBottom>
              Utilisez ces comptes pour tester l'application :
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickLogin('importateur@test.ma', 'password')}
                disabled={isLoading}
                sx={{ justifyContent: 'flex-start' }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="caption" display="block">
                    <strong>Importateur:</strong> importateur@test.ma
                  </Typography>
                </Box>
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickLogin('exportateur@test.com', 'password')}
                disabled={isLoading}
                sx={{ justifyContent: 'flex-start' }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="caption" display="block">
                    <strong>Exportateur:</strong> exportateur@test.com
                  </Typography>
                </Box>
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickLogin('agent1@tuv.ma', 'password')}
                disabled={isLoading}
                sx={{ justifyContent: 'flex-start' }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="caption" display="block">
                    <strong>Agent:</strong> agent1@tuv.ma
                  </Typography>
                </Box>
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickLogin('superviseur@tuv.ma', 'password')}
                disabled={isLoading}
                sx={{ justifyContent: 'flex-start' }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="caption" display="block">
                    <strong>Superviseur:</strong> superviseur@tuv.ma
                  </Typography>
                </Box>
              </Button>
            </Box>

            <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }} color="text.secondary">
              Mot de passe pour tous les comptes : <strong>password</strong>
            </Typography>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Système COC - PortNet Maroc © 2024
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;