import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Fade,
  Rating,
  FormControl,
  FormHelperText,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HomeIcon from '@mui/icons-material/Home';
import SendIcon from '@mui/icons-material/Send';
import { submitTestimonial } from '../services/api';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Feedback content is required';
    } else if (content.length < 10) {
      newErrors.content = 'Please provide more detailed feedback (at least 10 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const testimonialData = {
        name,
        role,
        content,
        rating
      };
      
      const response = await submitTestimonial(testimonialData);
      
      if (response) {
        setSuccess(true);
        setAlert({
          open: true,
          message: 'Thank you for your feedback! Your testimonial has been submitted successfully.',
          severity: 'success'
        });
        
        // Reset form
        setName('');
        setRole('');
        setContent('');
        setRating(5);
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Error submitting feedback: ${error.message || 'Please try again later.'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: 'background.default',
        minHeight: 'calc(100vh - 64px - 240px)'
      }}
    >
      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 2,
              mb: 4,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <FeedbackIcon
                color="primary"
                sx={{ fontSize: 40, mb: 2 }}
              />
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight={700}
                sx={{
                  backgroundImage: "linear-gradient(45deg, #3f51b5, #f50057)",
                  backgroundSize: "100%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Share Your Experience
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                Your feedback helps us improve our services and assists other parents in making informed decisions.
              </Typography>
            </Box>

            {success ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Thank you for your feedback!
                </Typography>
                <Typography variant="body1" paragraph>
                  Your testimonial has been submitted successfully and will be reviewed shortly.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate("/")}
                  sx={{ mt: 2 }}
                >
                  Return to Home Page
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Your Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="role"
                  label="Your Role (e.g., Parent of toddler)"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  error={!!errors.role}
                  helperText={errors.role}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Typography component="legend" sx={{ mb: 1 }}>
                    Rate Your Experience
                  </Typography>
                  <Rating
                    name="rating"
                    value={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    size="large"
                  />
                </FormControl>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="content"
                  label="Your Feedback"
                  name="content"
                  multiline
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  error={!!errors.content}
                  helperText={errors.content}
                  placeholder="Please share your experience with our services..."
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/")}
                    sx={{ px: 3 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{ px: 4 }}
                  >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Fade>
      </Container>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedbackPage;
