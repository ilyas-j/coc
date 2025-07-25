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
import { useSelector } from 'react-redux';
import { STATUS_DEMANDE, USER_TYPES } from '../../utils/constants';
import { demandeService } from '../../services/demandeService';

const MesDemandesList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les demandes depuis le backend
  const fetchDemandes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Récupération des demandes pour:', user?.email, '(Type:', user?.typeUser, ')');
      
      const response = await demandeService.getMesDemandesUtilisateur();
      console.log('✅ Demandes récupérées:', response);
      
      setDemandes(response || []);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des demandes:', err);
      
      // Gestion spécifique des erreurs
      if (err.status === 404) {
        setError('Aucune demande trouvée. Vous pouvez créer votre première demande.');
      } else if (err.status === 403) {
        setError('Accès non autorisé. Vérifiez vos permissions.');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Erreur de connexion au serveur. Vérifiez que le backend est démarré.');
      } else {
        setError(err.message || 'Erreur lors du chargement des demandes');
      }
      
      // En cas d'erreur, initialiser avec un tableau vide
      setDemandes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDemandes();
    }
  }, [user]);

  const handleRefresh = () => {
    fetchDemandes();
  };

  const handleNouvelleDemande = () => {
    navigate('/demande/nouvelle');
  };

  const handleVoirDetails = (demandeId) => {
    navigate(`/demande/${demandeId}`);
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            {user?.typeUser === USER_TYPES.IMPORTATEUR 
              ? "Vos demandes d'importation COC"
              : "Vos demandes d'exportation COC"
            }
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
            disabled={loading}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
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
              <TableCell>
                {user?.typeUser === USER_TYPES.IMPORTATEUR ? 'Exportateur' : 'Importateur'}
              </TableCell>
              <TableCell>Bureau de contrôle</TableCell>
              <TableCell>Agent</TableCell>
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
                  {formatDate(demande.dateCreation)}
                </TableCell>
                <TableCell>
                  {user?.typeUser === USER_TYPES.IMPORTATEUR 
                    ? (demande.exportateurNom || 'Non renseigné')
                    : (demande.importateurNom || 'Non renseigné')
                  }
                </TableCell>
                <TableCell>{demande.bureauControleNom || 'En attente'}</TableCell>
                <TableCell>{demande.agentNom || 'Non affecté'}</TableCell>
                <TableCell>
                  <Box>
                    <Chip
                      label={`${demande.marchandises?.length || 0} article(s)`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {demande.marchandises && demande.marchandises.length > 0 && (
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
                    )}
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
            {demandes.length === 0 && !loading && !error && (
              <TableRow>
                <TableCell colSpan={9} align="center">
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

      {/* Informations processus */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          📋 Processus COC
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>1. Soumission :</strong> Créez votre demande avec les informations des marchandises
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>2. Affectation :</strong> Un bureau de contrôle et un agent sont automatiquement affectés
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>3. Traitement :</strong> L'agent examine vos marchandises et donne un avis de conformité
        </Typography>
        <Typography variant="body2">
          <strong>4. Résultat :</strong> Vous recevez le certificat de conformité final
        </Typography>
      </Paper>
    </Box>
  );
};

export default MesDemandesList;