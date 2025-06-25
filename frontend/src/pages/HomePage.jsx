import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import { fetchServices, fetchCareCenters } from '../services/api';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, centersData] = await Promise.all([
          fetchServices(),
          fetchCareCenters()
        ]);
        
        setServices(servicesData);
        setCenters(centersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Hero 
        title="Quality Child Care for Every Family" 
        subtitle="Providing nurturing care and early education in a safe, stimulating environment"
        cta={{ text: "Find a Care Center", link: "/care-centers" }}
      />

      <Box component="section" sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Welcome to Helping Hands Child Care
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 5, maxWidth: 800, mx: 'auto' }}>
            At Helping Hands Child Care, we believe every child deserves the best start in life. 
            Our centers provide safe, nurturing environments where children can learn, play, and grow.
            With both corporate and community care models, we offer flexible options to meet the needs of all families.
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', textAlign: 'center', bgcolor: 'rgba(63, 81, 181, 0.05)' }}>
                <Box sx={{ color: 'primary.main', mb: 2, fontSize: '2.5rem' }}>
                  <ShieldIcon fontSize="inherit" />
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  Safe & Secure
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  State-of-the-art security systems and strict check-in/out procedures
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', textAlign: 'center', bgcolor: 'rgba(63, 81, 181, 0.05)' }}>
                <Box sx={{ color: 'primary.main', mb: 2, fontSize: '2.5rem' }}>
                  <LocalDiningIcon fontSize="inherit" />
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  Nutritious Meals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Healthy, balanced meals and snacks prepared fresh daily
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', textAlign: 'center', bgcolor: 'rgba(63, 81, 181, 0.05)' }}>
                <Box sx={{ color: 'primary.main', mb: 2, fontSize: '2.5rem' }}>
                  <MenuBookIcon fontSize="inherit" />
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  Educational Programs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Age-appropriate learning activities and curriculum
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, height: '100%', textAlign: 'center', bgcolor: 'rgba(63, 81, 181, 0.05)' }}>
                <Box sx={{ color: 'primary.main', mb: 2, fontSize: '2.5rem' }}>
                  <EmojiEmotionsIcon fontSize="inherit" />
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  Caring Staff
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Experienced, qualified caregivers who love working with children
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Our Services
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 5, maxWidth: 800, mx: 'auto' }}>
            We offer a range of child care services to meet your family's needs, from infant care to after-school programs.
          </Typography>
          
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
              {services.slice(0, 3).map(service => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <ServiceCard service={service} />
                </Grid>
              ))}
            </Grid>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              component={RouterLink} 
              to="/services" 
              variant="outlined" 
              color="primary"
              size="large"
            >
              View All Services
            </Button>
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            What Parents Say
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={1} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                    "Helping Hands has been a lifesaver for our family. The staff is amazing and our daughter loves going there every day!"
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    - Sarah Johnson
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={1} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                    "The educational program is exceptional. Our son has learned so much since starting at Helping Hands."
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    - Michael Chen
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={1} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                    "As a working parent, I appreciate the flexible hours and the peace of mind knowing my children are in good hands."
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    - Lisa Rodriguez
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box 
        component="section" 
        sx={{ 
          py: 8, 
          bgcolor: 'primary.main', 
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Join Our Family?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Register today to explore our care centers and schedule a visit.
          </Typography>
          <Box sx={{ '& > :not(style)': { mx: 1 } }}>
            <Button 
              component={RouterLink} 
              to="/register" 
              variant="contained" 
              color="secondary"
              size="large"
              sx={{ px: 4 }}
            >
              Register Now
            </Button>
            <Button 
              component={RouterLink} 
              to="/care-centers" 
              variant="outlined" 
              color="inherit"
              size="large"
              sx={{ px: 4 }}
            >
              Find a Care Center
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
