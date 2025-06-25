const Hero = ({ title, subtitle, image, cta }) => {
  return (
    <div className="hero" style={image ? { backgroundImage: `url(${image})` } : {}}>
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {cta && (
          <a href={cta.link} className="cta-button">
            {cta.text}
          </a>
        )}
      </div>
    </div>
  );
};

export default Hero;
