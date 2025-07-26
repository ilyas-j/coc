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
  Button,
  Chip,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { PlayArrow, Visibility, Assignment, ManageAccounts, WorkOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { STATUS_DEMANDE, USER_TYPES } from '../../utils/constants';
import { superviseurService } from '../../services/superviseurService';
import { agentService } from '../../services/agentService';

const SuperviseurTraitement = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [traitementActif, setTraitementActif] = useState(false);

  // Récupérer les demandes personnelles du superviseur
  const fetchDemandesPersonnelles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await superviseurService.getMesDemandesPersonnelles();
      setDemandes(response);
      
      // Vérifier si le superviseur a des demandes en cours (mode traitement actif)
      const hasActiveDemandes = response.some(d => 
        d.status === STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT
      );
      setTraitementActif(hasActiveDemandes || response.length > 0);
      
    } catch (err) {
      console.error('Erreur lors du chargement des demandes personnelles:', err);
      setError('Erreur lors du chargement des demandes personnelles');
      setDemandes([]);
    } finally {
      setLoading(false);
    }
  };

  // Hook useEffect sans condition
  useEffect(() => {
    fetchDemandesPersonnelles();
  }, []);

  // Vérification d'autorisation après les hooks
  if (user?.typeUser !== USER_TYPES.SUPERVISEUR) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Alert severity="error">
          Accès réservé aux superviseurs
        </Alert>
      </Box>
    );
  }

  const handlePrendreEnCharge = async (demandeId) => {
    try {
      setLoading(true);
      
      // Utiliser l'API agent pour la prise en charge (le superviseur agit comme un agent)
      await agentService.prendreEnCharge(demandeId);
      
      // Recharger les demandes
      await fetchDemandesPersonnelles();
      
      setError(null);
      alert('Demande prise en charge avec succès !');
    } catch (error) {
      console.error('Erreur prise en charge:', error);
      setError('Erreur lors de la prise en charge');
    } finally {
      setLoading(false);
    }
  };

  const handleTraiterDemande = (demande) => {
    // Naviguer vers la page de traitement (réutiliser la logique agent)
    navigate(`/agent/traiter/${demande.id}`, { 
      state: { demande, isSuperviseur: true }
    });
  };

  const toggleModeTraitement = () => {
    setTraitementActif(!traitementActif);
    if (!traitementActif) {
      // Logique pour activer le mode traitement pour le superviseur
      // (pourrait impliquer une API call pour marquer le superviseur comme disponible pour traitement)
    }
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
          Chargement des demandes personnelles...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Traitement Personnel - Superviseur
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Double rôle superviseur :</strong> En plus de vos fonctions de supervision, 
          vous pouvez traiter personnellement des demandes COC comme un agent. 
          Ces demandes vous sont affectées selon votre disponibilité pour le traitement.
        </Typography>
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Configuration du mode traitement */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Mode Traitement Personnel
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {traitementActif 
                      ? "Vous recevez des demandes pour traitement personnel"
                      : "Mode supervision uniquement - pas de traitement personnel"
                    }
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={traitementActif}
                      onChange={toggleModeTraitement}
                      color="primary"
                    />
                  }
                  label={traitementActif ? "Actif" : "Inactif"}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ManageAccounts fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h6">
                    Charge de Traitement Personnelle
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {demandes.filter(d => d.status !== STATUS_DEMANDE.CLOTURE).length} demandes actives
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Statistiques rapides */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip 
          icon={<Assignment />}
          label={`${demandes.length} demandes au total`}
          color="primary"
          variant="outlined"
        />
        <Chip 
          label={`${demandes.filter(d => d.status === STATUS_DEMANDE.DEPOSE).length} à prendre en charge`}
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

      {!traitementActif && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <WorkOff sx={{ verticalAlign: 'middle', mr: 1 }} />
            Mode traitement personnel désactivé. Activez-le pour recevoir des demandes à traiter.
          </Typography>
        </Alert>
      )}

      {/* Liste des demandes personnelles */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Date Affectation</TableCell>
              <TableCell>Importateur</TableCell>
              <TableCell>Exportateur</TableCell>
              <TableCell>Marchandises</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Délai</TableCell>
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
                  <Typography variant="caption" color="text.secondary">
                    Affectée le {formatDate(demande.dateAffectation)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {formatDate(demande.dateCreation)}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {demande.importateurNom}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {demande.exportateurNom || '-'}
                  </Typography>
                </TableCell>
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
                        {demandes.marchandises && demande.marchandises.length > 2 && (
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
                  {demande.decisionGlobale && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={demande.decisionGlobale}
                        color={demande.decisionGlobale === 'CONFORME' ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {demande.delaiEstime || 'N/A'}
                  </Typography>
                  {demande.dateTraitement && (
                    <Typography variant="caption" color="text.secondary">
                      Démarrée le {formatDate(demande.dateTraitement)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    {demande.status === STATUS_DEMANDE.DEPOSE && traitementActif && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => handlePrendreEnCharge(demande.id)}
                        disabled={loading}
                      >
                        Prendre en charge
                      </Button>
                    )}
                    
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleTraiterDemande(demande)}
                    >
                      {demande.status === STATUS_DEMANDE.DEPOSE ? 'Voir détails' : 
                       demande.status === STATUS_DEMANDE.EN_COURS_DE_TRAITEMENT ? 'Traiter' : 
                       'Voir résultat'}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {demandes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box sx={{ py: 4 }}>
                    <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      {traitementActif 
                        ? "Aucune demande personnelle affectée"
                        : "Mode traitement personnel inactif"
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {traitementActif 
                        ? "Les demandes vous seront affectées selon votre disponibilité"
                        : "Activez le mode traitement pour recevoir des demandes"
                      }
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Informations sur le double rôle */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          👔 Double Rôle Superviseur : Supervision + Traitement
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              <strong>Fonctions de supervision :</strong> Gestion d'équipe, vue d'ensemble bureau, réaffectation des demandes, statistiques.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Traitement personnel :</strong> Vous pouvez également traiter des demandes COC comme un agent, en plus de vos fonctions superviseur.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              <strong>Flexibilité :</strong> Activez/désactivez le mode traitement selon votre charge de supervision.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Priorité :</strong> Vos fonctions de supervision restent prioritaires - le traitement personnel est optionnel.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Actions rapides superviseur */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/superviseur/vue-ensemble')}
        >
          Retour à la supervision
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/superviseur/agents')}
        >
          Gestion des agents
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/superviseur/dashboard')}
        >
          Tableau de bord
        </Button>
      </Box>
    </Box>
  );
};

export default SuperviseurTraitement;