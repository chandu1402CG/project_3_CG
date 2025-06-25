import { Card, CardContent, CardActions, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            fontSize: '1.5rem'
          }}
        >
          <i className={`fas fa-${service.icon}`}></i>
        </Box>
        
        <Typography variant="h5" component="h3" gutterBottom>
          {service.name}
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          color="primary" 
          fontWeight="600" 
          sx={{ mb: 2 }}
        >
          {service.ageRange}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {service.description}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button 
          component={RouterLink} 
          to={`/services/${service.id}`} 
          color="primary"
          sx={{ 
            textTransform: 'none',
            borderBottom: '2px solid',
            borderRadius: 0,
            px: 0,
            '&:hover': {
              backgroundColor: 'transparent',
            }
          }}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;
