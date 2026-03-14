import { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { ResultItem } from '../components/ResultItem';
import { NoteBox } from '../components/NoteBox';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './TrigCalc.css';

interface TrigState {
  sideA: string;
  sideB: string;
  sideC: string;
  angleTheta: string;
  anglePhi: string;
  lookupAngle: string;
}

export const TrigCalc: React.FC = () => {
  const [state, setState] = useLocalStorage<TrigState>('trig-calc', {
    sideA: '',
    sideB: '',
    sideC: '',
    angleTheta: '',
    anglePhi: '',
    lookupAngle: '45'
  });

  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (field: keyof TrigState, value: string) => {
    setState({ ...state, [field]: value });
  };

  // Triangle calculations
  const results = useMemo(() => {
    setError(null);

    const a = parseFloat(state.sideA) || 0;
    const b = parseFloat(state.sideB) || 0;
    const c = parseFloat(state.sideC) || 0;
    const theta = parseFloat(state.angleTheta) || 0;
    const phi = parseFloat(state.anglePhi) || 0;

    const inputs = [
      { name: 'sideA', value: a, isSet: !!state.sideA.trim() },
      { name: 'sideB', value: b, isSet: !!state.sideB.trim() },
      { name: 'sideC', value: c, isSet: !!state.sideC.trim() },
      { name: 'angleTheta', value: theta, isSet: !!state.angleTheta.trim() },
      { name: 'anglePhi', value: phi, isSet: !!state.anglePhi.trim() }
    ];

    const setInputs = inputs.filter(i => i.isSet);
    if (setInputs.length < 2) {
      return null;
    }

    let resultA = a, resultB = b, resultC = c, resultTheta = theta;
    // Note: resultPhi is always calculated as 90 - resultTheta
    const toRad = (deg: number) => deg * Math.PI / 180;
    const toDeg = (rad: number) => rad * 180 / Math.PI;

    try {
      // Solve based on what's given
      if (state.sideA.trim() && state.sideB.trim()) {
        // Given A and B
        resultC = Math.sqrt(a * a + b * b);
        resultTheta = toDeg(Math.atan(b / a));
        
      } else if (state.sideA.trim() && state.sideC.trim()) {
        // Given A and C (hypotenuse)
        if (c <= a) {
          setError('Hypotenuse must be greater than adjacent side');
          return null;
        }
        resultB = Math.sqrt(c * c - a * a);
        resultTheta = toDeg(Math.acos(a / c));
        
      } else if (state.sideB.trim() && state.sideC.trim()) {
        // Given B and C (hypotenuse)
        if (c <= b) {
          setError('Hypotenuse must be greater than opposite side');
          return null;
        }
        resultA = Math.sqrt(c * c - b * b);
        resultTheta = toDeg(Math.asin(b / c));
        
      } else if (state.sideA.trim() && state.angleTheta.trim()) {
        // Given A and theta
        resultB = a * Math.tan(toRad(theta));
        resultC = a / Math.cos(toRad(theta));
        
      } else if (state.sideA.trim() && state.anglePhi.trim()) {
        // Given A and phi
        resultTheta = 90 - phi;
        resultB = a * Math.tan(toRad(resultTheta));
        resultC = a / Math.cos(toRad(resultTheta));
      } else if (state.sideB.trim() && state.angleTheta.trim()) {
        // Given B and theta
        resultA = b / Math.tan(toRad(theta));
        resultC = b / Math.sin(toRad(theta));
        
      } else if (state.sideB.trim() && state.anglePhi.trim()) {
        // Given B and phi
        resultTheta = 90 - phi;
        resultA = b / Math.tan(toRad(resultTheta));
        resultC = b / Math.sin(toRad(resultTheta));
      } else if (state.sideC.trim() && state.angleTheta.trim()) {
        // Given C and theta
        resultA = c * Math.cos(toRad(theta));
        resultB = c * Math.sin(toRad(theta));
        
      } else if (state.sideC.trim() && state.anglePhi.trim()) {
        // Given C and phi
        resultTheta = 90 - phi;
        resultA = c * Math.cos(toRad(resultTheta));
        resultB = c * Math.sin(toRad(resultTheta));
      } else if (state.angleTheta.trim() && state.anglePhi.trim()) {
        // Can't solve with just angles
        setError('Need at least one side length');
        return null;
      }

      // Validate results
      if (resultA <= 0 || resultB <= 0 || resultC <= 0 ||
        resultTheta <= 0 || resultTheta >= 90 ||
        isNaN(resultA) || isNaN(resultB) || isNaN(resultC)) {
        setError('Invalid triangle - check your inputs');
        return null;
      }

      const area = (resultA * resultB) / 2;

      return {
        sideA: resultA.toFixed(4),
        sideB: resultB.toFixed(4),
        sideC: resultC.toFixed(4),
        angleTheta: resultTheta.toFixed(2),
        anglePhi: (90 - resultTheta).toFixed(2),
        area: area.toFixed(4)
      };
    } catch {
      setError('Invalid triangle');
      return null;
    }
  }, [state.sideA, state.sideB, state.sideC, state.angleTheta, state.anglePhi]);

  // Lookup calculations
  const lookupResults = useMemo(() => {
    const angle = parseFloat(state.lookupAngle) || 0;
    if (angle <= 0 || angle >= 90) return null;

    const rad = angle * Math.PI / 180;
    return {
      sin: Math.sin(rad).toFixed(6),
      cos: Math.cos(rad).toFixed(6),
      tan: Math.tan(rad).toFixed(6)
    };
  }, [state.lookupAngle]);

  return (
    <div className="trig-calc">
      <Card title="Right Triangle Solver" icon="📐">
        {/* SVG Triangle Diagram */}
        <div className="triangle-diagram">
          <svg viewBox="0 0 200 150" className="triangle-svg">
            {/* Triangle */}
            <polygon
              points="20,130 180,130 20,20"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
            />
            {/* Right angle box */}
            <path
              d="M 20,115 L 35,115 L 35,130"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="1.5"
            />
            {/* Labels */}
            <text x="100" y="145" className="label-text">A (adjacent)</text>
            <text x="5" y="75" className="label-text" transform="rotate(-90, 10, 75)">B (opp)</text>
            <text x="110" y="65" className="label-text">C (hyp)</text>
            <text x="35" y="35" className="label-text">θ</text>
            <text x="160" y="125" className="label-text">φ</text>
          </svg>
        </div>

        <p className="trig-instruction">Enter any 2 values to solve the triangle:</p>

        <div className="grid-2">
          <div className="form-group">
            <label>Side A (Adjacent)</label>
            <input
              type="number"
              value={state.sideA}
              onChange={(e) => handleInputChange('sideA', e.target.value)}
              placeholder="Length"
              step="0.001"
            />
          </div>
          <div className="form-group">
            <label>Side B (Opposite)</label>
            <input
              type="number"
              value={state.sideB}
              onChange={(e) => handleInputChange('sideB', e.target.value)}
              placeholder="Length"
              step="0.001"
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Side C (Hypotenuse)</label>
            <input
              type="number"
              value={state.sideC}
              onChange={(e) => handleInputChange('sideC', e.target.value)}
              placeholder="Length"
              step="0.001"
            />
          </div>
          <div className="form-group">
            <label>Angle θ (degrees)</label>
            <input
              type="number"
              value={state.angleTheta}
              onChange={(e) => handleInputChange('angleTheta', e.target.value)}
              placeholder="0 - 90"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Angle φ (degrees)</label>
          <input
            type="number"
            value={state.anglePhi}
            onChange={(e) => handleInputChange('anglePhi', e.target.value)}
            placeholder="0 - 90"
            step="0.1"
          />
        </div>

        {error && (
          <NoteBox variant="warning" title="Error">
            {error}
          </NoteBox>
        )}
      </Card>

      {/* Results */}
      {results && (
        <Card title="Results" icon="📊">
          <div className="results-grid">
            <ResultItem label="Side A" value={results.sideA} variant="accent" />
            <ResultItem label="Side B" value={results.sideB} variant="accent2" />
            <ResultItem label="Side C" value={results.sideC} variant="accent3" />
          </div>
          <div className="results-grid" style={{ marginTop: '1rem' }}>
            <ResultItem label="Angle θ" value={results.angleTheta} unit="°" variant="default" />
            <ResultItem label="Angle φ" value={results.anglePhi} unit="°" variant="default" />
            <ResultItem label="Area" value={results.area} unit="sq" variant="default" />
          </div>
        </Card>
      )}

      {/* Quick Lookup */}
      <Card title="Quick Trig Lookup" icon="🔢">
        <div className="form-group">
          <label>Angle (degrees)</label>
          <input
            type="number"
            value={state.lookupAngle}
            onChange={(e) => setState({ ...state, lookupAngle: e.target.value })}
            placeholder="0 - 90"
            step="1"
            min="0"
            max="90"
          />
        </div>

        {lookupResults && (
          <div className="results-grid" style={{ marginTop: '0.75rem' }}>
            <ResultItem label="sin" value={lookupResults.sin} variant="accent" />
            <ResultItem label="cos" value={lookupResults.cos} variant="accent2" />
            <ResultItem label="tan" value={lookupResults.tan} variant="accent3" />
          </div>
        )}
      </Card>
    </div>
  );
};
