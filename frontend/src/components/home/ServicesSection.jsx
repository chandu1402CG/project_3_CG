import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Alert, Fade, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ServiceCard from '../ServiceCard';
import { fetchServices } from '../../services/api';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

// Autoplay wrapper for SwipeableViews
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const ServicesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const servicesData = await fetchServices();
        setServices(servicesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(63, 81, 181, 0.03)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in={true} timeout={1000}>
            <Typography 
              variant="overline" 
              component="div" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 600, 
                letterSpacing: 2,
                mb: 1 
              }}
            >
              WHAT WE OFFER
            </Typography>
          </Fade>

          <Fade in={true} timeout={1500}>
            <Typography 
              variant="h3"
              component="h2"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                mt: 2,
                position: "relative",
                display: "inline-block",
                backgroundImage: "linear-gradient(45deg, #3f51b5, #f50057)",
                backgroundSize: "100%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 5px rgba(0,0,0,0.1)",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "80px",
                  height: "4px",
                  bottom: "-15px",
                  left: "calc(50% - 40px)",
                  background: "linear-gradient(45deg, #3f51b5, #f50057)",
                  borderRadius: "2px",
                },
              }}
            >
              Our Services
            </Typography>
          </Fade>
          
          <Fade in={true} timeout={2000}>
            <Typography 
              variant="body1" 
              align="center" 
              paragraph 
              sx={{ 
                mt: 4,
                mb: 5, 
                maxWidth: 800, 
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.7
              }}
            >
              We offer a range of child care services to meet your family's needs, from infant care to after-school programs.
              Our programs are designed to nurture your child's development at every age and stage.
            </Typography>
          </Fade>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
            {error}
          </Alert>
        ) : (
          <Box sx={{ 
            position: 'relative', 
            mt: 8,
            maxWidth: '900px',
            mx: 'auto'
          }}>
            {/* Carousel Navigation Buttons */}
            {services.length > 0 && (
              <IconButton 
                onClick={() => setActiveStep((prevActiveStep) => 
                  (prevActiveStep - 1 + services.length) % services.length
                )}
                sx={{
                  position: 'absolute',
                  left: { xs: -16, md: -60 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'background.paper',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  zIndex: 2,
                  '&:hover': {
                    bgcolor: 'background.paper',
                  }
                }}
                size={isMobile ? "small" : "medium"}
              >
                <ArrowBackIosNewIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            )}

            <AutoPlaySwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeStep}
              onChangeIndex={setActiveStep}
              enableMouseEvents
              interval={6000}
              resistance
            >
              {services.map((service) => (
                <Fade in={true} timeout={1000} key={service.id}>
                  <Box 
                    sx={{ 
                      px: { xs: 2, md: 4 },
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Box sx={{ maxWidth: 500, width: '100%' }}>
                      <ServiceCard service={service} />
                    </Box>
                  </Box>
                </Fade>
              ))}
            </AutoPlaySwipeableViews>
            
            {services.length > 0 && (
              <IconButton 
                onClick={() => setActiveStep((prevActiveStep) => 
                  (prevActiveStep + 1) % services.length
                )}
                sx={{
                  position: 'absolute',
                  right: { xs: -16, md: -60 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'background.paper',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  zIndex: 2,
                  '&:hover': {
                    bgcolor: 'background.paper',
                  }
                }}
                size={isMobile ? "small" : "medium"}
              >
                <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            )}
            
            {/* Carousel Indicators */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              {services.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setActiveStep(index)}
                  sx={{
                    width: index === activeStep ? 24 : 12,
                    height: 8,
                    borderRadius: 4,
                    mx: 0.5,
                    bgcolor: index === activeStep ? 'primary.main' : 'grey.300',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        <Fade in={true} timeout={3000}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Button 
              component={RouterLink} 
              to="/services" 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ 
                px: 5, 
                py: 1.5, 
                borderRadius: 2,
                fontWeight: 600,
                letterSpacing: 0.5,
                boxShadow: '0 4px 14px rgba(63, 81, 181, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(63, 81, 181, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              endIcon={<Box component="span" sx={{ ml: 0.5 }}>→</Box>}
            >
              View All Services
            </Button>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default ServicesSection;
