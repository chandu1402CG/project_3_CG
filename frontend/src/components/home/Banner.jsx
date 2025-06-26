import React from 'react';
import { Box, Container, Typography, Button, Fade, keyframes } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Banner = () => {
  const gradientShift = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `;
  
  return (
    <Box 
      sx={{ 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e40af 0%, #3f51b5 55%, #2a4bb0 100%)',
        backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #3f51b5 55%, #2a4bb0 100%), radial-gradient(circle at top right, rgba(245, 0, 87, 0.12), transparent 65%)',
        backgroundSize: '200% 200%',
        animation: `${gradientShift} 15s ease infinite`,
        backgroundBlendMode: 'normal',
        color: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        boxShadow: 'inset 0 -10px 20px -10px rgba(0,0,0,0.2)'
      }}
    >
      <Container maxWidth="lg">
        <Fade in={true} timeout={1500}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' }
            }}
          >
            Quality Child Care for Every Family
          </Typography>
        </Fade>

        <Fade in={true} timeout={2000}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              maxWidth: 800, 
              mx: 'auto',
              opacity: 0.9
            }}
          >
            Providing nurturing care and early education in a safe, stimulating environment
          </Typography>
        </Fade>

        <Fade in={true} timeout={2500}>
          <Button
            component={RouterLink}
            to="/care-centers"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ 
              borderRadius: 2, 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              boxShadow: '0 4px 14px rgba(245, 0, 87, 0.4)',
              background: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
              border: '2px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(245, 0, 87, 0.6)',
                transform: 'translateY(-2px)',
                background: 'linear-gradient(45deg, #f50057 20%, #ff4081 100%)',
              }
            }}
          >
            Find a Care Center
          </Button>
        </Fade>
      </Container>
      
      {/* Background pattern */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        opacity: 0.06, 
        zIndex: 0, 
        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px), radial-gradient(circle, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
        pointerEvents: 'none'
      }} />
      
      {/* Additional decorative element */}
      <Box 
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 0, 87, 0.2) 0%, rgba(245, 0, 87, 0.05) 50%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
    </Box>
  );
};

export default Banner;
