import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { fetchCareCenters } from '../services/api';
import { 
  Banner,
  FeaturesSection,
  ServicesSection, 
  TestimonialsSection,
  CTASection 
} from '../components/home';

const HomePage = () => {
  const [, setCenters] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centersData = await fetchCareCenters();
        setCenters(centersData);
      } catch (err) {
        console.error('Error fetching care centers:', err);
      }
    };

    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }

    fetchData();
  }, []);

  return (
    <Box>
      <Banner />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection isLoggedIn={isLoggedIn} />
    </Box>
  );
};

export default HomePage;
