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
} from '@mui/material';
import { PlayArrow, Visibility, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { STATUS_DEMANDE } from '../../utils/constants';
import { demandeService } from '../../services/demandeService';

const DemandesAgent = () => {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les demandes affectées à l'agent depuis le backend
  const fetchDemandes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await demandeService.getDemandesAgent();
      setDemandes(response);
    } catch (err) {
      console.error('Erreur lors du chargement des demandes:', err);
      setError('Erreur lors du chargement des demandes affectées');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  const handlePrendreEnCharge = async (demandeId) => {
    try {
      setLoading(true);
      
      await demandeService.prendreEnCharge(demandeId);
      
      // Mettre à jour la liste des demandes
      await fetchDemandes();
      
      setError(null);
      // Optionnel: afficher un message de succès
      alert('Demande prise en charge avec succès !');
    } catch (error) {
      console.error('Erreur prise en charge:', error);
      setError('Erreur lors de la prise en charge');
    } finally {
      setLoading(false);
    }
  };

  const handleVoirDetails = (demande) => {
    // Naviguer vers la page de traitement
    navigate(`/agent/traiter/${demande.id}`, { 
      state: { demande } 
    });
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
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mes Demandes Affectées
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Demandes COC qui vous sont affectées automatiquement selon votre disponibilité et charge de travail
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Date création</TableCell>
              <TableCell>Importateur</TableCell>
              <TableCell>Exportateur</TableCell>
              <TableCell>Marchandises</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Délai estimé</TableCell>
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
                <TableCell>{demande.importateurNom}</TableCell>
                <TableCell>{demande.exportateurNom}</TableCell>
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
                    {demande.status === STATUS_DEMANDE.DEPOSE && (
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
                      onClick={() => handleVoirDetails(demande)}
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
                      Aucune demande affectée
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Les demandes vous seront affectées automatiquement selon votre disponibilité
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Informations sur le processus */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          📋 Processus de traitement
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>1. Affectation automatique :</strong> Les demandes vous sont affectées selon un algorithme qui prend en compte votre disponibilité, vos congés et votre charge de travail actuelle.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>2. Prise en charge :</strong> Cliquez sur "Prendre en charge" pour démarrer le traitement d'une demande (statut passe de "Déposée" à "En cours").
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>3. Traitement :</strong> Donnez un avis de conformité pour chaque marchandise : Conforme, Non conforme, ou Conforme avec réserve.
        </Typography>
        <Typography variant="body2">
          <strong>4. Finalisation :</strong> Une fois tous les avis donnés, la décision globale est calculée automatiquement et le dossier est clôturé.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DemandesAgent;