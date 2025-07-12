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
        </Typography>
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
    </Drawer>
  );
};

export default Sidebar;
