
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export const HomePage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to LogisticsMarketplace</h1>
        <p className="hero-subtitle">
          Your comprehensive freight management and dispatch platform
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h2 className="feature-title">Shipper Portal</h2>
          <p className="feature-description">
            Post loads, manage shipments, and receive bids from qualified carriers
          </p>
          <Link to="/shipper" className="feature-link">
            Go to Shipper Dashboard →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🚛</div>
          <h2 className="feature-title">Carrier Portal</h2>
          <p className="feature-description">
            Find available loads, submit bids, and manage your fleet operations
          </p>
          <Link to="/carrier" className="feature-link">
            Go to Carrier Dashboard →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h2 className="feature-title">Dispatcher Console</h2>
          <p className="feature-description">
            Coordinate dispatches, track shipments, and optimize routes
          </p>
          <Link to="/dispatcher" className="feature-link">
            Go to Dispatcher Console →
          </Link>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-value">1,234</div>
          <div className="stat-label">Active Loads</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">567</div>
          <div className="stat-label">Carriers</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">890</div>
          <div className="stat-label">Completed Trips</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">98%</div>
          <div className="stat-label">On-Time Delivery</div>
        </div>
      </div>
    </div>
  );
};