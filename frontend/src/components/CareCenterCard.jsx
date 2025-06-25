import { Card, CardMedia, CardContent, CardActions, Typography, Box, Button, Chip, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CareCenterCard = ({ center }) => {
  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        overflow: 'hidden',
        height: '100%',
        boxShadow: 2
      }}
    >
      <CardMedia
        component="img"
        sx={{ 
          width: { xs: '100%', sm: 200 },
          height: { xs: 140, sm: '100%' },
          objectFit: 'cover'
        }}
        image={center.images[0]}
        alt={center.name}
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h3" gutterBottom>
            {center.name}
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            color="primary" 
            gutterBottom
          >
            {center.type} Center
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom 
            sx={{ mb: 2 }}
          >
            {center.address}
          </Typography>
          
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {center.features.slice(0, 3).map((feature, index) => (
              <Grid item key={index}>
                <Chip
                  label={feature}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(66, 135, 245, 0.1)',
                    color: 'primary.main',
                    fontWeight: 500
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
        
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button 
            component={RouterLink}
            to={`/care-centers/${center.id}`}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 1 }}
          >
            View Center
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};

export default CareCenterCard;
