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
  Alert,
} from '@mui/material';
import {
  Assignment,
  Add,
  List as ListIcon,
  SupervisorAccount,
  People,
  Business,
  Visibility,
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
            title: 'Nouvelle Demande COC',
            description: 'Créer une nouvelle demande de Certificat de Conformité',
            icon: <Add fontSize="large" color="primary" />,
            action: () => navigate('/demande/nouvelle'),
            primary: true,
          },
          {
            title: 'Mes Demandes',
            description: 'Consulter le statut de toutes mes demandes COC',
            icon: <ListIcon fontSize="large" color="secondary" />,
            action: () => navigate('/mes-demandes'),
          },
        ];
      
      case USER_TYPES.EXPORTATEUR:
        return [
          {
            title: 'Nouvelle Demande COC',
            description: 'Créer une nouvelle demande de Certificat de Conformité',
            icon: <Add fontSize="large" color="primary" />,
            action: () => navigate('/demande/nouvelle'),
            primary: true,
          },
          {
            title: 'Mes Demandes',
            description: 'Consulter le statut de toutes mes demandes COC',
            icon: <ListIcon fontSize="large" color="secondary" />,
            action: () => navigate('/mes-demandes'),
          },
        ];
      
      case USER_TYPES.AGENT:
        return [
          {
            title: 'Mes Demandes à Traiter',
            description: 'Voir et traiter les demandes qui me sont affectées',
            icon: <Assignment fontSize="large" color="warning" />,
            action: () => navigate('/agent/demandes'),
            primary: true,
          },
        ];
      
      case USER_TYPES.SUPERVISEUR:
        return [
          {
            title: 'Supervision Bureau',
            description: 'Vue d\'ensemble de toutes les demandes du bureau',
            icon: <SupervisorAccount fontSize="large" color="primary" />,
            action: () => navigate('/superviseur/dashboard'),
            primary: true,
          },
          {
            title: 'Gestion des Agents',
            description: 'Gérer les agents et leurs affectations',
            icon: <People fontSize="large" color="secondary" />,
            action: () => navigate('/superviseur/agents'),
          },
          {
            title: 'Mes Demandes Personnelles',
            description: 'Traiter mes propres demandes affectées',
            icon: <Assignment fontSize="large" color="warning" />,
            action: () => navigate('/agent/demandes'),
          },
        ];
      
      default:
        return [];
    }
  };

  const getRoleDescription = () => {
    switch (user?.typeUser) {
      case USER_TYPES.IMPORTATEUR:
        return "En tant qu'importateur, vous pouvez soumettre des demandes de Certificat de Conformité pour vos marchandises et suivre leur progression.";
      case USER_TYPES.EXPORTATEUR:
        return "En tant qu'exportateur, vous pouvez soumettre des demandes de Certificat de Conformité pour vos marchandises destinées au marché marocain.";
      case USER_TYPES.AGENT:
        return "En tant qu'agent de contrôle, vous traitez les demandes COC qui vous sont affectées et donnez des avis de conformité.";
      case USER_TYPES.SUPERVISEUR:
        return "En tant que superviseur, vous supervisez les activités du bureau de contrôle et gérez l'équipe d'agents.";
      default:
        return "";
    }
  };

  const getWelcomeMessage = () => {
    switch (user?.typeUser) {
      case USER_TYPES.IMPORTATEUR:
        return "Espace Importateur";
      case USER_TYPES.EXPORTATEUR:
        return "Espace Exportateur";
      case USER_TYPES.AGENT:
        return "Espace Agent de Contrôle";
      case USER_TYPES.SUPERVISEUR:
        return "Espace Superviseur";
      default:
        return "Tableau de Bord";
    }
  };

  const quickActions = getQuickActions();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {getWelcomeMessage()}
      </Typography>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Bienvenue, {user?.nom}
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        {getRoleDescription()}
      </Alert>

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
                  variant={action.primary ? "contained" : "outlined"}
                  onClick={action.action}
                  size="large"
                  disabled={action.disabled}
                >
                  {action.disabled ? "Bientôt disponible" : "Accéder"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Informations spécifiques selon le rôle */}
      {user?.typeUser === USER_TYPES.IMPORTATEUR && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Informations Importantes - Importateurs
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                • <strong>Documents requis :</strong> Facture obligatoire, fiche technique selon la catégorie
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Délai de traitement :</strong> Généralement 1-3 jours selon la complexité
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Bureaux de contrôle :</strong> TUV, ECF, AFNOR, ICUM, SGS
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                • <strong>Affectation automatique :</strong> Bureau et agent assignés automatiquement
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Suivi en temps réel :</strong> Notifications à chaque étape
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Support :</strong> support@portnet.ma
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {user?.typeUser === USER_TYPES.AGENT && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Guide Agent de Contrôle
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                • <strong>Prise en charge :</strong> Accepter les demandes affectées
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Contrôle :</strong> Vérifier chaque marchandise individuellement
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Avis possibles :</strong> Conforme, Non conforme, Conforme avec réserve
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                • <strong>Décision globale :</strong> Calculée automatiquement
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Finalisation :</strong> Clôturer le dossier après tous les avis
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Support technique :</strong> support-agents@portnet.ma
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {user?.typeUser === USER_TYPES.SUPERVISEUR && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Outils Superviseur
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                • <strong>Vue d'ensemble :</strong> Toutes les demandes du bureau
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Réaffectation :</strong> Redistribuer les demandes entre agents
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Gestion équipe :</strong> Disponibilité et congés des agents
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                • <strong>Statistiques :</strong> Performances et délais de traitement
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Double rôle :</strong> Supervision + traitement personnel
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Escalade :</strong> Support direction pour cas complexes
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {user?.typeUser === USER_TYPES.EXPORTATEUR && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Informations Exportateurs
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                • <strong>Suivi passif :</strong> Visualisation des demandes COC vous concernant
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Partenariats :</strong> Collaboration avec vos importateurs marocains
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Notifications :</strong> Alertes sur l'évolution des dossiers
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                • <strong>Conformité produits :</strong> Historique des décisions
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Anticipation :</strong> Préparer vos futures exportations
              </Typography>
              <Typography variant="body2" gutterBottom>
                • <strong>Support export :</strong> export-support@portnet.ma
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Informations générales système */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Informations Système
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><strong>Utilisateur :</strong> {user?.nom}</Typography>
            <Typography><strong>Email :</strong> {user?.email}</Typography>
            <Typography><strong>Type de compte :</strong> {user?.typeUser}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Version :</strong> COC v1.0.0</Typography>
            <Typography><strong>Plateforme :</strong> PortNet Maroc</Typography>
            <Typography><strong>Support général :</strong> support@portnet.ma</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;