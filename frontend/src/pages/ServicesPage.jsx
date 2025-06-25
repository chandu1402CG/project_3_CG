import { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import { fetchServices } from '../services/api';
import Hero from '../components/Hero';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper,
  CircularProgress,
  Alert 
} from '@mui/material';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const servicesData = await fetchServices();
        setServices(servicesData);
        setError(null);
      } catch (err) {
        console.error('Error loading services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <Box>
      <Hero 
        title="Our Services" 
        subtitle="Quality care for children of all ages"
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Child Care Services
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            At Helping Hands Child Care, we offer a variety of programs designed to meet the needs of children at different developmental stages.
            Our experienced staff provide nurturing care and educational activities to help your child grow and learn.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {services.map(service => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <ServiceCard service={service} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 3 }}>
            Why Choose Our Programs?
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h4" gutterBottom>
                  Qualified Staff
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All our caregivers are certified in early childhood education and regularly participate in professional development.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h4" gutterBottom>
                  Low Child-to-Staff Ratios
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We maintain low ratios to ensure each child receives the attention and care they deserve.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h4" gutterBottom>
                  Developmental Approach
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our programs are designed to support children's physical, social, emotional, and cognitive development.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h4" gutterBottom>
                  Flexible Scheduling
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We offer full-time and part-time options to accommodate your family's needs.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesPage;
