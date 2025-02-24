import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onShowAuthModal, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setIsProfileMenuOpen(!isProfileMenuOpen);
      setIsMenuOpen(false);
    } else {
      onShowAuthModal();
    }
  };

  const handleLogout = () => {
    onLogout();
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="logo" onClick={handleNavLinkClick}>
            <span className="logo-text">BlogPlatform</span>
          </Link>
        </div>

        <button
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={handleNavLinkClick}>
            Home
          </Link>
          {user && (
            <>
              <Link to="/profile" className="nav-link" onClick={handleNavLinkClick}>
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/dashboard" className="nav-link" onClick={handleNavLinkClick}>
                  Dashboard
                </Link>
              )}
            </>
          )}
          
          <div className="navbar-end">
            {user ? (
              <div className="profile-menu">
                <button className="profile-button" onClick={handleProfileClick}>
                  <img
                    src={user.avatar || 'https://via.placeholder.com/32'}
                    alt={user.username}
                    className="profile-avatar"
                  />
                  <span className="username">{user.username}</span>
                </button>
                {isProfileMenuOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <img
                        src={user.avatar || 'https://via.placeholder.com/32'}
                        alt={user.username}
                        className="profile-avatar"
                      />
                      <div>
                        <strong>{user.username}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={handleNavLinkClick}
                    >
                      <i className="fas fa-user"></i>
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/dashboard"
                        className="dropdown-item"
                        onClick={handleNavLinkClick}
                      >
                        <i className="fas fa-tachometer-alt"></i>
                        Dashboard
                      </Link>
                    )}
                    <button className="logout-button" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="auth-button" onClick={onShowAuthModal}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
