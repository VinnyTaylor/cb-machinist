import React, { useMemo } from 'react';
import { Card } from '../components/Card';
import { ResultItem } from '../components/ResultItem';
import { ResetButton } from '../components/ResetButton';
import { NoteBox } from '../components/NoteBox';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './TaperCalc.css';

interface TaperState {
  d1: string; // Large diameter
  d2: string; // Small diameter
  length: string;
  tpf: string; // Taper per foot
  halfAngle: string;
}

const defaultState: TaperState = {
  d1: '1.0',
  d2: '0.75',
  length: '3.0',
  tpf: '',
  halfAngle: ''
};

// Common taper references
const taperReferences = [
  { name: 'Morse Taper #1', tpf: 0.5986, halfAngle: 1.428 },
  { name: 'Morse Taper #2', tpf: 0.5994, halfAngle: 1.430 },
  { name: 'Morse Taper #3', tpf: 0.6024, halfAngle: 1.438 },
  { name: 'Morse Taper #4', tpf: 0.6233, halfAngle: 1.488 },
  { name: 'Morse Taper #5', tpf: 0.6315, halfAngle: 1.508 },
  { name: 'Jacobs #33', tpf: 0.6241, halfAngle: 1.490 },
  { name: 'R8 Collet', tpf: 3.500, halfAngle: 8.297 },
  { name: '5C Collet', tpf: 2.500, halfAngle: 5.943 }
];

export const TaperCalc: React.FC = () => {
  const [state, setState] = useLocalStorage<TaperState>('taper-calc', defaultState);

  const handleReset = () => {
    setState(defaultState);
  };

  const { results, error } = useMemo(() => {
    const d1 = parseFloat(state.d1);
    const d2 = parseFloat(state.d2);
    const length = parseFloat(state.length);
    const tpf = parseFloat(state.tpf);
    const halfAngle = parseFloat(state.halfAngle);

    // Validation
    if (state.d1.trim() && (isNaN(d1) || d1 < 0)) {
      return { results: null, error: 'D1 must be a positive number' };
    }
    if (state.d2.trim() && (isNaN(d2) || d2 < 0)) {
      return { results: null, error: 'D2 must be a positive number' };
    }
    if (state.length.trim() && (isNaN(length) || length <= 0)) {
      return { results: null, error: 'Length must be greater than 0' };
    }
    if (state.tpf.trim() && (isNaN(tpf) || tpf < 0)) {
      return { results: null, error: 'Taper per foot must be positive' };
    }
    if (state.halfAngle.trim() && (isNaN(halfAngle) || halfAngle <= 0 || halfAngle >= 90)) {
      return { results: null, error: 'Half angle must be between 0° and 90°' };
    }

    let resultD1 = d1 || 0, resultD2 = d2 || 0, resultLength = length || 0;
    let resultTPI = 0, resultTPF = 0, resultHalfAngle = 0, resultIncludedAngle = 0;

    // Determine what to calculate based on inputs
    const hasD1 = state.d1.trim() !== '' && !isNaN(d1);
    const hasD2 = state.d2.trim() !== '' && !isNaN(d2);
    const hasLength = state.length.trim() !== '' && !isNaN(length);
    const hasTPF = state.tpf.trim() !== '' && !isNaN(tpf);
    const hasHalfAngle = state.halfAngle.trim() !== '' && !isNaN(halfAngle);

    if (hasD1 && hasD2 && hasLength) {
      if (d1 <= d2) {
        return { results: null, error: 'D1 (large dia) must be greater than D2 (small dia)' };
      }
      // Calculate from diameters and length
      resultTPI = (d1 - d2) / length;
      resultTPF = resultTPI * 12;
      resultHalfAngle = Math.atan(resultTPI / 2) * (180 / Math.PI);
      resultIncludedAngle = resultHalfAngle * 2;
    } else if (hasTPF && hasLength && hasD1) {
      // Calculate D2 from TPF
      resultTPI = tpf / 12;
      resultD2 = d1 - (resultTPI * length);
      if (resultD2 < 0) {
        return { results: null, error: 'Calculated D2 is negative - check your inputs' };
      }
      resultHalfAngle = Math.atan(resultTPI / 2) * (180 / Math.PI);
      resultIncludedAngle = resultHalfAngle * 2;
      resultTPF = tpf;
    } else if (hasTPF && hasLength && hasD2) {
      // Calculate D1 from TPF
      resultTPI = tpf / 12;
      resultD1 = d2 + (resultTPI * length);
      resultHalfAngle = Math.atan(resultTPI / 2) * (180 / Math.PI);
      resultIncludedAngle = resultHalfAngle * 2;
      resultTPF = tpf;
    } else if (hasHalfAngle && hasLength && hasD1) {
      // Calculate D2 from half angle
      resultTPI = 2 * Math.tan(halfAngle * Math.PI / 180);
      resultD2 = d1 - (resultTPI * length);
      if (resultD2 < 0) {
        return { results: null, error: 'Calculated D2 is negative - angle too steep for given length' };
      }
      resultTPF = resultTPI * 12;
      resultHalfAngle = halfAngle;
      resultIncludedAngle = halfAngle * 2;
    } else if (hasHalfAngle && hasD1 && hasD2) {
      if (d1 <= d2) {
        return { results: null, error: 'D1 (large dia) must be greater than D2 (small dia)' };
      }
      // Calculate length from half angle and diameters
      resultTPI = 2 * Math.tan(halfAngle * Math.PI / 180);
      resultLength = (d1 - d2) / resultTPI;
      resultTPF = resultTPI * 12;
      resultHalfAngle = halfAngle;
      resultIncludedAngle = halfAngle * 2;
    } else {
      return { results: null, error: null };
    }

    if (resultD1 <= resultD2 || resultLength <= 0) {
      return { results: null, error: 'Invalid taper geometry' };
    }

    return {
      results: {
        d1: resultD1.toFixed(4),
        d2: resultD2.toFixed(4),
        length: resultLength.toFixed(4),
        tpi: resultTPI.toFixed(6),
        tpf: resultTPF.toFixed(4),
        halfAngle: resultHalfAngle.toFixed(4),
        includedAngle: resultIncludedAngle.toFixed(4)
      },
      error: null
    };
  }, [state]);

  return (
    <div className="taper-calc">
      <Card title="Taper Calculator" icon="📏">
        <div className="card-header-row">
          <ResetButton onClick={handleReset} />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>D1 (Large Dia)</label>
            <input
              type="number"
              value={state.d1}
              onChange={(e) => setState({ ...state, d1: e.target.value })}
              placeholder="Inches"
              step="0.001"
            />
          </div>
          <div className="form-group">
            <label>D2 (Small Dia)</label>
            <input
              type="number"
              value={state.d2}
              onChange={(e) => setState({ ...state, d2: e.target.value })}
              placeholder="Inches"
              step="0.001"
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label>Length</label>
            <input
              type="number"
              value={state.length}
              onChange={(e) => setState({ ...state, length: e.target.value })}
              placeholder="Inches"
              step="0.001"
            />
          </div>
          <div className="form-group">
            <label>Taper/Foot</label>
            <input
              type="number"
              value={state.tpf}
              onChange={(e) => setState({ ...state, tpf: e.target.value })}
              placeholder="TPF"
              step="0.0001"
            />
          </div>
          <div className="form-group">
            <label>Half Angle</label>
            <input
              type="number"
              value={state.halfAngle}
              onChange={(e) => setState({ ...state, halfAngle: e.target.value })}
              placeholder="Degrees"
              step="0.001"
            />
          </div>
        </div>

        {error ? (
          <NoteBox variant="warning">
            {error}
          </NoteBox>
        ) : (
          <p className="taper-hint">
            Enter D1, D2 + Length; or TPF + Length + one diameter; or Half Angle + two values
          </p>
        )}
      </Card>

      {results && !error && (
        <Card title="Results" icon="📊">
          <div className="results-grid">
            <ResultItem label="Large Dia (D1)" value={results.d1} unit="in" variant="accent" />
            <ResultItem label="Small Dia (D2)" value={results.d2} unit="in" variant="accent2" />
            <ResultItem label="Length" value={results.length} unit="in" variant="default" />
          </div>
          <div className="results-grid" style={{ marginTop: '1rem' }}>
            <ResultItem label="Taper/Inch" value={results.tpi} variant="default" />
            <ResultItem label="Taper/Foot" value={results.tpf} variant="accent3" />
          </div>
          <div className="results-grid" style={{ marginTop: '1rem' }}>
            <ResultItem label="Half Angle" value={results.halfAngle} unit="°" variant="accent" />
            <ResultItem label="Included Angle" value={results.includedAngle} unit="°" variant="accent2" />
          </div>
        </Card>
      )}

      {/* Reference Table */}
      <Card title="Common Tapers" icon="📋">
        <div className="taper-table-wrapper">
          <table className="taper-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>TPF</th>
                <th>Half Angle</th>
              </tr>
            </thead>
            <tbody>
              {taperReferences.map((taper) => (
                <tr
                  key={taper.name}
                  onClick={() => setState({
                    ...state,
                    tpf: taper.tpf.toString(),
                    halfAngle: taper.halfAngle.toString()
                  })}
                  className="clickable"
                >
                  <td>{taper.name}</td>
                  <td className="mono">{taper.tpf.toFixed(4)}</td>
                  <td className="mono">{taper.halfAngle.toFixed(3)}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <NoteBox variant="tip">
          Tap a row to use that taper's values
        </NoteBox>
      </Card>
    </div>
  );
};
