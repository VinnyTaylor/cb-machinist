import React from 'react';
import './ResetButton.css';

interface ResetButtonProps {
  onClick: () => void;
  label?: string;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onClick, label = 'Reset' }) => {
  return (
    <button className="reset-button" onClick={onClick} type="button">
      <span className="reset-icon">↺</span>
      <span className="reset-label">{label}</span>
    </button>
  );
};
