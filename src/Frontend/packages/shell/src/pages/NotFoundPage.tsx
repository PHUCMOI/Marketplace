
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="not-found">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="not-found-link">
          Return to Home
        </Link>
      </div>
    </div>
  );
};