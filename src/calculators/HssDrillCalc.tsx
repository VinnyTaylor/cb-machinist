import React, { useMemo } from 'react';
import { Card } from '../components/Card';
import { ResultItem } from '../components/ResultItem';
import { ResetButton } from '../components/ResetButton';
import { NoteBox } from '../components/NoteBox';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  hssMaterials,
  getHssMaterial,
  getHssIpr,
  calculateRpm,
  calculateIpm,
  calculatePeckDepth
} from '../data/hssDrills';
import './HssDrillCalc.css';

interface HssDrillState {
  materialId: string;
  diameter: string;
  holeDepth: string;
}

const defaultState: HssDrillState = {
  materialId: 'mild-steel',
  diameter: '0.25',
  holeDepth: ''
};

export const HssDrillCalc: React.FC = () => {
  const [state, setState] = useLocalStorage<HssDrillState>('hss-drill-calc', defaultState);

  const { results, error, peckInfo } = useMemo(() => {
    const diameter = parseFloat(state.diameter);
    const holeDepth = parseFloat(state.holeDepth) || 0;

    // Validation
    if (state.diameter && (isNaN(diameter) || diameter <= 0)) {
      return { results: null, error: 'Drill diameter must be greater than 0', peckInfo: null };
    }
    if (diameter > 3) {
      return { results: null, error: 'Drill diameter exceeds typical HSS range (>3")', peckInfo: null };
    }
    if (state.holeDepth && (isNaN(holeDepth) || holeDepth < 0)) {
      return { results: null, error: 'Hole depth cannot be negative', peckInfo: null };
    }

    if (!diameter || diameter <= 0) {
      return { results: null, error: null, peckInfo: null };
    }

    const material = getHssMaterial(state.materialId);
    if (!material) {
      return { results: null, error: 'Please select a material', peckInfo: null };
    }

    const sfmMin = material.sfm.min;
    const sfmMax = material.sfm.max;
    const iprRange = getHssIpr(diameter);

    // Calculate RPM range
    const rpmMin = Math.round(calculateRpm(sfmMin, diameter));
    const rpmMax = Math.round(calculateRpm(sfmMax, diameter));
    const rpmMid = Math.round((rpmMin + rpmMax) / 2);

    // Calculate IPM range at middle RPM
    const ipmMin = calculateIpm(iprRange.min, rpmMid);
    const ipmMax = calculateIpm(iprRange.max, rpmMid);

    // Calculate peck info if depth provided
    const peckData = holeDepth > 0 ? calculatePeckDepth(diameter, holeDepth) : null;

    return {
      results: {
        rpmMin,
        rpmMax,
        rpmMid,
        iprMin: iprRange.min.toFixed(4),
        iprMax: iprRange.max.toFixed(4),
        ipmMin: ipmMin.toFixed(1),
        ipmMax: ipmMax.toFixed(1),
        sfmMin,
        sfmMax,
        materialNotes: material.notes
      },
      error: null,
      peckInfo: peckData
    };
  }, [state]);

  const handleReset = () => {
    setState(defaultState);
  };

  const selectedMaterial = getHssMaterial(state.materialId);

  return (
    <div className="hss-drill-calc">
      <Card title="HSS Drill Calculator" icon="🔩">
        <div className="card-header-row">
          <ResetButton onClick={handleReset} />
        </div>

        <div className="form-group">
          <label>Material</label>
          <select
            value={state.materialId}
            onChange={(e) => setState({ ...state, materialId: e.target.value })}
          >
            {hssMaterials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Drill Diameter</label>
            <input
              type="number"
              value={state.diameter}
              onChange={(e) => setState({ ...state, diameter: e.target.value })}
              placeholder="Inches"
              step="0.001"
              min="0.001"
              max="3"
            />
          </div>
          <div className="form-group">
            <label>Hole Depth (optional)</label>
            <input
              type="number"
              value={state.holeDepth}
              onChange={(e) => setState({ ...state, holeDepth: e.target.value })}
              placeholder="Inches"
              step="0.001"
              min="0"
            />
          </div>
        </div>

        {error && (
          <NoteBox variant="warning">
            {error}
          </NoteBox>
        )}
      </Card>

      {results && !error && (
        <>
          <Card title="Recommended Parameters" icon="📊">
            <div className="results-grid">
              <ResultItem
                label="RPM Range"
                value={`${results.rpmMin} - ${results.rpmMax}`}
                variant="accent"
                size="large"
              />
              <ResultItem
                label="Suggested RPM"
                value={results.rpmMid}
                variant="accent2"
                size="large"
              />
            </div>

            <div className="results-grid" style={{ marginTop: '1rem' }}>
              <ResultItem
                label="Feed (IPR)"
                value={`${results.iprMin} - ${results.iprMax}`}
                variant="default"
              />
              <ResultItem
                label="Feed (IPM)"
                value={`${results.ipmMin} - ${results.ipmMax}`}
                unit="IPM"
                variant="accent3"
              />
            </div>

            <div className="sfm-reference" style={{ marginTop: '1rem' }}>
              <span className="sfm-label">SFM Range:</span>
              <span className="sfm-value">{results.sfmMin} - {results.sfmMax} SFM</span>
            </div>
          </Card>

          {peckInfo && (
            <Card title="Depth Analysis" icon="📏">
              <div className="results-grid">
                <ResultItem
                  label="Depth Ratio"
                  value={peckInfo.depthRatio.toFixed(1)}
                  unit="x diameter"
                  variant={peckInfo.isPeckRequired ? 'accent3' : 'default'}
                />
                {peckInfo.isPeckRequired && (
                  <ResultItem
                    label="Peck Depth"
                    value={peckInfo.peckDepth.toFixed(3)}
                    unit="in"
                    variant="accent2"
                  />
                )}
              </div>

              {peckInfo.isPeckRequired ? (
                <NoteBox variant="warning" title="Deep Hole Warning">
                  Hole depth exceeds 4x diameter ({peckInfo.depthRatio.toFixed(1)}:1 ratio).
                  Use peck drilling cycle (G83) with approx. {peckInfo.numberOfPecks} pecks.
                </NoteBox>
              ) : (
                <NoteBox variant="info">
                  Standard drilling cycle is acceptable for this depth.
                </NoteBox>
              )}
            </Card>
          )}

          {selectedMaterial?.notes && (
            <NoteBox variant="tip" title={selectedMaterial.name}>
              {selectedMaterial.notes}
            </NoteBox>
          )}
        </>
      )}

      <Card title="IPR Reference by Diameter" icon="📋">
        <div className="ipr-table-wrapper">
          <table className="ipr-table">
            <thead>
              <tr>
                <th>Diameter Range</th>
                <th>IPR (min)</th>
                <th>IPR (max)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Under 1/8" (0.125")</td>
                <td className="mono">.001</td>
                <td className="mono">.003</td>
              </tr>
              <tr>
                <td>1/8" to 1/4"</td>
                <td className="mono">.002</td>
                <td className="mono">.006</td>
              </tr>
              <tr>
                <td>1/4" to 3/8"</td>
                <td className="mono">.003</td>
                <td className="mono">.008</td>
              </tr>
              <tr>
                <td>3/8" to 1/2"</td>
                <td className="mono">.004</td>
                <td className="mono">.010</td>
              </tr>
              <tr>
                <td>1/2" to 3/4"</td>
                <td className="mono">.006</td>
                <td className="mono">.012</td>
              </tr>
              <tr>
                <td>3/4" to 1"</td>
                <td className="mono">.007</td>
                <td className="mono">.015</td>
              </tr>
              <tr>
                <td>Over 1"</td>
                <td className="mono">.010</td>
                <td className="mono">.025</td>
              </tr>
            </tbody>
          </table>
        </div>
        <NoteBox variant="info">
          Start conservative (lower IPR), increase if chip evacuation is good.
          Reduce feed by 25-50% in deep holes.
        </NoteBox>
      </Card>
    </div>
  );
};
