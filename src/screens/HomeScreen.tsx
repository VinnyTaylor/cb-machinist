import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { CodeBlock } from '../components/CodeBlock';
import { NoteBox } from '../components/NoteBox';
import { getRandomTip } from '../data/tips';
import './HomeScreen.css';

const quickTiles = [
  { icon: '⚙️', label: 'Speeds & Feeds', path: '/calculators', tab: 'speeds' },
  { icon: '📐', label: 'Trig Calculator', path: '/calculators', tab: 'trig' },
  { icon: '🔩', label: 'Thread Calc', path: '/calculators', tab: 'thread' },
  { icon: '🔲', label: 'Bolt Circle', path: '/calculators', tab: 'bolt' },
  { icon: '📋', label: 'G-Code Ref', path: '/reference', tab: 'gcode' },
  { icon: '🧱', label: 'Materials', path: '/reference', tab: 'materials' }
];

const formulas = `RPM  = (SFM × 3.82) ÷ Diameter
IPM  = RPM × Chip Load × Flutes
SFM  = (RPM × Dia.) ÷ 3.82
Tap Feed (IPM) = RPM ÷ TPI
Thread Depth   = 0.6495 × Pitch`;

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const tip = useMemo(() => getRandomTip(), []);

  const handleTileClick = (tile: typeof quickTiles[0]) => {
    navigate(tile.path, { state: { tab: tile.tab } });
  };

  return (
    <div className="page home-screen">
      {/* Logo Section */}
      <div className="home-header">
        <div className="logo-box">
          <span className="logo-text">C&B</span>
        </div>
        <div className="logo-info">
          <h1 className="app-title">Machinist Pro</h1>
          <p className="app-subtitle">C&B Technology</p>
        </div>
      </div>

      {/* Quick Launch Grid */}
      <div className="quick-grid">
        {quickTiles.map((tile) => (
          <button
            key={tile.label}
            className="quick-tile"
            onClick={() => handleTileClick(tile)}
          >
            <span className="tile-icon">{tile.icon}</span>
            <span className="tile-label">{tile.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-value">17+</span>
          <span className="stat-label">Materials</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">7</span>
          <span className="stat-label">Calculators</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">60+</span>
          <span className="stat-label">G-Codes</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">23</span>
          <span className="stat-label">Thread Sizes</span>
        </div>
      </div>

      {/* Pro Tip */}
      <Card title="Pro Tip of the Day" icon="💡">
        <NoteBox variant="tip">
          {tip}
        </NoteBox>
      </Card>

      {/* Formula Reference */}
      <div className="formula-section">
        <h3 className="section-title">Formula Quick Reference</h3>
        <CodeBlock code={formulas} showCopy={true} />
      </div>
    </div>
  );
};
