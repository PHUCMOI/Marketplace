import React from 'react';
import { Navigation } from './Navigation';
import '../styles/layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-container">
          <div className="logo-section">
            <h1 className="app-title">LogisticsMarketplace</h1>
            <span className="app-subtitle">Freight Management Platform</span>
          </div>
          <div className="user-menu">
            <button className="user-menu-button">
              <span className="user-icon">👤</span>
              <span className="user-name">Admin User</span>
            </button>
          </div>
        </div>
      </header>

      <Navigation />

      <main className="app-main">
        <div className="main-container">
          {children}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-content">
            <p className="copyright">
              &copy; {new Date().getFullYear()} LogisticsMarketplace. All rights reserved.
            </p>
            <div className="footer-links">
              <a href="/privacy" className="footer-link">Privacy Policy</a>
              <a href="/terms" className="footer-link">Terms of Service</a>
              <a href="/contact" className="footer-link">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};