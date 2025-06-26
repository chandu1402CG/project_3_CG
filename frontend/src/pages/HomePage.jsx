import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import { fetchServices, fetchCareCenters } from '../services/api';
import Logo from '/Logo.png';
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
  Alert,
  Fade,
  Avatar,
  Divider
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
      <Box 
        sx={{ 
          position: 'relative', 
          overflow: 'hidden',
          bgcolor: '#1e40af',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
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
                boxShadow: '0 4px 14px rgba(245, 0, 87, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(245, 0, 87, 0.6)',
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
          opacity: 0.05, 
          zIndex: 0, 
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px), radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
          pointerEvents: 'none'
        }} />
      </Box>

      <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
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
                WHO WE ARE
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
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '60px',
                    height: '4px',
                    bottom: '-10px',
                    left: 'calc(50% - 30px)',
                    backgroundColor: 'secondary.main'
                  }
                }}
              >
                Welcome to Helping Hands Child Care
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
                At Helping Hands Child Care, we believe every child deserves the best start in life. 
                Our centers provide safe, nurturing environments where children can learn, play, and grow.
                With both corporate and community care models, we offer flexible options to meet the needs of all families.
              </Typography>
            </Fade>
          </Box>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Fade in={true} timeout={1000}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    textAlign: 'center', 
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      width: 70, 
                      height: 70, 
                      fontSize: '2rem',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 4px 10px rgba(63, 81, 181, 0.3)'
                    }}
                  >
                    <ShieldIcon fontSize="inherit" />
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    Safe & Secure
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    State-of-the-art security systems and strict check-in/out procedures
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Fade in={true} timeout={1500}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    textAlign: 'center', 
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      width: 70, 
                      height: 70, 
                      fontSize: '2rem',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 4px 10px rgba(63, 81, 181, 0.3)'
                    }}
                  >
                    <LocalDiningIcon fontSize="inherit" />
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    Nutritious Meals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Healthy, balanced meals and snacks prepared fresh daily
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Fade in={true} timeout={2000}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    textAlign: 'center', 
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      width: 70, 
                      height: 70, 
                      fontSize: '2rem',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 4px 10px rgba(63, 81, 181, 0.3)'
                    }}
                  >
                    <MenuBookIcon fontSize="inherit" />
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    Educational Programs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Age-appropriate learning activities and curriculum
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Fade in={true} timeout={2500}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    textAlign: 'center', 
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      width: 70, 
                      height: 70, 
                      fontSize: '2rem',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 4px 10px rgba(63, 81, 181, 0.3)'
                    }}
                  >
                    <EmojiEmotionsIcon fontSize="inherit" />
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    Caring Staff
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Experienced, qualified caregivers who love working with children
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

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
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '60px',
                    height: '4px',
                    bottom: '-10px',
                    left: 'calc(50% - 30px)',
                    backgroundColor: 'secondary.main'
                  }
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

      <Box 
        component="section" 
        sx={{ 
          py: { xs: 8, md: 12 }, 
          bgcolor: 'background.paper',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(${Logo})`,
          backgroundSize: '300px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
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
                TESTIMONIALS
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
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '60px',
                    height: '4px',
                    bottom: '-10px',
                    left: 'calc(50% - 30px)',
                    backgroundColor: 'secondary.main'
                  }
                }}
              >
                What Parents Say
              </Typography>
            </Fade>
          </Box>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Fade in={true} timeout={1000}>
                <Card elevation={3} sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  position: 'relative',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    position: 'absolute', 
                    top: -15, 
                    left: 20,
                    fontSize: '4rem',
                    color: 'primary.main',
                    opacity: 0.3,
                    fontFamily: 'serif'
                  }}>
                    "
                  </Box>
                  <CardContent sx={{ px: 4, py: 5 }}>
                    <Typography variant="body1" paragraph sx={{ 
                      fontStyle: 'italic', 
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      mb: 3
                    }}>
                      "Helping Hands has been a lifesaver for our family. The staff is amazing and our daughter loves going there every day!"
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Sarah Johnson
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Parent of 4-year-old
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Fade in={true} timeout={1500}>
                <Card elevation={3} sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  position: 'relative',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    position: 'absolute', 
                    top: -15, 
                    left: 20,
                    fontSize: '4rem',
                    color: 'primary.main',
                    opacity: 0.3,
                    fontFamily: 'serif'
                  }}>
                    "
                  </Box>
                  <CardContent sx={{ px: 4, py: 5 }}>
                    <Typography variant="body1" paragraph sx={{ 
                      fontStyle: 'italic', 
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      mb: 3
                    }}>
                      "The educational program is exceptional. Our son has learned so much since starting at Helping Hands."
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Michael Chen
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Parent of 5-year-old
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Fade in={true} timeout={2000}>
                <Card elevation={3} sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  position: 'relative',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    position: 'absolute', 
                    top: -15, 
                    left: 20,
                    fontSize: '4rem',
                    color: 'primary.main',
                    opacity: 0.3,
                    fontFamily: 'serif'
                  }}>
                    "
                  </Box>
                  <CardContent sx={{ px: 4, py: 5 }}>
                    <Typography variant="body1" paragraph sx={{ 
                      fontStyle: 'italic', 
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      mb: 3
                    }}>
                      "As a working parent, I appreciate the flexible hours and the peace of mind knowing my children are in good hands."
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Lisa Rodriguez
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Parent of twins
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

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
                Ready to Join Our Family?
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
                Register today to explore our care centers and schedule a visit.
                Our staff are excited to welcome you and your child!
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
                
                <Button 
                  component={RouterLink} 
                  to="/care-centers" 
                  variant="outlined" 
                  color="inherit"
                  size="large"
                  sx={{ 
                    px: 5, 
                    py: 1.5, 
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(255,255,255,0.1)'
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
    </Box>
  );
};

export default HomePage;
