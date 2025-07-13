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
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  TrendingUp,
  Assignment,
  Business,
  CheckCircle,
  Schedule,
  Cancel,
  Info,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const DashboardExportateur = () => {
  const { user } = useSelector((state) => state.auth);

  // Données mockées pour la démonstration
  const mockStats = {
    demandesLiees: 8,
    demandesEnCours: 3,
    demandesApprouvees: 4,
    demandesRejettees: 1,
    importateursPartenaires: 5,
    valeurTotaleDemandes: 125000,
  };

  const mockRecentDemandes = [
    {
      id: 1,
      numero: 'COC-000001',
      importateur: 'Société Import Maroc',
      produit: 'Ordinateurs portables',
      statut: 'EN_COURS_DE_TRAITEMENT',
      date: '2024-12-15',
      valeur: 50000,
    },
    {
      id: 2,
      numero: 'COC-000002',
      importateur: 'Global Trade SARL',
      produit: 'Équipements électroniques',
      statut: 'CLOTURE',
      date: '2024-12-14',
      valeur: 35000,
    },
    {
      id: 3,
      numero: 'COC-000003',
      importateur: 'Import Plus',
      produit: 'Machines industrielles',
      statut: 'DEPOSE',
      date: '2024-12-13',
      valeur: 40000,
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DEPOSE':
        return <Info color="info" />;
      case 'EN_COURS_DE_TRAITEMENT':
        return <Schedule color="warning" />;
      case 'CLOTURE':
        return <CheckCircle color="success" />;
      case 'REJETE':
        return <Cancel color="error" />;
      default:
        return <Info />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DEPOSE':
        return 'info';
      case 'EN_COURS_DE_TRAITEMENT':
        return 'warning';
      case 'CLOTURE':
        return 'success';
      case 'REJETE':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'DEPOSE':
        return 'Déposée';
      case 'EN_COURS_DE_TRAITEMENT':
        return 'En cours';
      case 'CLOTURE':
        return 'Clôturée';
      case 'REJETE':
        return 'Rejetée';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Exportateur
      </Typography>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Bienvenue, {user?.nom}
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Suivez ici toutes les demandes COC concernant vos produits exportés vers le Maroc.
        </Typography>
      </Alert>

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment fontSize="large" color="primary" />
              <Typography variant="h4">{mockStats.demandesLiees}</Typography>
              <Typography variant="body2">Total Demandes</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule fontSize="large" color="warning" />
              <Typography variant="h4">{mockStats.demandesEnCours}</Typography>
              <Typography variant="body2">En cours</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle fontSize="large" color="success" />
              <Typography variant="h4">{mockStats.demandesApprouvees}</Typography>
              <Typography variant="body2">Approuvées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Cancel fontSize="large" color="error" />
              <Typography variant="h4">{mockStats.demandesRejettees}</Typography>
              <Typography variant="body2">Rejetées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Business fontSize="large" color="secondary" />
              <Typography variant="h4">{mockStats.importateursPartenaires}</Typography>
              <Typography variant="body2">Partenaires</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp fontSize="large" color="info" />
              <Typography variant="h4">{(mockStats.valeurTotaleDemandes / 1000).toFixed(0)}K</Typography>
              <Typography variant="body2">Valeur (DH)</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphique de progression (mockée) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Taux de réussite COC
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={80} 
                    color="success"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">80%</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                4 demandes approuvées sur 5 traitées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Délai moyen de traitement
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                7 jours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Délai moyen pour le traitement des demandes COC
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Demandes récentes */}
      <Typography variant="h5" gutterBottom>
        Demandes Récentes
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {mockRecentDemandes.map((demande) => (
          <Grid item xs={12} md={4} key={demande.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {demande.numero}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(demande.statut)}
                    label={getStatusText(demande.statut)}
                    color={getStatusColor(demande.statut)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Importateur:</strong> {demande.importateur}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Produit:</strong> {demande.produit}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Valeur:</strong> {demande.valeur.toLocaleString()} DH
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date:</strong> {new Date(demande.date).toLocaleDateString('fr-FR')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" disabled>
                  Voir détails
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Actions disponibles */}
      <Typography variant="h5" gutterBottom>
        Actions Disponibles
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Visibility fontSize="large" color="primary" />
              </Box>
              <Typography variant="h6" gutterBottom>
                Consulter Toutes les Demandes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Voir l'historique complet des demandes COC
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                variant="contained"
                size="large"
                disabled
              >
                Bientôt disponible
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Business fontSize="large" color="secondary" />
              </Box>
              <Typography variant="h6" gutterBottom>
                Gérer les Partenariats
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Collaborer avec vos importateurs partenaires
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                variant="contained"
                size="large"
                disabled
              >
                Bientôt disponible
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <TrendingUp fontSize="large" color="info" />
              </Box>
              <Typography variant="h6" gutterBottom>
                Statistiques Avancées
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyser les performances de vos exportations
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                variant="contained"
                size="large"
                disabled
              >
                Bientôt disponible
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Informations compte */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informations Compte Exportateur
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><strong>Nom/Raison sociale:</strong> {user?.nom}</Typography>
            <Typography><strong>Email:</strong> {user?.email}</Typography>
            <Typography><strong>Type de compte:</strong> {user?.typeUser}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Statut:</strong> <Chip label="Actif" color="success" size="small" /></Typography>
            <Typography><strong>Plateforme:</strong> PortNet COC</Typography>
            <Typography><strong>Support:</strong> support@portnet.ma</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Développement en cours:</strong> Les fonctionnalités complètes pour les exportateurs 
          seront bientôt disponibles. Vous pourrez consulter en détail toutes les demandes COC, 
          collaborer avec vos partenaires importateurs et accéder à des statistiques avancées.
        </Typography>
      </Alert>
    </Box>
  );
};

export default DashboardExportateur;