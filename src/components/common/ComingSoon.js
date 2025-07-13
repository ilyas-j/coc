import React from 'react';
import { Box, Typography, Alert, Card, CardContent } from '@mui/material';
import { Construction } from '@mui/icons-material';

const ComingSoon = ({ title, description }) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Construction fontSize="large" color="warning" sx={{ mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {description || 'Cette fonctionnalité est en cours de développement...'}
          </Typography>
          <Alert severity="info">
            <Typography variant="body2">
              Cette page sera bientôt disponible. Merci de votre patience !
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ComingSoon;