import React, { useMemo } from 'react';
import { Card } from '../components/Card';
import { ResultItem } from '../components/ResultItem';
import { ResetButton } from '../components/ResetButton';
import { NoteBox } from '../components/NoteBox';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './DrillPointCalc.css';

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

  const results = useMemo(() => {
    const diameter = parseFloat(state.diameter) || 0;
    const pointAngle = parseFloat(state.pointAngle) || 0;
    const desiredDepth = parseFloat(state.desiredDepth) || 0;

    if (diameter <= 0 || pointAngle <= 0 || pointAngle >= 180) {
      return null;
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
      pointLength: pointLength.toFixed(4),
      totalDepth: totalDepth.toFixed(4),
      pointVolume: pointVolume.toFixed(6),
      halfAngle: (pointAngle / 2).toFixed(2)
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
            <label>Drill Diameter</label>
            <input
              type="number"
              value={state.diameter}
              onChange={(e) => setState({ ...state, diameter: e.target.value })}
              placeholder="Inches"
              step="0.001"
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
            <label>Desired Depth</label>
            <input
              type="number"
              value={state.desiredDepth}
              onChange={(e) => setState({ ...state, desiredDepth: e.target.value })}
              placeholder="Flat bottom"
              step="0.001"
              min="0"
            />
          </div>
        </div>

        <NoteBox variant="info">
          Enter desired flat-bottom depth to calculate total drill depth needed
        </NoteBox>
      </Card>

      {results && (
        <Card title="Results" icon="📊">
          <div className="results-grid">
            <ResultItem
              label="Point Length"
              value={results.pointLength}
              unit="in"
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
                value={results.totalDepth}
                unit="in"
                variant="accent2"
              />
              <ResultItem
                label="Point Volume"
                value={results.pointVolume}
                unit="in³"
                variant="default"
              />
            </div>
          )}

          <NoteBox variant="tip" style={{ marginTop: '1rem' }}>
            Total Drill Depth = Desired Flat Depth + Point Length
          </NoteBox>
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
