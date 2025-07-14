import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { 
  Add, 
  Business, 
  Email, 
  Phone, 
  LocationOn,
  Assignment,
  TrendingUp 
} from '@mui/icons-material';

const PartenairesExportateur = () => {
  const [partenaires, setPartenaires] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPartner, setNewPartner] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    secteur: '',
    typePartenariat: ''
  });

  // Données simulées des partenaires importateurs
  useEffect(() => {
    const partenairesSimules = [
      {
        id: 1,
        nom: 'Société Import Maroc',
        email: 'contact@import-maroc.ma',
        telephone: '+212666123456',
        adresse: '123 Rue du Commerce, Casablanca',
        ville: 'Casablanca',
        secteur: 'Électronique',
        typePartenariat: 'Distributeur Exclusif',
        demandesEnCours: 3,
        derniereCommande: '2024-12-15',
        chiffreAffaires: '2.5M DH'
      },
      {
        id: 2,
        nom: 'Global Import SARL',
        email: 'info@global-import.ma',
        telephone: '+212666234567',
        adresse: '456 Avenue Hassan II, Rabat',
        ville: 'Rabat',
        secteur: 'Textile',
        typePartenariat: 'Partenaire Commercial',
        demandesEnCours: 1,
        derniereCommande: '2024-12-10',
        chiffreAffaires: '1.8M DH'
      },
      {
        id: 3,
        nom: 'Commerce International',
        email: 'contact@commerce-intl.ma',
        telephone: '+212666345678',
        adresse: '789 Boulevard Zerktouni, Casablanca',
        ville: 'Casablanca',
        secteur: 'Agroalimentaire',
        typePartenariat: 'Importateur Agréé',
        demandesEnCours: 0,
        derniereCommande: '2024-11-28',
        chiffreAffaires: '3.2M DH'
      }
    ];
    
    setPartenaires(partenairesSimules);
  }, []);

  const secteurs = [
    'Électronique',
    'Textile et Habillement',
    'Agroalimentaire',
    'Automobile',
    'Chimie',
    'Cosmétiques',
    'Jouets',
    'Équipements industriels',
    'Matériaux de construction',
    'Autre'
  ];

  const typesPartenariat = [
    'Distributeur Exclusif',
    'Partenaire Commercial',
    'Importateur Agréé',
    'Agent Commercial',
    'Représentant Local'
  ];

  const handleInputChange = (field, value) => {
    setNewPartner(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAjouterPartenaire = async () => {
    if (!newPartner.nom || !newPartner.email) {
      alert('Veuillez remplir au moins le nom et l\'email');
      return;
    }

    setLoading(true);
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nouveauPartenaire = {
        id: Date.now(),
        ...newPartner,
        demandesEnCours: 0,
        derniereCommande: 'Nouveau',
        chiffreAffaires: '0 DH'
      };
      
      setPartenaires(prev => [...prev, nouveauPartenaire]);
      setOpenDialog(false);
      setNewPartner({
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        secteur: '',
        typePartenariat: ''
      });
      
      alert('Partenaire ajouté avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'ajout du partenaire');
    } finally {
      setLoading(false);
    }
  };

  const getStatistiques = () => {
    return {
      totalPartenaires: partenaires.length,
      demandesActives: partenaires.reduce((sum, p) => sum + p.demandesEnCours, 0),
      chiffreAffairesTotal: partenaires.reduce((sum, p) => {
        const montant = parseFloat(p.chiffreAffaires.replace(/[^\d.]/g, ''));
        return sum + (isNaN(montant) ? 0 : montant);
      }, 0),
      partenairesActifs: partenaires.filter(p => p.demandesEnCours > 0).length
    };
  };

  const stats = getStatistiques();

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Mes Partenaires Importateurs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez vos relations avec vos partenaires importateurs au Maroc
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Nouveau Partenaire
        </Button>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Business fontSize="large" color="primary" />
              <Typography variant="h4">{stats.totalPartenaires}</Typography>
              <Typography variant="body2">Total Partenaires</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment fontSize="large" color="warning" />
              <Typography variant="h4">{stats.demandesActives}</Typography>
              <Typography variant="body2">Demandes Actives</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp fontSize="large" color="success" />
              <Typography variant="h4">{stats.chiffreAffairesTotal.toFixed(1)}M</Typography>
              <Typography variant="body2">CA Total (DH)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Business fontSize="large" color="info" />
              <Typography variant="h4">{stats.partenairesActifs}</Typography>
              <Typography variant="body2">Partenaires Actifs</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liste des partenaires */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Partenaire</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Localisation</TableCell>
              <TableCell>Secteur</TableCell>
              <TableCell>Type Partenariat</TableCell>
              <TableCell>Activité</TableCell>
              <TableCell>Performance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partenaires.map((partenaire) => (
              <TableRow key={partenaire.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {partenaire.nom}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {partenaire.id}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box display="flex" alignItems="center" mb={0.5}>
                      <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{partenaire.email}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{partenaire.telephone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        {partenaire.ville}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {partenaire.adresse}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={partenaire.secteur} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={partenaire.typePartenariat} 
                    size="small" 
                    color="secondary" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      <strong>{partenaire.demandesEnCours}</strong> demandes en cours
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dernière: {partenaire.derniereCommande}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="500" color="success.main">
                      {partenaire.chiffreAffaires}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Chiffre d'affaires
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {partenaires.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 4 }}>
                    <Business sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Aucun partenaire enregistré
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Commencez par ajouter vos partenaires importateurs au Maroc
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setOpenDialog(true)}
                    >
                      Ajouter mon premier partenaire
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog d'ajout de partenaire */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Ajouter un Nouveau Partenaire</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom/Raison sociale *"
                value={newPartner.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={newPartner.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={newPartner.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ville"
                value={newPartner.ville}
                onChange={(e) => handleInputChange('ville', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                value={newPartner.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Secteur d'activité"
                value={newPartner.secteur}
                onChange={(e) => handleInputChange('secteur', e.target.value)}
              >
                {secteurs.map((secteur) => (
                  <MenuItem key={secteur} value={secteur}>
                    {secteur}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Type de partenariat"
                value={newPartner.typePartenariat}
                onChange={(e) => handleInputChange('typePartenariat', e.target.value)}
              >
                {typesPartenariat.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleAjouterPartenaire}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Ajout...' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Informations utiles */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          🤝 Gestion des Partenariats
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Partenaires stratégiques :</strong> Identifiez et cultivez des relations avec des importateurs fiables au Maroc pour développer votre business.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Suivi des performances :</strong> Surveillez le chiffre d'affaires, les demandes en cours et l'activité de chaque partenaire.
        </Typography>
        <Typography variant="body2">
          <strong>Collaboration COC :</strong> Travaillez ensemble sur les demandes de certificat de conformité pour assurer un processus fluide.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PartenairesExportateur;