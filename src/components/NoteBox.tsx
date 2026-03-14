import React from 'react';
import './NoteBox.css';

interface NoteBoxProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'tip';
}

export const NoteBox: React.FC<NoteBoxProps> = ({
  title,
  children,
  variant = 'info'
}) => {
  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    tip: '💡'
  };

  return (
    <div className={`note-box note-${variant}`}>
      <div className="note-header">
        <span className="note-icon">{icons[variant]}</span>
        {title && <span className="note-title">{title}</span>}
      </div>
      <div className="note-content">{children}</div>
    </div>
  );
};
