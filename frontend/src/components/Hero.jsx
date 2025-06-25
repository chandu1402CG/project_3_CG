import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Hero = ({ title, subtitle, image, cta }) => {
  return (
    <Box
      sx={{
        bgcolor: '#1e40af',
        backgroundImage: image ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})` : null,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        py: 10,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="h5" paragraph sx={{ mb: 4 }}>
            {subtitle}
          </Typography>
        )}
        
        {cta && (
          <Button
            component={RouterLink}
            to={cta.link}
            variant="contained"
            color="secondary"
            size="large"
            sx={{ borderRadius: 1, px: 4, py: 1 }}
          >
            {cta.text}
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default Hero;
