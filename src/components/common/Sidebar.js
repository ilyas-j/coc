import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Add,
  List as ListIcon,
  Assignment,
  SupervisorAccount,
  People,
  Visibility,
  Business,
  Analytics,
  ManageAccounts,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { USER_TYPES } from '../../utils/constants';

const SIDEBAR_WIDTH = 280;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const getMenuItems = () => {
    if (!user) return [];

    const commonItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    ];

    switch (user.typeUser) {
      case USER_TYPES.IMPORTATEUR:
        return [
          ...commonItems,
          { text: 'Nouvelle Demande', icon: <Add />, path: '/demande/nouvelle' },
          { text: 'Mes Demandes', icon: <ListIcon />, path: '/mes-demandes' },
        ];
      
      case USER_TYPES.EXPORTATEUR:
        return [
          ...commonItems,
          { text: 'Nouvelle Demande', icon: <Add />, path: '/demande/nouvelle' },
          { text: 'Mes Demandes', icon: <ListIcon />, path: '/mes-demandes' },
        ];
      
      case USER_TYPES.AGENT:
        // AGENT SEULEMENT - peut traiter des demandes
        return [
          ...commonItems,
          { text: 'Mes Demandes Affectées', icon: <Assignment />, path: '/agent/demandes' },
        ];
      
      case USER_TYPES.SUPERVISEUR:
        // 🎯 SUPERVISEUR - fonctionnalités complètes selon cahier des charges
        return [
          ...commonItems,
          
          // === FONCTIONS PRINCIPALES SUPERVISEUR ===
          { 
            text: '🏢 Vue d\'Ensemble Bureau', 
            icon: <SupervisorAccount />, 
            path: '/superviseur/vue-ensemble',
            primary: true,
            description: 'Toutes les demandes du bureau + réaffectation'
          },
          { 
            text: '📊 Tableau de Bord', 
            icon: <ManageAccounts />, 
            path: '/superviseur/dashboard',
            description: 'KPIs et métriques du bureau'
          },
          { 
            text: '👥 Gestion des Agents', 
            icon: <People />, 
            path: '/superviseur/agents',
            description: 'Équipe et disponibilité'
          },
          { 
            text: '📈 Statistiques Bureau', 
            icon: <Analytics />, 
            path: '/superviseur/statistiques',
            description: 'Analyses et rapports détaillés'
          },
          
          // Divider
          { divider: true },
          
          // === TRAITEMENT PERSONNEL (OPTIONNEL) ===
          { 
            text: '👤 Traitement Personnel', 
            icon: <Assignment />, 
            path: '/superviseur/traitement',
            secondary: true,
            description: 'Double rôle : traiter des demandes personnellement'
          },
        ];
      
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path, disabled) => {
    if (!disabled && path) {
      console.log('🔄 Navigation vers:', path);
      navigate(path);
    }
  };

  const renderMenuItem = (item, index) => {
    // Afficher un divider
    if (item.divider) {
      return (
        <Box key={`divider-${index}`}>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ px: 2, py: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              Traitement Personnel (Optionnel)
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <ListItem key={item.text} disablePadding>
        <ListItemButton
          selected={location.pathname === item.path}
          onClick={() => handleNavigation(item.path, item.disabled)}
          disabled={item.disabled}
          sx={{
            opacity: item.disabled ? 0.5 : 1,
            cursor: item.disabled ? 'not-allowed' : 'pointer',
            bgcolor: item.primary ? 'primary.light' : 'inherit',
            color: item.primary ? 'primary.contrastText' : 'inherit',
            borderLeft: item.primary ? '4px solid' : 'none',
            borderColor: item.primary ? 'primary.main' : 'transparent',
            '&:hover': {
              bgcolor: item.primary ? 'primary.main' : 'action.hover',
            },
            '&.Mui-selected': {
              bgcolor: 'primary.dark',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.text}
            secondary={item.disabled ? "Bientôt disponible" : item.description}
            secondaryTypographyProps={{
              variant: 'caption',
              color: item.primary ? 'inherit' : 'text.secondary'
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? SIDEBAR_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          mt: '64px',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary">
          PortNet COC
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.nom}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.typeUser}
          {user?.typeUser === USER_TYPES.SUPERVISEUR && ' - Double rôle'}
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Alerte importante pour superviseur */}
      {user?.typeUser === USER_TYPES.SUPERVISEUR && (
        <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="caption" fontWeight="bold">
            🎯 Fonctions Superviseur Activées
          </Typography>
          <Typography variant="caption" display="block">
            Vue d'ensemble + Réaffectation disponibles
          </Typography>
        </Box>
      )}
      
      <List>
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </List>

      {/* Footer informations */}
      {user?.typeUser === USER_TYPES.SUPERVISEUR && (
        <Box sx={{ p: 2, mt: 'auto', bgcolor: 'background.default' }}>
          <Typography variant="caption" color="text.secondary">
            💡 <strong>Astuce :</strong> Utilisez "Vue d'Ensemble" pour voir toutes les demandes et réaffecter
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;