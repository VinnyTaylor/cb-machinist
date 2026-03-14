import React, { useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './BoltCircleCalc.css';

interface BoltCircleState {
  bcd: string;
  numHoles: string;
  startAngle: string;
  centerX: string;
  centerY: string;
}

interface HolePosition {
  number: number;
  angle: number;
  x: number;
  y: number;
}

export const BoltCircleCalc: React.FC = () => {
  const [state, setState] = useLocalStorage<BoltCircleState>('bolt-circle', {
    bcd: '4.0',
    numHoles: '6',
    startAngle: '0',
    centerX: '0',
    centerY: '0'
  });

  const [copied, setCopied] = useState(false);

  const holes = useMemo((): HolePosition[] => {
    const bcd = parseFloat(state.bcd) || 0;
    const numHoles = parseInt(state.numHoles) || 0;
    const startAngle = parseFloat(state.startAngle) || 0;
    const centerX = parseFloat(state.centerX) || 0;
    const centerY = parseFloat(state.centerY) || 0;

    if (bcd <= 0 || numHoles <= 0) return [];

    const radius = bcd / 2;
    const angleStep = 360 / numHoles;

    return Array.from({ length: numHoles }, (_, i) => {
      const angle = startAngle + i * angleStep;
      const angleRad = (angle * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY + radius * Math.sin(angleRad);

      return {
        number: i + 1,
        angle: angle % 360,
        x,
        y
      };
    });
  }, [state]);

  const handleCopyCoordinates = async () => {
    const coords = holes
      .map((h) => `X${h.x.toFixed(4)} Y${h.y.toFixed(4)}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(coords);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // SVG calculations
  const svgSize = 200;
  const svgCenter = svgSize / 2;
  const bcd = parseFloat(state.bcd) || 4;
  const scale = (svgSize - 40) / (bcd * 1.2);
  const radius = (bcd / 2) * scale;

  return (
    <div className="bolt-calc">
      <Card title="Bolt Circle Calculator" icon="🔲">
        <div className="grid-2">
          <div className="form-group">
            <label>BCD Diameter</label>
            <input
              type="number"
              value={state.bcd}
              onChange={(e) => setState({ ...state, bcd: e.target.value })}
              placeholder="Inches"
              step="0.125"
            />
          </div>
          <div className="form-group">
            <label>Number of Holes</label>
            <input
              type="number"
              value={state.numHoles}
              onChange={(e) => setState({ ...state, numHoles: e.target.value })}
              placeholder="Count"
              min="2"
              max="36"
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label>Start Angle</label>
            <input
              type="number"
              value={state.startAngle}
              onChange={(e) => setState({ ...state, startAngle: e.target.value })}
              placeholder="Degrees"
              step="1"
            />
          </div>
          <div className="form-group">
            <label>Center X</label>
            <input
              type="number"
              value={state.centerX}
              onChange={(e) => setState({ ...state, centerX: e.target.value })}
              placeholder="0"
              step="0.001"
            />
          </div>
          <div className="form-group">
            <label>Center Y</label>
            <input
              type="number"
              value={state.centerY}
              onChange={(e) => setState({ ...state, centerY: e.target.value })}
              placeholder="0"
              step="0.001"
            />
          </div>
        </div>
      </Card>

      {/* Visual Preview */}
      {holes.length > 0 && (
        <Card title="Preview" icon="👁️">
          <div className="bolt-preview">
            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="bolt-svg">
              {/* Bolt circle */}
              <circle
                cx={svgCenter}
                cy={svgCenter}
                r={radius}
                fill="none"
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              {/* Center mark */}
              <line
                x1={svgCenter - 5}
                y1={svgCenter}
                x2={svgCenter + 5}
                y2={svgCenter}
                stroke="var(--muted)"
                strokeWidth="1"
              />
              <line
                x1={svgCenter}
                y1={svgCenter - 5}
                x2={svgCenter}
                y2={svgCenter + 5}
                stroke="var(--muted)"
                strokeWidth="1"
              />
              {/* Holes */}
              {holes.map((hole) => {
                const cx = svgCenter + ((hole.x - (parseFloat(state.centerX) || 0)) * scale);
                const cy = svgCenter - ((hole.y - (parseFloat(state.centerY) || 0)) * scale);
                return (
                  <g key={hole.number}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="8"
                      fill="var(--accent)"
                      stroke="var(--bg)"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={cy + 3}
                      textAnchor="middle"
                      className="hole-number"
                    >
                      {hole.number}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>
      )}

      {/* Results Table */}
      {holes.length > 0 && (
        <Card title="Hole Positions" icon="📋">
          <div className="bolt-table-wrapper">
            <table className="bolt-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Angle°</th>
                  <th>X</th>
                  <th>Y</th>
                </tr>
              </thead>
              <tbody>
                {holes.map((hole) => (
                  <tr key={hole.number}>
                    <td className="hole-num">{hole.number}</td>
                    <td>{hole.angle.toFixed(2)}°</td>
                    <td className="coord">{hole.x.toFixed(4)}</td>
                    <td className="coord">{hole.y.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className={`copy-coords-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyCoordinates}
          >
            {copied ? '✓ Copied!' : 'Copy Coordinates'}
          </button>
        </Card>
      )}
    </div>
  );
};
