import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@logistics-marketplace/shared';
import { Navigation } from './Navigation';
import '../styles/layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = authService.getStoredUser();
  const initials = user?.fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'LM';

  return (
    <div className="app-layout">
      <div className="utility-bar">
        <div className="utility-container">
          <span className="system-status"><i /> Marketplace operational</span>
          <span>Support: 1900 6868</span>
        </div>
      </div>
      <header className="app-header">
        <div className="header-container">
          <Link to="/" className="brand" aria-label="Logistics Marketplace home">
            <span className="brand-mark">LM</span>
            <span className="logo-section">
              <strong className="app-title">Logistics Marketplace</strong>
              <span className="app-subtitle">Transport operations network</span>
            </span>
          </Link>
          <div className="user-menu">
            <Link className="help-link" to="/">Help center</Link>
            {user ? (
              <Link className="user-menu-button" to="/profile">
                <span className="user-avatar">{initials}</span>
                <span className="user-copy">
                  <strong className="user-name">{user.fullName}</strong>
                  <span className="user-role">{user.role}</span>
                </span>
              </Link>
            ) : (
              <Link className="header-sign-in" to="/login">Sign in</Link>
            )}
          </div>
        </div>
      </header>
      <Navigation />
      <main className="app-main"><div className="main-container">{children}</div></main>
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-content">
            <p className="copyright">&copy; {new Date().getFullYear()} Logistics Marketplace</p>
            <div className="footer-links">
              <a href="/privacy" className="footer-link">Privacy</a>
              <a href="/terms" className="footer-link">Terms</a>
              <a href="/contact" className="footer-link">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
