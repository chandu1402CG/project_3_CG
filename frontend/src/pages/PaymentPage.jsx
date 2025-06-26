import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Divider, 
  Chip, 
  Avatar, 
  Stepper, 
  Step, 
  StepLabel, 
  InputAdornment,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Icons
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DoneAllIcon from '@mui/icons-material/DoneAll';

// Import logo
import Logo from '/Logo.png';

// Custom styled components
const AnimatedBox = styled(motion.div)(({ theme }) => ({
  width: '100%',
}));

const PaymentMethodCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: selected ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.12)',
  backgroundColor: selected ? 'rgba(63, 81, 181, 0.05)' : theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }
}));

const PaymentBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '8px 16px',
  borderRadius: '20px 0 20px 0',
  fontWeight: 600,
  position: 'absolute',
  top: 0,
  right: 0,
}));

// Payment step components
const steps = ['Payment Details', 'Review', 'Confirmation'];

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for payment flow
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date(),
    name: '',
    organizationName: 'Helping Hands Child Care',
    paymentId: `PAY-${Math.floor(Math.random() * 1000000)}`,
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.amount) errors.amount = 'Amount is required';
    else if (isNaN(Number(formData.amount))) errors.amount = 'Amount must be a number';
    
    if (!formData.name) errors.name = 'Name is required';
    
    if (paymentMethod === 'creditCard') {
      if (!formData.cardNumber) errors.cardNumber = 'Card number is required';
      if (!formData.cardName) errors.cardName = 'Name on card is required';
      if (!formData.cardExpiry) errors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCvv) errors.cardCvv = 'CVV is required';
    }
    
    return errors;
  };
  
  // Handle next step
  const handleNext = () => {
    // For first step, validate form
    if (activeStep === 0) {
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }
    
    // For second step (review), simulate payment processing
    if (activeStep === 1) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setPaymentSuccess(true);
        setActiveStep(activeStep + 1);
      }, 2000);
      return;
    }
    
    setActiveStep(activeStep + 1);
  };
  
  // Handle back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '';
  };
  
  // Handle card number change with formatting
  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = formatCardNumber(input);
    
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
    
    // Clear error
    if (formErrors.cardNumber) {
      setFormErrors(prev => ({
        ...prev,
        cardNumber: ''
      }));
    }
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  // Render payment details step
  const renderPaymentDetails = () => (
    <AnimatedBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Avatar 
          src={Logo} 
          alt="Helping Hands Logo"
          sx={{ 
            width: 80, 
            height: 80,
            mb: 2
          }}
        />
      </Box>
      
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Payment Details
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="amount"
            label="Amount"
            value={formData.amount}
            onChange={handleChange}
            error={!!formErrors.amount}
            helperText={formErrors.amount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker 
              label="Payment Date"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventNoteIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              }
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="name"
            label="Your Name"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="organizationName"
            label="Organization Name"
            value={formData.organizationName}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              ),
              readOnly: true,
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="paymentId"
            label="Payment ID"
            value={formData.paymentId}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ReceiptIcon />
                </InputAdornment>
              ),
              readOnly: true,
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment Method
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <PaymentMethodCard 
                elevation={paymentMethod === 'creditCard' ? 3 : 1}
                selected={paymentMethod === 'creditCard'}
                onClick={() => handlePaymentMethodChange('creditCard')}
              >
                <CreditCardIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle1">Credit Card</Typography>
                  <Typography variant="body2" color="text.secondary">Visa, Mastercard, Amex</Typography>
                </Box>
              </PaymentMethodCard>
            </Grid>
            <Grid item xs={12} sm={6}>
              <PaymentMethodCard 
                elevation={paymentMethod === 'bankTransfer' ? 3 : 1}
                selected={paymentMethod === 'bankTransfer'}
                onClick={() => handlePaymentMethodChange('bankTransfer')}
              >
                <AccountBalanceIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle1">Bank Transfer</Typography>
                  <Typography variant="body2" color="text.secondary">Direct bank payment</Typography>
                </Box>
              </PaymentMethodCard>
            </Grid>
          </Grid>
        </Grid>
        
        {paymentMethod === 'creditCard' && (
          <Grid container item spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Divider>
                <Chip label="Card Details" />
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="cardNumber"
                label="Card Number"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                error={!!formErrors.cardNumber}
                helperText={formErrors.cardNumber}
                placeholder="XXXX XXXX XXXX XXXX"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="cardName"
                label="Name on Card"
                value={formData.cardName}
                onChange={handleChange}
                error={!!formErrors.cardName}
                helperText={formErrors.cardName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="cardExpiry"
                label="Expiry Date (MM/YY)"
                placeholder="MM/YY"
                value={formData.cardExpiry}
                onChange={handleChange}
                error={!!formErrors.cardExpiry}
                helperText={formErrors.cardExpiry}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="cardCvv"
                label="CVV"
                type="password"
                value={formData.cardCvv}
                onChange={handleChange}
                error={!!formErrors.cardCvv}
                helperText={formErrors.cardCvv}
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
          </Grid>
        )}
        
        {paymentMethod === 'bankTransfer' && (
          <Grid container item spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Divider>
                <Chip label="Bank Details" />
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Bank Account Information:</Typography>
                <Typography variant="body2">Bank: National Bank</Typography>
                <Typography variant="body2">Account Name: Helping Hands Child Care</Typography>
                <Typography variant="body2">Account Number: 123456789</Typography>
                <Typography variant="body2">Routing Number: 987654321</Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                  Please use your Payment ID as reference
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Grid>
    </AnimatedBox>
  );
  
  // Render payment review step
  const renderReview = () => (
    <AnimatedBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Avatar 
          src={Logo} 
          alt="Helping Hands Logo"
          sx={{ 
            width: 80, 
            height: 80,
            mb: 2
          }}
        />
      </Box>
      
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Review Payment
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 4, mt: 4, position: 'relative', overflow: 'visible' }}>
        <PaymentBadge>
          ${formData.amount}
        </PaymentBadge>
        
        <CardHeader
          title="Payment Summary"
          subheader={`Reference: ${formData.paymentId}`}
        />
        
        <Divider />
        
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Payment Method</Typography>
              <Typography variant="body1">
                {paymentMethod === 'creditCard' 
                  ? 'Credit Card' 
                  : 'Bank Transfer'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Date</Typography>
              <Typography variant="body1">
                {formData.date.toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Name</Typography>
              <Typography variant="body1">{formData.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Organization</Typography>
              <Typography variant="body1">{formData.organizationName}</Typography>
            </Grid>
            
            {paymentMethod === 'creditCard' && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Card Details</Typography>
                <Typography variant="body1">
                  **** **** **** {formData.cardNumber.slice(-4)}
                </Typography>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 2, 
                pt: 2, 
                borderTop: '1px dashed rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6">Total Amount</Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  ${formData.amount}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          By proceeding, you confirm the payment details are correct.
        </Typography>
      </Box>
    </AnimatedBox>
  );
  
  // Render confirmation step
  const renderConfirmation = () => (
    <AnimatedBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
        >
          <Avatar
            sx={{ 
              bgcolor: 'success.main', 
              width: 100, 
              height: 100, 
              mx: 'auto',
              mb: 3
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 60 }} />
          </Avatar>
        </motion.div>
        
        <Typography variant="h4" gutterBottom>
          Payment Successful!
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Your payment of <b>${formData.amount}</b> has been processed successfully.
        </Typography>
        
        <Card variant="outlined" sx={{ mb: 4, textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Transaction Details</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Payment ID</Typography>
                <Typography variant="body1">{formData.paymentId}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Date</Typography>
                <Typography variant="body1">
                  {formData.date.toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Name</Typography>
                <Typography variant="body1">{formData.name}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Organization</Typography>
                <Typography variant="body1">{formData.organizationName}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                <Typography variant="body1">
                  {paymentMethod === 'creditCard' 
                    ? `Credit Card (*${formData.cardNumber.slice(-4)})` 
                    : 'Bank Transfer'}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Amount</Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  ${formData.amount}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<DoneAllIcon />}
          size="large"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Box>
    </AnimatedBox>
  );
  
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {activeStep === 0 && renderPaymentDetails()}
        {activeStep === 1 && renderReview()}
        {activeStep === 2 && renderConfirmation()}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0 || activeStep === steps.length - 1}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          
          <Box sx={{ position: 'relative' }}>
            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={loading}
                endIcon={activeStep === 1 ? <PaymentIcon /> : undefined}
              >
                {activeStep === 0 ? 'Review Payment' : 'Confirm Payment'}
              </Button>
            )}
            
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentPage;
