import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const CalculatorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="8" y2="10.01"/>
    <line x1="12" y1="10" x2="12" y2="10.01"/>
    <line x1="16" y1="10" x2="16" y2="10.01"/>
    <line x1="8" y1="14" x2="8" y2="14.01"/>
    <line x1="12" y1="14" x2="12" y2="14.01"/>
    <line x1="16" y1="14" x2="16" y2="14.01"/>
    <line x1="8" y1="18" x2="8" y2="18.01"/>
    <line x1="12" y1="18" x2="12" y2="18.01"/>
    <line x1="16" y1="18" x2="16" y2="18.01"/>
  </svg>
);

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <HomeIcon />
        <span className="nav-label">Home</span>
        <span className="nav-indicator" />
      </NavLink>
      <NavLink to="/calculators" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <CalculatorIcon />
        <span className="nav-label">Calculators</span>
        <span className="nav-indicator" />
      </NavLink>
      <NavLink to="/reference" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <BookIcon />
        <span className="nav-label">Reference</span>
        <span className="nav-indicator" />
      </NavLink>
      <NavLink to="/manual" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <EditIcon />
        <span className="nav-label">Manual</span>
        <span className="nav-indicator" />
      </NavLink>
    </nav>
  );
};
