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
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, Refresh, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { STATUS_DEMANDE } from '../../utils/constants';

const DemandesExportateur = () => {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulation de chargement des demandes pour l'exportateur
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        setLoading(true);
        
        // Simulation API call - adapter selon votre backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const demandesSimulees = [
          {
            id: 1,
            numeroDemande: 'COC-2024-123456',
            dateCreation: '2024-12-15T10:30:00Z',
            importateurNom: 'Société Import Maroc',
            status: STATUS_DEMANDE.DEPOSE,
            bureauControle: 'TUV',
            marchandises: [
              { nomProduit: 'Lampe LED', categorie: 'Équipements d\'éclairage' },
              { nomProduit: 'Jouet Robot', categorie: 'Jouets et articles pour enfants' }
            ],
            decisionGlobale: null,
          },
          {
            id: 2,
            numeroDemande: 'COC-2024-123457',
            dateCreation: '2024-12-14T14:20:00Z',
            importateurNom: 'Global Import SARL',
            status: STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT,
            bureauControle: 'ECF',
            marchandises: [
              { nomProduit: 'T-shirts coton bio', categorie: 'Textile et habillement' }
            ],
            decisionGlobale: null,
          },
          {
            id: 3,
            numeroDemande: 'COC-2024-123455',
            dateCreation: '2024-12-13T09:15:00Z',
            importateurNom: 'Commerce International',
            status: STATUS_DEMANDE.CLOTURE,
            bureauControle: 'SGS',
            marchandises: [
              { nomProduit: 'Équipement médical', categorie: 'Produits pharmaceutiques et cosmétiques' }
            ],
            decisionGlobale: 'CONFORME',
          },
        ];
        
        setDemandes(demandesSimulees);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des demandes');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case STATUS_DEMANDE.DEPOSE:
        return 'info';
      case STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT:
        return 'warning';
      case STATUS_DEMANDE.CLOTURE:
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case STATUS_DEMANDE.DEPOSE:
        return 'Déposée';
      case STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT:
        return 'En cours';
      case STATUS_DEMANDE.CLOTURE:
        return 'Clôturée';
      default:
        return status;
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleVoirDetails = (demandeId) => {
    navigate(`/exportateur/demande/${demandeId}`);
  };

  const handleNouvelleDemande = () => {
    navigate('/exportateur/demande/nouvelle');
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des demandes...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4">
            Mes Demandes COC
          </Typography>
          <Typography variant="body2" color="text.secondary">
            En tant qu'exportateur, consultez le statut de vos demandes COC
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleNouvelleDemande}
          >
            Nouvelle Demande
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistiques rapides */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip 
          label={`${demandes.length} demandes au total`}
          color="primary"
          variant="outlined"
        />
        <Chip 
          label={`${demandes.filter(d => d.status === STATUS_DEMANDE.DEPOSE).length} en attente`}
          color="info"
          variant="outlined"
        />
        <Chip 
          label={`${demandes.filter(d => d.status === STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT).length} en cours`}
          color="warning"
          variant="outlined"
        />
        <Chip 
          label={`${demandes.filter(d => d.status === STATUS_DEMANDE.CLOTURE).length} terminées`}
          color="success"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Importateur</TableCell>
              <TableCell>Bureau de contrôle</TableCell>
              <TableCell>Marchandises</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Décision</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {demandes.map((demande) => (
              <TableRow key={demande.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {demande.numeroDemande}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>{demande.importateurNom}</TableCell>
                <TableCell>{demande.bureauControle || 'En attente'}</TableCell>
                <TableCell>
                  <Box>
                    <Chip
                      label={`${demande.marchandises.length} article(s)`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Box sx={{ mt: 1 }}>
                      {demande.marchandises.slice(0, 2).map((marchandise, index) => (
                        <Typography key={index} variant="caption" display="block" color="text.secondary">
                          • {marchandise.nomProduit}
                        </Typography>
                      ))}
                      {demande.marchandises.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                          ... et {demande.marchandises.length - 2} autre(s)
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(demande.status)}
                    color={getStatusColor(demande.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {demande.decisionGlobale ? (
                    <Chip
                      label={demande.decisionGlobale}
                      color={demande.decisionGlobale === 'CONFORME' ? 'success' : 'error'}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      En attente
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleVoirDetails(demande.id)}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {demandes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Aucune demande trouvée
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Vous n'avez pas encore soumis de demande COC
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleNouvelleDemande}
                    >
                      Créer ma première demande
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Informations pour l'exportateur */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          📋 Processus COC pour Exportateurs
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>1. Soumission :</strong> Vous pouvez soumettre une demande COC en collaboration avec votre importateur au Maroc.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>2. Traitement :</strong> La demande sera automatiquement affectée à un bureau de contrôle (TUV, ECF, AFNOR, ICUM, SGS).
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>3. Contrôle :</strong> Un agent contrôlera la conformité de vos produits selon les normes marocaines.
        </Typography>
        <Typography variant="body2">
          <strong>4. Résultat :</strong> Vous recevrez le certificat de conformité une fois le contrôle terminé.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DemandesExportateur;