import React from 'react';
import '../styles/loading.css';

interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="loading-fallback">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};