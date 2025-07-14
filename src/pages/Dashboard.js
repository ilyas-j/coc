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
  Business,
  Public,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { USER_TYPES } from '../utils/constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

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
      
      case USER_TYPES.EXPORTATEUR:
        return [
          {
            title: 'Nouvelle Demande',
            description: 'Collaborer sur une demande COC',
            icon: <Add fontSize="large" color="primary" />,
            action: () => navigate('/exportateur/demande/nouvelle'),
          },
          {
            title: 'Mes Demandes',
            description: 'Suivre mes demandes COC',
            icon: <ListIcon fontSize="large" color="secondary" />,
            action: () => navigate('/exportateur/demandes'),
          },
          {
            title: 'Mes Partenaires',
            description: 'Gérer mes partenaires importateurs',
            icon: <Business fontSize="large" color="info" />,
            action: () => navigate('/exportateur/partenaires'),
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

  const getUserTypeDescription = () => {
    switch (user?.typeUser) {
      case USER_TYPES.IMPORTATEUR:
        return {
          icon: <Business fontSize="large" color="primary" />,
          title: 'Espace Importateur',
          description: 'Gérez vos demandes de Certificat de Conformité pour vos importations au Maroc'
        };
      case USER_TYPES.EXPORTATEUR:
        return {
          icon: <Public fontSize="large" color="secondary" />,
          title: 'Espace Exportateur',
          description: 'Collaborez avec vos partenaires importateurs pour obtenir les COC requis'
        };
      case USER_TYPES.AGENT:
        return {
          icon: <Assignment fontSize="large" color="warning" />,
          title: 'Espace Agent',
          description: 'Contrôlez et validez la conformité des marchandises selon les normes'
        };
      case USER_TYPES.SUPERVISEUR:
        return {
          icon: <SupervisorAccount fontSize="large" color="success" />,
          title: 'Espace Superviseur',
          description: 'Supervisez les activités de votre bureau de contrôle'
        };
      default:
        return {
          icon: <Assignment fontSize="large" />,
          title: 'Tableau de Bord',
          description: 'Bienvenue sur la plateforme COC'
        };
    }
  };

  const quickActions = getQuickActions();
  const userInfo = getUserTypeDescription();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* En-tête avec informations utilisateur */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {userInfo.icon}
          <Box sx={{ ml: 2 }}>
            <Typography variant="h4" gutterBottom>
              {userInfo.title}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Bienvenue, {user?.nom}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          {userInfo.description}
        </Typography>
      </Paper>

      {/* Actions rapides */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Actions Rapides
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ textAlign: 'center', p: 3, flexGrow: 1 }}>
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

      {/* Informations spécifiques au rôle */}
      {user?.typeUser === USER_TYPES.EXPORTATEUR && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            🌍 Informations Exportateur
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Collaboration internationale :</strong> Travaillez avec vos partenaires importateurs au Maroc pour faciliter le processus COC.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Gestion des partenaires :</strong> Maintenez une liste de vos importateurs partenaires pour un suivi efficace.
          </Typography>
          <Typography variant="body2">
            <strong>Conformité :</strong> Assurez-vous que vos produits respectent les normes marocaines avant l'export.
          </Typography>
        </Paper>
      )}

      {/* Informations système */}
      <Paper sx={{ p: 3 }}>
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
            {(user?.typeUser === USER_TYPES.AGENT || user?.typeUser === USER_TYPES.SUPERVISEUR) && (
              <Typography><strong>Bureau:</strong> TUV Maroc</Typography>
            )}
            {user?.typeUser === USER_TYPES.EXPORTATEUR && (
              <Typography><strong>Pays:</strong> International</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;