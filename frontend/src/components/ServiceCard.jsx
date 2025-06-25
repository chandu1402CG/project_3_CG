import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="service-icon">
        <i className={`fas fa-${service.icon}`}></i>
      </div>
      <h3>{service.name}</h3>
      <p className="age-range">{service.ageRange}</p>
      <p className="service-description">{service.description}</p>
      <Link to={`/services/${service.id}`} className="learn-more-btn">
        Learn More
      </Link>
    </div>
  );
};

export default ServiceCard;
