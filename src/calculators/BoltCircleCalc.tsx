import React, { useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { ResetButton } from '../components/ResetButton';
import { NoteBox } from '../components/NoteBox';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useUnits } from '../hooks/useUnits';
import './BoltCircleCalc.css';

const MM_PER_INCH = 25.4;

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

const defaultState: BoltCircleState = {
  bcd: '4.0',
  numHoles: '6',
  startAngle: '0',
  centerX: '0',
  centerY: '0'
};

export const BoltCircleCalc: React.FC = () => {
  const [state, setState] = useLocalStorage<BoltCircleState>('bolt-circle', defaultState);
  const [copied, setCopied] = useState(false);
  const { units } = useUnits();
  const isMetric = units === 'metric';
  const lengthUnit = isMetric ? 'mm' : 'in';

  const handleReset = () => {
    setState(defaultState);
  };

  // Convert display value to internal (inches)
  const toInternal = (display: string) => {
    const val = parseFloat(display);
    return isMetric ? String(val / MM_PER_INCH) : display;
  };

  // Convert internal (inches) to display value
  const toDisplay = (internal: string, decimals = 3) => {
    const val = parseFloat(internal);
    if (isNaN(val)) return internal;
    return isMetric ? (val * MM_PER_INCH).toFixed(decimals) : internal;
  };

  const { holes, error } = useMemo((): { holes: HolePosition[], error: string | null } => {
    const bcd = parseFloat(state.bcd);
    const numHoles = parseInt(state.numHoles);
    const startAngle = parseFloat(state.startAngle) || 0;
    const centerX = parseFloat(state.centerX) || 0;
    const centerY = parseFloat(state.centerY) || 0;

    // Validation
    if (isNaN(bcd) || state.bcd.trim() === '') {
      return { holes: [], error: null }; // No error for empty input
    }
    if (bcd <= 0) {
      return { holes: [], error: 'BCD diameter must be greater than 0' };
    }
    if (isNaN(numHoles) || state.numHoles.trim() === '') {
      return { holes: [], error: null };
    }
    if (numHoles < 2) {
      return { holes: [], error: 'Number of holes must be at least 2' };
    }
    if (numHoles > 36) {
      return { holes: [], error: 'Number of holes cannot exceed 36' };
    }

    const radius = bcd / 2;
    const angleStep = 360 / numHoles;

    const positions = Array.from({ length: numHoles }, (_, i) => {
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

    return { holes: positions, error: null };
  }, [state]);

  const handleCopyCoordinates = async () => {
    const coords = holes
      .map((h) => {
        const x = isMetric ? (h.x * MM_PER_INCH).toFixed(3) : h.x.toFixed(4);
        const y = isMetric ? (h.y * MM_PER_INCH).toFixed(3) : h.y.toFixed(4);
        return `X${x} Y${y}`;
      })
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
        <div className="card-header-row">
          <ResetButton onClick={handleReset} />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>BCD Diameter ({lengthUnit})</label>
            <input
              type="number"
              value={toDisplay(state.bcd, 2)}
              onChange={(e) => setState({ ...state, bcd: toInternal(e.target.value) })}
              placeholder={lengthUnit}
              step={isMetric ? "1" : "0.125"}
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
            <label>Center X ({lengthUnit})</label>
            <input
              type="number"
              value={toDisplay(state.centerX, 3)}
              onChange={(e) => setState({ ...state, centerX: toInternal(e.target.value) })}
              placeholder="0"
              step={isMetric ? "0.1" : "0.001"}
            />
          </div>
          <div className="form-group">
            <label>Center Y ({lengthUnit})</label>
            <input
              type="number"
              value={toDisplay(state.centerY, 3)}
              onChange={(e) => setState({ ...state, centerY: toInternal(e.target.value) })}
              placeholder="0"
              step={isMetric ? "0.1" : "0.001"}
            />
          </div>
        </div>

        {error && (
          <NoteBox variant="warning" title="Error">
            {error}
          </NoteBox>
        )}
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
                  <th>X ({lengthUnit})</th>
                  <th>Y ({lengthUnit})</th>
                </tr>
              </thead>
              <tbody>
                {holes.map((hole) => (
                  <tr key={hole.number}>
                    <td className="hole-num">{hole.number}</td>
                    <td>{hole.angle.toFixed(2)}°</td>
                    <td className="coord">{isMetric ? (hole.x * MM_PER_INCH).toFixed(3) : hole.x.toFixed(4)}</td>
                    <td className="coord">{isMetric ? (hole.y * MM_PER_INCH).toFixed(3) : hole.y.toFixed(4)}</td>
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
