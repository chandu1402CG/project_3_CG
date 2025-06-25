import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import { fetchServices, fetchCareCenters } from '../services/api';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, centersData] = await Promise.all([
          fetchServices(),
          fetchCareCenters()
        ]);
        
        setServices(servicesData);
        setCenters(centersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      <Hero 
        title="Quality Child Care for Every Family" 
        subtitle="Providing nurturing care and early education in a safe, stimulating environment"
        cta={{ text: "Find a Care Center", link: "/care-centers" }}
      />

      <section className="intro-section">
        <div className="container">
          <h2>Welcome to Helping Hands Child Care</h2>
          <p>
            At Helping Hands Child Care, we believe every child deserves the best start in life. 
            Our centers provide safe, nurturing environments where children can learn, play, and grow.
            With both corporate and community care models, we offer flexible options to meet the needs of all families.
          </p>
          <div className="intro-features">
            <div className="feature">
              <i className="fas fa-shield-alt"></i>
              <h3>Safe & Secure</h3>
              <p>State-of-the-art security systems and strict check-in/out procedures</p>
            </div>
            <div className="feature">
              <i className="fas fa-apple-alt"></i>
              <h3>Nutritious Meals</h3>
              <p>Healthy, balanced meals and snacks prepared fresh daily</p>
            </div>
            <div className="feature">
              <i className="fas fa-book-open"></i>
              <h3>Educational Programs</h3>
              <p>Age-appropriate learning activities and curriculum</p>
            </div>
            <div className="feature">
              <i className="fas fa-smile"></i>
              <h3>Caring Staff</h3>
              <p>Experienced, qualified caregivers who love working with children</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          <p className="section-intro">
            We offer a range of child care services to meet your family's needs, from infant care to after-school programs.
          </p>
          
          {loading ? (
            <p>Loading services...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="services-grid">
              {services.slice(0, 3).map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
          
          <div className="view-all-container">
            <a href="/services" className="view-all-btn">View All Services</a>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2>What Parents Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial">
              <p>"Helping Hands has been a lifesaver for our family. The staff is amazing and our daughter loves going there every day!"</p>
              <div className="testimonial-author">- Sarah Johnson</div>
            </div>
            <div className="testimonial">
              <p>"The educational program is exceptional. Our son has learned so much since starting at Helping Hands."</p>
              <div className="testimonial-author">- Michael Chen</div>
            </div>
            <div className="testimonial">
              <p>"As a working parent, I appreciate the flexible hours and the peace of mind knowing my children are in good hands."</p>
              <div className="testimonial-author">- Lisa Rodriguez</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Join Our Family?</h2>
          <p>Register today to explore our care centers and schedule a visit.</p>
          <div className="cta-buttons">
            <a href="/register" className="cta-primary">Register Now</a>
            <a href="/care-centers" className="cta-secondary">Find a Care Center</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
