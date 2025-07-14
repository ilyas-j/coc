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
  Business,
  Public,
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
          { text: 'Nouvelle Demande', icon: <Add />, path: '/exportateur/demande/nouvelle' },
          { text: 'Mes Demandes', icon: <ListIcon />, path: '/exportateur/demandes' },
          { text: 'Mes Partenaires', icon: <Business />, path: '/exportateur/partenaires' },
        ];
      
      case USER_TYPES.AGENT:
        return [
          ...commonItems,
          { text: 'Demandes à Traiter', icon: <Assignment />, path: '/agent/demandes' },
          { text: 'Supervision Bureau', icon: <SupervisorAccount />, path: '/superviseur/dashboard' },
          { text: 'Gestion Agents', icon: <People />, path: '/superviseur/agents' },
        ];
      
      case USER_TYPES.SUPERVISEUR:
        return [
          ...commonItems,
          { text: 'Demandes à Traiter', icon: <Assignment />, path: '/agent/demandes' },
          { text: 'Supervision Bureau', icon: <SupervisorAccount />, path: '/superviseur/dashboard' },
          { text: 'Gestion Agents', icon: <People />, path: '/superviseur/agents' },
        ];
      
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getUserTypeLabel = (typeUser) => {
    switch (typeUser) {
      case USER_TYPES.IMPORTATEUR:
        return 'Importateur';
      case USER_TYPES.EXPORTATEUR:
        return 'Exportateur';
      case USER_TYPES.AGENT:
        return 'Agent';
      case USER_TYPES.SUPERVISEUR:
        return 'Superviseur';
      default:
        return typeUser;
    }
  };

  const getUserTypeIcon = (typeUser) => {
    switch (typeUser) {
      case USER_TYPES.IMPORTATEUR:
        return <Business color="primary" />;
      case USER_TYPES.EXPORTATEUR:
        return <Public color="secondary" />;
      case USER_TYPES.AGENT:
        return <Assignment color="warning" />;
      case USER_TYPES.SUPERVISEUR:
        return <SupervisorAccount color="success" />;
      default:
        return <Dashboard />;
    }
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
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
          {getUserTypeIcon(user?.typeUser)}
          <Box sx={{ ml: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {user?.nom}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getUserTypeLabel(user?.typeUser)}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Informations spécifiques au rôle */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        {user?.typeUser === USER_TYPES.EXPORTATEUR && (
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              🌍 Exportateur International
            </Typography>
            <Typography variant="body2" fontSize="0.75rem">
              Collaborez avec vos partenaires importateurs pour les demandes COC
            </Typography>
          </Box>
        )}
        
        {user?.typeUser === USER_TYPES.IMPORTATEUR && (
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              🏢 Importateur Maroc
            </Typography>
            <Typography variant="body2" fontSize="0.75rem">
              Soumettez vos demandes COC pour vos importations
            </Typography>
          </Box>
        )}

        {(user?.typeUser === USER_TYPES.AGENT || user?.typeUser === USER_TYPES.SUPERVISEUR) && (
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              🔍 Bureau de Contrôle
            </Typography>
            <Typography variant="body2" fontSize="0.75rem">
              Contrôlez la conformité des marchandises
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;