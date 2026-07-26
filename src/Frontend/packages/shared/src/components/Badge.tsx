
import React, { HTMLAttributes } from 'react';
import './Badge.css';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  outline?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  outline = false,
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'badge',
    `badge-${variant}`,
    outline ? 'badge-outline' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;