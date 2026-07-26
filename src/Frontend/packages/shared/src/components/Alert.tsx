import React, { HTMLAttributes } from 'react';
import './Alert.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  onClose?: () => void;
  closable?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  onClose,
  closable = false,
  className = '',
  children,
  ...props
}) => {
  const classes = ['alert', `alert-${variant}`, className].filter(Boolean).join(' ');

  return (
    <div className={classes} role="alert" {...props}>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{children}</div>
      </div>
      {closable && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;