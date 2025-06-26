import React from 'react';
import { Box, Container, Typography, Button, Fade } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '/Logo.png';

const CTASection = ({ isLoggedIn }) => {
  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 10, md: 14 }, 
        bgcolor: 'primary.main', 
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(135deg, rgba(63, 81, 181, 0.95), rgba(33, 33, 150, 0.98))'
      }}
    >
      {/* Background decorative elements */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: `url(${Logo})`,
        backgroundSize: '200px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center right -50px',
        zIndex: 1
      }} />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Fade in={true} timeout={1000}>
          <Box>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              {isLoggedIn ? 'Discover Our Care Centers' : 'Ready to Join Our Family?'}
            </Typography>
            
            <Typography 
              variant="h6" 
              paragraph 
              sx={{ 
                mb: 5,
                maxWidth: 700,
                mx: 'auto',
                opacity: 0.9
              }}
            >
              {isLoggedIn 
                ? 'Thank you for being part of the Helping Hands family. Explore our care centers and find the perfect fit for your child.'
                : 'Register today to explore our care centers and schedule a visit. Our staff are excited to welcome you and your child!'}
            </Typography>
            
            <Box 
              sx={{ 
                '& > :not(style)': { 
                  mx: { xs: 0.5, sm: 1.5 },
                  my: { xs: 1, sm: 0 }
                },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 2, sm: 0 }
              }}
            >
              {!isLoggedIn && (
                <Button 
                  component={RouterLink} 
                  to="/register" 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  sx={{ 
                    px: 5, 
                    py: 1.5, 
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 14px rgba(245, 0, 87, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(245, 0, 87, 0.6)'
                    }
                  }}
                >
                  Register Now
                </Button>
              )}
              
              <Button 
                component={RouterLink} 
                to="/care-centers" 
                variant={isLoggedIn ? "contained" : "outlined"}
                color={isLoggedIn ? "secondary" : "inherit"}
                size="large"
                sx={{ 
                  px: 5, 
                  py: 1.5, 
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderWidth: isLoggedIn ? 0 : 2,
                  boxShadow: isLoggedIn ? '0 4px 14px rgba(245, 0, 87, 0.4)' : 'none',
                  '&:hover': {
                    borderWidth: isLoggedIn ? 0 : 2,
                    backgroundColor: isLoggedIn ? '' : 'rgba(255,255,255,0.1)',
                    boxShadow: isLoggedIn ? '0 6px 20px rgba(245, 0, 87, 0.6)' : 'none'
                  }
                }}
              >
                Find a Care Center
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default CTASection;
