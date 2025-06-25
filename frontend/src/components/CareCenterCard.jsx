import { Link } from 'react-router-dom';

const CareCenterCard = ({ center }) => {
  return (
    <div className="center-card">
      <div className="center-image">
        <img src={center.images[0]} alt={center.name} />
      </div>
      <div className="center-info">
        <h3>{center.name}</h3>
        <p className="center-type">{center.type} Center</p>
        <p className="center-address">{center.address}</p>
        <div className="center-features">
          {center.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="feature-tag">
              {feature}
            </span>
          ))}
        </div>
        <Link to={`/care-centers/${center.id}`} className="view-center-btn">
          View Center
        </Link>
      </div>
    </div>
  );
};

export default CareCenterCard;
