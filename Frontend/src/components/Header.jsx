import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --rose: #D4537E;
    --rose-light: #FBEAF0;
    --rose-mid: #ED93B1;
    --teal: #1D9E75;
    --teal-light: #E1F5EE;
    --dark: #2C2C2A;
    --muted: #5F5E5A;
    --white: #ffffff;
  }

  .eh-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 0.5px solid #e8ddd8;
    font-family: 'DM Sans', sans-serif;
  }

  .eh-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 3rem;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  /* LOGO */
  .eh-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--dark);
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .eh-logo span {
    color: var(--rose);
    font-style: italic;
  }

  /* NAV */
  .eh-nav {
    display: flex;
    align-items: center;
    gap: 2.2rem;
    list-style: none;
  }
  .eh-nav a {
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--muted);
    transition: color 0.2s;
    position: relative;
    padding-bottom: 2px;
  }
  .eh-nav a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1.5px;
    background: var(--rose);
    transition: width 0.25s ease;
    border-radius: 2px;
  }
  .eh-nav a:hover { color: var(--dark); }
  .eh-nav a:hover::after { width: 100%; }
  .eh-nav a.active { color: var(--dark); font-weight: 500; }
  .eh-nav a.active::after { width: 100%; }

  /* ACTION BUTTONS */
  .eh-header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .eh-btn-login {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--muted);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .eh-btn-login:hover { color: var(--dark); background: #f5efec; }

  .eh-btn-signup {
    font-size: 0.88rem;
    font-weight: 500;
    color: white;
    background: var(--rose);
    text-decoration: none;
    padding: 0.55rem 1.4rem;
    border-radius: 50px;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    border: none;
    cursor: pointer;
    display: inline-block;
  }
  .eh-btn-signup:hover { background: #993556; transform: translateY(-1px); }

  .eh-btn-profile {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--teal);
    background: var(--teal-light);
    text-decoration: none;
    padding: 0.55rem 1.4rem;
    border-radius: 50px;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    display: inline-block;
    border: none;
    cursor: pointer;
  }
  .eh-btn-profile:hover { background: #9FE1CB; color: #085041; }

  .eh-btn-logout {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--muted);
    background: transparent;
    padding: 0.55rem 1.4rem;
    border-radius: 50px;
    border: 1px solid #e0d5cf;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
  }
  .eh-btn-logout:hover { border-color: #c5b8b0; color: var(--dark); background: #f5efec; }

  /* AVATAR DOT */
  .eh-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--rose-light);
    border: 1.5px solid var(--rose-mid);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: var(--rose);
    font-weight: 500;
    flex-shrink: 0;
  }

  /* MOBILE HAMBURGER */
  .eh-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }
  .eh-hamburger span {
    display: block;
    width: 22px;
    height: 1.5px;
    background: var(--dark);
    border-radius: 2px;
    transition: all 0.25s;
  }
  .eh-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .eh-hamburger.open span:nth-child(2) { opacity: 0; }
  .eh-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* MOBILE DRAWER */
  .eh-mobile-menu {
    display: none;
    flex-direction: column;
    padding: 1rem 3rem 1.5rem;
    background: white;
    border-top: 0.5px solid #e8ddd8;
    gap: 0.2rem;
  }
  .eh-mobile-menu.open { display: flex; }
  .eh-mobile-menu a, .eh-mobile-menu button {
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--muted);
    padding: 0.65rem 0;
    border-bottom: 0.5px solid #f0e8e4;
    transition: color 0.2s;
    background: none;
    border-left: none;
    border-right: none;
    border-top: none;
    text-align: left;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
  }
  .eh-mobile-menu a:last-child, .eh-mobile-menu button:last-child { border-bottom: none; }
  .eh-mobile-menu a:hover, .eh-mobile-menu button:hover { color: var(--rose); }
  .eh-mobile-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  @media (max-width: 900px) {
    .eh-nav { display: none; }
    .eh-header-actions { display: none; }
    .eh-hamburger { display: flex; }
    .eh-header-inner { padding: 0 1.5rem; }
    .eh-mobile-menu { padding: 1rem 1.5rem 1.5rem; }
  }
`;

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setMenuOpen(false);
    navigate('/');
  };

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <style>{styles}</style>
      <header className="eh-header">
        <div className="eh-header-inner">

          {/* Logo */}
          <Link to="/" className="eh-logo">
            Empower<span>Her</span>
          </Link>

          {/* Desktop Nav */}
          <nav>
            <ul className="eh-nav">
              <li><Link to="/" className={isActive('/')}>Home</Link></li>
              <li><Link to="/menteedash" className={isActive('/menteedash')}>Find a Mentor</Link></li>
              <li><Link to="/Community" className={isActive('/Community')}>Community Forum</Link></li>
              <li><Link to="/about" className={isActive('/about')}>About Us</Link></li>
              <li><Link to="/resources" className={isActive('/resources')}>Resources</Link></li>
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="eh-header-actions">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="eh-btn-profile">
                  <span style={{ marginRight: '6px' }}>👤</span> My Profile
                </Link>
                <button onClick={handleLogout} className="eh-btn-logout">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="eh-btn-login">Log In</Link>
                <Link to="/register" className="eh-btn-signup">Join Free</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`eh-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile Drawer */}
        <div className={`eh-mobile-menu${menuOpen ? ' open' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/menteedash">Find a Mentor</Link>
          <Link to="/about">About Us</Link>
          <Link to="/resources">Resources</Link>
          <div className="eh-mobile-actions">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="eh-btn-profile">My Profile</Link>
                <button onClick={handleLogout} className="eh-btn-logout">Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="eh-btn-login" style={{ border: '1px solid #e0d5cf' }}>Log In</Link>
                <Link to="/register" className="eh-btn-signup">Join Free</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}