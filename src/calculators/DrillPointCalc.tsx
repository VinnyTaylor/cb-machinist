import React, { useMemo } from 'react';
import { Card } from '../components/Card';
import { ResultItem } from '../components/ResultItem';
import { ResetButton } from '../components/ResetButton';
import { NoteBox } from '../components/NoteBox';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useUnits } from '../hooks/useUnits';
import './DrillPointCalc.css';

const MM_PER_INCH = 25.4;

interface DrillPointState {
  diameter: string;
  pointAngle: string;
  desiredDepth: string;
}

const defaultState: DrillPointState = {
  diameter: '0.5',
  pointAngle: '118',
  desiredDepth: '1.0'
};

// Common drill point angles
const commonAngles = [
  { angle: 118, use: 'General purpose - steel, aluminum' },
  { angle: 135, use: 'Harder materials - stainless, titanium' },
  { angle: 90, use: 'Soft materials, sheet metal' },
  { angle: 140, use: 'High hardness alloys' },
  { angle: 60, use: 'Spotting drills, center drills' }
];

export const DrillPointCalc: React.FC = () => {
  const [state, setState] = useLocalStorage<DrillPointState>('drill-point-calc', defaultState);
  const { units } = useUnits();
  const isMetric = units === 'metric';
  const lengthUnit = isMetric ? 'mm' : 'in';

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

  // Validation and results
  const { results, error } = useMemo(() => {
    const diameter = parseFloat(state.diameter);
    const pointAngle = parseFloat(state.pointAngle);
    const desiredDepth = parseFloat(state.desiredDepth) || 0;

    // Validation
    if (state.diameter && (isNaN(diameter) || diameter <= 0)) {
      return { results: null, error: 'Drill diameter must be greater than 0' };
    }
    if (state.pointAngle && isNaN(pointAngle)) {
      return { results: null, error: 'Point angle must be a number' };
    }
    if (pointAngle <= 0 || pointAngle >= 180) {
      return { results: null, error: 'Point angle must be between 0° and 180°' };
    }
    if (state.desiredDepth && (isNaN(desiredDepth) || desiredDepth < 0)) {
      return { results: null, error: 'Desired depth cannot be negative' };
    }

    if (!diameter || diameter <= 0) {
      return { results: null, error: null };
    }

    // Point length = (diameter / 2) / tan(pointAngle / 2)
    const halfAngleRad = (pointAngle / 2) * (Math.PI / 180);
    const pointLength = (diameter / 2) / Math.tan(halfAngleRad);

    // Total drill depth needed for desired flat-bottom depth
    const totalDepth = desiredDepth > 0 ? desiredDepth + pointLength : 0;

    // Point volume (cone volume = 1/3 * π * r² * h)
    const radius = diameter / 2;
    const pointVolume = (1 / 3) * Math.PI * radius * radius * pointLength;

    return {
      results: {
        pointLength: pointLength.toFixed(4),
        totalDepth: totalDepth.toFixed(4),
        pointVolume: pointVolume.toFixed(6),
        halfAngle: (pointAngle / 2).toFixed(2)
      },
      error: null
    };
  }, [state]);

  const handleReset = () => {
    setState(defaultState);
  };

  const handleAngleClick = (angle: number) => {
    setState({ ...state, pointAngle: angle.toString() });
  };

  return (
    <div className="drill-point-calc">
      <Card title="Drill Point Calculator" icon="🔧">
        <div className="card-header-row">
          <ResetButton onClick={handleReset} />
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label>Drill Diameter ({lengthUnit})</label>
            <input
              type="number"
              value={toDisplay(state.diameter, 2)}
              onChange={(e) => setState({ ...state, diameter: toInternal(e.target.value) })}
              placeholder={lengthUnit}
              step={isMetric ? "0.5" : "0.001"}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Point Angle</label>
            <input
              type="number"
              value={state.pointAngle}
              onChange={(e) => setState({ ...state, pointAngle: e.target.value })}
              placeholder="Degrees"
              step="1"
              min="1"
              max="179"
            />
          </div>
          <div className="form-group">
            <label>Desired Depth ({lengthUnit})</label>
            <input
              type="number"
              value={toDisplay(state.desiredDepth, 2)}
              onChange={(e) => setState({ ...state, desiredDepth: toInternal(e.target.value) })}
              placeholder="Flat bottom"
              step={isMetric ? "0.5" : "0.001"}
              min="0"
            />
          </div>
        </div>

        {error ? (
          <NoteBox variant="warning">
            {error}
          </NoteBox>
        ) : (
          <NoteBox variant="info">
            Enter desired flat-bottom depth to calculate total drill depth needed
          </NoteBox>
        )}
      </Card>

      {results && !error && (
        <Card title="Results" icon="📊">
          <div className="results-grid">
            <ResultItem
              label="Point Length"
              value={isMetric ? (parseFloat(results.pointLength) * MM_PER_INCH).toFixed(2) : results.pointLength}
              unit={lengthUnit}
              variant="accent"
            />
            <ResultItem
              label="Half Angle"
              value={results.halfAngle}
              unit="°"
              variant="default"
            />
          </div>

          {parseFloat(state.desiredDepth) > 0 && (
            <div className="results-grid" style={{ marginTop: '1rem' }}>
              <ResultItem
                label="Total Drill Depth"
                value={isMetric ? (parseFloat(results.totalDepth) * MM_PER_INCH).toFixed(2) : results.totalDepth}
                unit={lengthUnit}
                variant="accent2"
              />
              <ResultItem
                label="Point Volume"
                value={isMetric ? (parseFloat(results.pointVolume) * 16387.064).toFixed(2) : results.pointVolume}
                unit={isMetric ? "mm³" : "in³"}
                variant="default"
              />
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <NoteBox variant="tip">
              Total Drill Depth = Desired Flat Depth + Point Length
            </NoteBox>
          </div>
        </Card>
      )}

      <Card title="Common Point Angles" icon="📋">
        <div className="angle-table-wrapper">
          <table className="angle-table">
            <thead>
              <tr>
                <th>Angle</th>
                <th>Application</th>
              </tr>
            </thead>
            <tbody>
              {commonAngles.map((item) => (
                <tr
                  key={item.angle}
                  onClick={() => handleAngleClick(item.angle)}
                  className="clickable"
                >
                  <td className="mono">{item.angle}°</td>
                  <td>{item.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <NoteBox variant="tip">
          Tap a row to use that angle
        </NoteBox>
      </Card>
    </div>
  );
};
