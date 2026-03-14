import React from 'react';
import './ResultItem.css';

interface ResultItemProps {
  label: string;
  value: string | number;
  unit?: string;
  variant?: 'accent' | 'accent2' | 'accent3' | 'default';
  size?: 'normal' | 'large';
}

export const ResultItem: React.FC<ResultItemProps> = ({
  label,
  value,
  unit,
  variant = 'accent',
  size = 'normal'
}) => {
  return (
    <div className={`result-item result-${size}`}>
      <span className="result-label">{label}</span>
      <div className="result-value-wrapper">
        <span className={`result-value result-${variant}`}>{value}</span>
        {unit && <span className="result-unit">{unit}</span>}
      </div>
    </div>
  );
};
