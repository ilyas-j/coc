import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import {
  Assignment,
  Add,
  List as ListIcon,
  SupervisorAccount,
  People,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES } from '../utils/constants';
import DashboardExportateur from '../components/exportateur/DashboardExportateur';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Si c'est un exportateur, il a les mêmes fonctionnalités qu'un importateur
  if (user?.typeUser === USER_TYPES.EXPORTATEUR) {
    const exportateurActions = [
      {
        title: 'Nouvelle Demande',
        description: 'Créer une nouvelle demande de COC',
        icon: <Add fontSize="large" color="primary" />,
        action: () => navigate('/demande/nouvelle'),
      },
      {
        title: 'Mes Demandes',
        description: 'Consulter le statut de mes demandes',
        icon: <ListIcon fontSize="large" color="secondary" />,
        action: () => navigate('/mes-demandes'),
      },
    ];

    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tableau de Bord COC - Exportateur
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Bienvenue, {user?.nom} - {user?.typeUser}
        </Typography>

        {/* Actions rapides */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Actions Rapides
        </Typography>
        
        <Grid container spacing={3}>
          {exportateurActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={action.action}
                    size="large"
                  >
                    Accéder
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Informations système */}
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Informations Système
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography><strong>Utilisateur:</strong> {user?.nom}</Typography>
              <Typography><strong>Email:</strong> {user?.email}</Typography>
              <Typography><strong>Type:</strong> {user?.typeUser}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography><strong>Version:</strong> COC v1.0.0</Typography>
              <Typography><strong>Support:</strong> support@portnet.ma</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }

  const getQuickActions = () => {
    switch (user?.typeUser) {
      case USER_TYPES.IMPORTATEUR:
        return [
          {
            title: 'Nouvelle Demande',
            description: 'Créer une nouvelle demande de COC',
            icon: <Add fontSize="large" color="primary" />,
            action: () => navigate('/demande/nouvelle'),
          },
          {
            title: 'Mes Demandes',
            description: 'Consulter le statut de mes demandes',
            icon: <ListIcon fontSize="large" color="secondary" />,
            action: () => navigate('/mes-demandes'),
          },
        ];
      
      case USER_TYPES.AGENT:
        return [
          {
            title: 'Demandes à Traiter',
            description: 'Voir les demandes qui me sont affectées',
            icon: <Assignment fontSize="large" color="warning" />,
            action: () => navigate('/agent/demandes'),
          },
          {
            title: 'Supervision Bureau',
            description: 'Vue d\'ensemble du bureau de contrôle',
            icon: <SupervisorAccount fontSize="large" color="success" />,
            action: () => navigate('/superviseur/dashboard'),
          },
          {
            title: 'Gestion Agents',
            description: 'Gérer les agents du bureau',
            icon: <People fontSize="large" color="info" />,
            action: () => navigate('/superviseur/agents'),
          },
        ];
      
      case USER_TYPES.SUPERVISEUR:
        return [
          {
            title: 'Supervision Bureau',
            description: 'Vue d\'ensemble de toutes les demandes',
            icon: <SupervisorAccount fontSize="large" color="primary" />,
            action: () => navigate('/superviseur/dashboard'),
          },
          {
            title: 'Gestion Agents',
            description: 'Gérer les agents et leurs affectations',
            icon: <People fontSize="large" color="secondary" />,
            action: () => navigate('/superviseur/agents'),
          },
          {
            title: 'Demandes en Cours',
            description: 'Traiter les demandes personnelles',
            icon: <Assignment fontSize="large" color="warning" />,
            action: () => navigate('/agent/demandes'),
          },
        ];
      
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord COC
      </Typography>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Bienvenue, {user?.nom} - {user?.typeUser}
      </Typography>

      {/* Actions rapides */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Actions Rapides
      </Typography>
      
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  onClick={action.action}
                  size="large"
                >
                  Accéder
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Informations système */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Informations Système
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><strong>Utilisateur:</strong> {user?.nom}</Typography>
            <Typography><strong>Email:</strong> {user?.email}</Typography>
            <Typography><strong>Type:</strong> {user?.typeUser}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Version:</strong> COC v1.0.0</Typography>
            <Typography><strong>Support:</strong> support@portnet.ma</Typography>
            {user?.typeUser === USER_TYPES.SUPERVISEUR && (
              <Typography><strong>Bureau:</strong> TUV Maroc</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;