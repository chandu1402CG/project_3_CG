import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, CircularProgress, Alert, Fade } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ServiceCard from '../ServiceCard';
import { fetchServices } from '../../services/api';

const ServicesSection = () => {
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
          <Fade in={true} timeout={2500}>
            <Box>
              <Grid container spacing={4}>
                {services.slice(0, 3).map((service, index) => (
                  <Grid item xs={12} sm={6} md={4} key={service.id}>
                    <Fade in={true} timeout={1000 + (index * 500)}>
                      <Box sx={{ height: '100%' }}>
                        <ServiceCard service={service} />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}
        
        <Fade in={true} timeout={3000}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
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
                  boxShadow: '0 6px 20px rgba(63, 81, 181, 0.4)'
                }
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
