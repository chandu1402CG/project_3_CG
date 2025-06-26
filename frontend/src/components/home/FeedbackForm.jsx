import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Rating,
  FormHelperText,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import { submitTestimonial } from '../../services/api';

const ROLE_OPTIONS = [
  'Parent',
  'Working Parent',
  'Pet Owner',
  'Elder Care Client',
  'Son/Daughter of Elder Care Client',
  'Working Professional',
  'Other'
];

const FeedbackForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5
  });

  const [customRole, setCustomRole] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRatingChange = (_, newValue) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      role: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Feedback content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Feedback must be at least 10 characters long';
    }
    
    if (!formData.rating) {
      newErrors.rating = 'Please provide a rating';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // For "Other" role, use the customRole value
      const submissionData = {
        ...formData,
        role: formData.role === 'Other' ? customRole : formData.role
      };
      
      console.log('Submitting testimonial:', submissionData);
      
      // Call API to submit feedback using our service function
      const newTestimonial = await submitTestimonial(submissionData);
      console.log('Testimonial submission response:', newTestimonial);
      
      // Success
      setSnackbar({
        open: true,
        message: 'Thank you for your feedback!',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        role: '',
        content: '',
        rating: 5
      });
      setCustomRole('');
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(newTestimonial);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to submit feedback. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2, overflow: 'visible' }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Share Your Experience
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          We value your feedback! Please share your experience with our services to help us improve and help others make informed decisions.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          
          <FormControl 
            fullWidth 
            margin="normal" 
            variant="outlined" 
            error={!!errors.role} 
            required
          >
            <InputLabel>Your Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              label="Your Role"
            >
              {ROLE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
            {errors.role && (
              <FormHelperText>{errors.role}</FormHelperText>
            )}
          </FormControl>
          
          {formData.role === 'Other' && (
            <TextField
              fullWidth
              label="Specify Your Role"
              value={customRole}
              onChange={(e) => {
                setCustomRole(e.target.value);
                setFormData(prev => ({ ...prev, role: e.target.value }));
              }}
              margin="normal"
              variant="outlined"
            />
          )}
          
          <TextField
            fullWidth
            label="Your Feedback"
            name="content"
            value={formData.content}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            error={!!errors.content}
            helperText={errors.content}
            required
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography component="legend" sx={{ mb: 1 }}>Your Rating</Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
              precision={1}
              size="large"
            />
            {errors.rating && (
              <FormHelperText error>{errors.rating}</FormHelperText>
            )}
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Submit Feedback'}
          </Button>
        </Box>
      </CardContent>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default FeedbackForm;
