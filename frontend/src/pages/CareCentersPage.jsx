import { useState, useEffect } from 'react';
import CareCenterCard from '../components/CareCenterCard';
import { fetchCareCenters } from '../services/api';
import Hero from '../components/Hero';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';

const CareCentersPage = () => {
  const [careCenters, setCareCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadCareCenters = async () => {
      try {
        setLoading(true);
        const centers = await fetchCareCenters();
        setCareCenters(centers);
        setError(null);
      } catch (err) {
        console.error('Error loading care centers:', err);
        setError('Failed to load care centers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCareCenters();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredCenters = filter === 'all' 
    ? careCenters 
    : careCenters.filter(center => center.type.toLowerCase() === filter.toLowerCase());

  return (
    <Box>
      <Hero 
        title="Our Care Centers" 
        subtitle="Find the perfect care center for your child"
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Find a Care Center
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Helping Hands Child Care operates both corporate and community care centers to meet the diverse needs of families.
            Browse our centers below to find the perfect fit for your child.
          </Typography>
          
          <Box sx={{ mt: 3, mb: 4 }}>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="center-filter-label">Filter by type</InputLabel>
              <Select
                labelId="center-filter-label"
                id="center-filter"
                value={filter}
                onChange={handleFilterChange}
                label="Filter by type"
              >
                <MenuItem value="all">All Centers</MenuItem>
                <MenuItem value="corporate">Corporate Centers</MenuItem>
                <MenuItem value="community">Community Centers</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : filteredCenters.length === 0 ? (
            <Alert severity="info">No care centers found matching your criteria.</Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredCenters.map(center => (
                <Grid item xs={12} key={center.id}>
                  <CareCenterCard center={center} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default CareCentersPage;
