import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// Helper function to get user initials
const getUserInitials = (name) => {
  if (!name) return '?';
  
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const UserAvatar = ({ user, onClick, isOpen, dropdownRef }) => {
  // Get initials from first and last name
  const initials = getUserInitials(user?.name);
  
  return (
    <div className="user-avatar-container" ref={dropdownRef}>
      <div className="user-avatar" onClick={onClick}>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      
      <div className={`avatar-dropdown ${isOpen ? 'show' : ''}`}>
        <div className="user-info">
          <h4 className="user-name">{user?.name || 'User'}</h4>
          <p className="user-email">{user?.email || ''}</p>
        </div>
        <ul className="dropdown-links">
          <li>
            <Link to="/profile">My Profile</Link>
          </li>
          <li>
            <Link to="/schedule">My Schedule</Link>
          </li>
          <li>
            <button className="logout" onClick={() => window.dispatchEvent(new CustomEvent('user-logout'))}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setIsLoggedIn(true);
        setUserData(user);
      } catch (err) {
        console.error('Error parsing user data:', err);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
      }
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
    
    // Listen for custom logout event
    const handleLogoutEvent = () => handleLogout();
    window.addEventListener('user-logout', handleLogoutEvent);
    
    return () => {
      window.removeEventListener('user-logout', handleLogoutEvent);
    };
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setDropdownOpen(false);
    // Redirect to home page
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Helping Hands</span>
          <span className="logo-subtext">Child Care</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/care-centers" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Care Centers
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
          </li>
          
          {/* Mobile menu: schedule and profile links shown in mobile menu when logged in */}
          {isLoggedIn && isMenuOpen && (
            <>
              <li className="nav-item mobile-only">
                <Link to="/schedule" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Schedule
                </Link>
              </li>
              <li className="nav-item mobile-only">
                <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
              </li>
              <li className="nav-item mobile-only">
                <button className="nav-link btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
          
          {/* Auth Links (Login/Register) or User Avatar */}
          {isLoggedIn ? (
            <li className="nav-item user-menu">
              <UserAvatar 
                user={userData}
                onClick={toggleDropdown}
                isOpen={dropdownOpen}
                dropdownRef={dropdownRef}
              />
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link 
                  to="/register" 
                  className={`nav-link btn-register ${isLoggedIn ? 'disabled-link' : ''}`}
                  onClick={() => !isLoggedIn && setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link btn-login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
