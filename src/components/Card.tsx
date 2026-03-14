import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary';
  title?: string;
  icon?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  title,
  icon
}) => {
  return (
    <div className={`card card-${variant} ${className}`}>
      {title && (
        <div className="card-header">
          {icon && <span className="card-icon">{icon}</span>}
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};
