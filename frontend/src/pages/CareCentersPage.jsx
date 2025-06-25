import { useState, useEffect } from 'react';
import CareCenterCard from '../components/CareCenterCard';
import { fetchCareCenters } from '../services/api';
import Hero from '../components/Hero';

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
    <div className="care-centers-page">
      <Hero 
        title="Our Care Centers" 
        subtitle="Find the perfect care center for your child"
      />

      <div className="container">
        <section className="centers-intro">
          <h2>Find a Care Center</h2>
          <p>
            Helping Hands Child Care operates both corporate and community care centers to meet the diverse needs of families.
            Browse our centers below to find the perfect fit for your child.
          </p>
          
          <div className="filter-controls">
            <label htmlFor="center-filter">Filter by type: </label>
            <select 
              id="center-filter" 
              value={filter} 
              onChange={handleFilterChange}
              className="filter-dropdown"
            >
              <option value="all">All Centers</option>
              <option value="corporate">Corporate Centers</option>
              <option value="community">Community Centers</option>
            </select>
          </div>
        </section>

        <section className="centers-grid">
          {loading ? (
            <p className="loading-message">Loading care centers...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : filteredCenters.length === 0 ? (
            <p className="no-results">No care centers found matching your criteria.</p>
          ) : (
            filteredCenters.map(center => (
              <CareCenterCard key={center.id} center={center} />
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default CareCentersPage;
