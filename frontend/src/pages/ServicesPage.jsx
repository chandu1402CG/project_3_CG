import { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import { fetchServices } from '../services/api';
import Hero from '../components/Hero';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const servicesData = await fetchServices();
        setServices(servicesData);
        setError(null);
      } catch (err) {
        console.error('Error loading services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div className="services-page">
      <Hero 
        title="Our Services" 
        subtitle="Quality care for children of all ages"
      />

      <div className="container">
        <section className="services-intro">
          <h2>Child Care Services</h2>
          <p>
            At Helping Hands Child Care, we offer a variety of programs designed to meet the needs of children at different developmental stages.
            Our experienced staff provide nurturing care and educational activities to help your child grow and learn.
          </p>
        </section>

        <section className="services-grid">
          {loading ? (
            <p className="loading-message">Loading services...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))
          )}
        </section>
        
        <section className="additional-info">
          <h3>Why Choose Our Programs?</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>Qualified Staff</h4>
              <p>All our caregivers are certified in early childhood education and regularly participate in professional development.</p>
            </div>
            <div className="info-item">
              <h4>Low Child-to-Staff Ratios</h4>
              <p>We maintain low ratios to ensure each child receives the attention and care they deserve.</p>
            </div>
            <div className="info-item">
              <h4>Developmental Approach</h4>
              <p>Our programs are designed to support children's physical, social, emotional, and cognitive development.</p>
            </div>
            <div className="info-item">
              <h4>Flexible Scheduling</h4>
              <p>We offer full-time and part-time options to accommodate your family's needs.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;
