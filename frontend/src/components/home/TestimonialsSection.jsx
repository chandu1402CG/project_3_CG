import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Divider, Fade, IconButton, useTheme, useMediaQuery, Paper, CircularProgress, Rating, Grid } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Logo from '/Logo.png';
import { fetchTestimonials } from '../../services/api';
import FeedbackForm from './FeedbackForm';

// Autoplay wrapper for SwipeableViews
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const TestimonialsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonialsData = async () => {
    try {
      console.log('Fetching testimonials data...');
      const data = await fetchTestimonials();
      console.log('Testimonials data received:', data);
      if (!data || !Array.isArray(data)) {
        console.error('Invalid testimonials data format:', data);
        setError('Received invalid testimonials data format');
        setTestimonials([]);
      } else {
        setTestimonials(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonialsData();
  }, []);

  const handleFeedbackSubmitted = (newTestimonial) => {
    // Add the new testimonial to the existing list
    setTestimonials((currentTestimonials) => [
      ...currentTestimonials,
      newTestimonial
    ]);
    
    // Set the active step to the newly added testimonial
    setActiveStep(testimonials.length);
  };

  const maxSteps = testimonials.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: 'background.paper',
        backgroundImage: `linear-gradient(rgba(255,255,255,0.97), rgba(255,255,255,0.97)), url(${Logo})`,
        backgroundSize: '300px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '120%',
          height: '120%',
          background: 'radial-gradient(circle, rgba(63, 81, 181, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }
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
              What Parents Say
            </Typography>
          </Fade>
        </Box>
        
        <Box sx={{ 
          position: 'relative', 
          mt: 8,
          maxWidth: '800px',
          mx: 'auto'
        }}>
          {/* Carousel Navigation Buttons */}
          {!loading && testimonials.length > 0 && (
            <IconButton 
              onClick={handleBack}
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
            onChangeIndex={handleStepChange}
            enableMouseEvents
            interval={6000}
          >
{loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            ) : (
              testimonials.map((testimonial) => (
                <Box key={testimonial.id} sx={{ px: { xs: 2, md: 4 } }}>
                  <Fade in={true} timeout={1000}>
                    <Card elevation={3} sx={{ 
                      borderRadius: 3,
                      position: 'relative',
                      minHeight: '300px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    }}>
                      <Box sx={{ 
                        position: 'absolute', 
                        top: -15, 
                        left: 20,
                        fontSize: '5rem',
                        color: 'primary.main',
                        opacity: 0.2,
                        fontFamily: 'serif',
                        fontWeight: 'bold'
                      }}>
                        "
                      </Box>
                      <CardContent sx={{ px: 4, py: 5 }}>
                        <Typography variant="body1" paragraph sx={{ 
                          fontStyle: 'italic', 
                          fontSize: { xs: '1.1rem', md: '1.25rem' },
                          lineHeight: 1.6,
                          mb: 3,
                          textAlign: 'center'
                        }}>
                          "{testimonial.content}"
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <Rating value={testimonial.rating} readOnly />
                        </Box>
                        <Divider sx={{ mb: 2, mx: 'auto', width: '80%' }} />
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Box>
              ))
            )}
          </AutoPlaySwipeableViews>
          
          {!loading && testimonials.length > 0 && (
            <IconButton 
              onClick={handleNext}
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
          {!loading && !error && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => handleStepChange(index)}
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
          )}
        </Box>
        
        {/* Feedback Form Section */}
        <Box sx={{ mt: 10 }}>
          <Fade in={true} timeout={1000}>
            <Typography 
              variant="h4" 
              component="h3" 
              align="center" 
              sx={{ 
                mb: 5,
                fontWeight: 600,
                backgroundImage: "linear-gradient(45deg, #3f51b5, #f50057)",
                backgroundSize: "100%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Share Your Experience
            </Typography>
          </Fade>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
              <FeedbackForm onSubmitSuccess={handleFeedbackSubmitted} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
