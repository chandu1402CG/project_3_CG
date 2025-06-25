import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box 
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Helping Hands Child Care
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Providing quality child care services since 2010.
            </Typography>
            <Typography variant="body2">
              We are committed to creating a safe, nurturing environment where children can learn and grow.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ 
              listStyle: 'none', 
              pl: 0,
              '& li': { mb: 1 }
            }}>
              <li>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                  Home
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/care-centers" color="inherit" underline="hover">
                  Care Centers
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/services" color="inherit" underline="hover">
                  Services
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/register" color="inherit" underline="hover">
                  Register
                </Link>
              </li>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@helpinghandscc.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: (555) 123-4567
            </Typography>
            <Typography variant="body2">
              Address: 123 Main Street, Anytown, USA
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 3 }} />
        
        <Typography variant="body2" align="center">
          &copy; {new Date().getFullYear()} Helping Hands Child Care. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
