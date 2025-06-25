const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Helping Hands Child Care</h3>
          <p>Providing quality child care services since 2010.</p>
          <p>We are committed to creating a safe, nurturing environment where children can learn and grow.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/care-centers">Care Centers</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@helpinghandscc.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Address: 123 Main Street, Anytown, USA</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Helping Hands Child Care. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
