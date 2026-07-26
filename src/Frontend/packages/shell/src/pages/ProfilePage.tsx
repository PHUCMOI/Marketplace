
import React from 'react';
import '../styles/pages.css';

export const ProfilePage: React.FC = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">User Profile</h1>
      <div className="profile-card">
        <div className="profile-avatar">👤</div>
        <h2 className="profile-name">Admin User</h2>
        <p className="profile-email">admin@logisticsmarketplace.com</p>
        <p className="profile-role">Role: Administrator</p>
        
        <div className="profile-section">
          <h3>Account Information</h3>
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Organization:</span>
              <span className="info-value">LogisticsMarketplace</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">January 2026</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value status-active">Active</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="profile-button">Edit Profile</button>
          <button className="profile-button profile-button-secondary">Change Password</button>
        </div>
      </div>
    </div>
  );
};