import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { ResultItem } from '../components/ResultItem';
import { CodeBlock } from '../components/CodeBlock';
import { NoteBox } from '../components/NoteBox';
import { PillToggle } from '../components/PillToggle';
import { ResetButton } from '../components/ResetButton';
import { standardThreads, metricThreads, metricFineThreads, externalClasses, internalClasses, getThreadByName } from '../data/threads';
import { getBestWireSize, calculateMOverWires, calculatePitchDiameterFromM, wireReferenceData } from '../data/wireData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './ThreadCalc.css';

type InputMode = 'standard' | 'custom';
type ThreadType = 'un60' | 'iso60' | 'whitworth55' | 'acme29';
type ThreadSide = 'external' | 'internal';
type ThreadSystem = 'imperial' | 'metric' | 'metricFine';

interface ThreadState {
  inputMode: InputMode;
  threadSystem: ThreadSystem;
  standardSize: string;
  customMajorDia: string;
  customTPI: string;
  threadType: ThreadType;
  threadingRPM: string;
  threadLength: string;
  threadSide: ThreadSide;
  externalClass: string;
  internalClass: string;
  wireSize: string;
  mMeasurement: string;
}

const defaultState: ThreadState = {
  inputMode: 'standard',
  threadSystem: 'imperial',
  standardSize: '1/4-20',
  customMajorDia: '0.250',
  customTPI: '20',
  threadType: 'un60',
  threadingRPM: '400',
  threadLength: '0.5',
  threadSide: 'external',
  externalClass: '2A',
  internalClass: '2B',
  wireSize: '',
  mMeasurement: ''
};

// Get threads based on system
const getThreadsForSystem = (system: ThreadSystem) => {
  switch (system) {
    case 'metric':
      return metricThreads;
    case 'metricFine':
      return metricFineThreads;
    default:
      return standardThreads;
  }
};

export const ThreadCalc: React.FC = () => {
  const [state, setState] = useLocalStorage<ThreadState>('thread-calc', defaultState);
  const [showWireTable, setShowWireTable] = useState(false);

  const handleReset = () => {
    setState(defaultState);
  };

  // Get thread parameters based on input mode
  const threadParams = useMemo(() => {
    if (state.inputMode === 'standard') {
      const thread = getThreadByName(state.standardSize);
      if (thread) {
        return {
          majorDia: thread.majorDia,
          tpi: thread.tpi,
          pitch: thread.pitch
        };
      }
    }
    const tpi = parseFloat(state.customTPI) || 20;
    return {
      majorDia: parseFloat(state.customMajorDia) || 0.25,
      tpi,
      pitch: 1 / tpi
    };
  }, [state.inputMode, state.standardSize, state.customMajorDia, state.customTPI]);

  // Basic thread calculations
  const basicResults = useMemo(() => {
    const { majorDia, tpi, pitch } = threadParams;

    // Thread depth factors by type
    const threadDepthFactor = (state.threadType === 'un60' || state.threadType === 'iso60') ? 0.6495 :
      state.threadType === 'whitworth55' ? 0.6403 : 0.5;
    const threadDepth = threadDepthFactor * pitch;
    const minorDia = majorDia - 2 * threadDepth;
    const pitchDia = majorDia - threadDepth;

    // Tap drill (75% thread)
    const tapDrillDecimal = majorDia - (0.75 * 2 * threadDepth);

    // Threading feed
    const rpm = parseFloat(state.threadingRPM) || 400;
    const feedIPM = rpm / tpi;

    return {
      pitch: pitch.toFixed(5),
      threadDepth: threadDepth.toFixed(4),
      minorDia: minorDia.toFixed(4),
      pitchDia: pitchDia.toFixed(4),
      tapDrill: tapDrillDecimal.toFixed(4),
      feedIPM: feedIPM.toFixed(3)
    };
  }, [threadParams, state.threadType, state.threadingRPM]);

  // Class tolerance calculations
  const classResults = useMemo(() => {
    const { majorDia, pitch } = threadParams;
    const threadDepth = ((state.threadType === 'un60' || state.threadType === 'iso60') ? 0.6495 : 0.6403) * pitch;
    const nominalPitchDia = majorDia - threadDepth;
    const engagementLength = 1.5 * majorDia; // Default engagement

    // 2A tolerance calculation (base)
    const tol2A = 0.0015 * Math.pow(majorDia, 1 / 3) +
      0.015 * Math.pow(engagementLength, 1 / 3) +
      0.015 * Math.pow(pitch, 0.5);

    // 2A allowance
    const allow2A = 0.3 * Math.pow(pitch, 2 / 3);

    if (state.threadSide === 'external') {
      const classData = externalClasses.find(c => c.name === state.externalClass) || externalClasses[1];
      const tolerance = tol2A * classData.toleranceMultiplier;
      const allowance = classData.hasAllowance ? allow2A : 0;

      // External thread dimensions
      const maxMajorDia = majorDia - allowance;
      const minMajorDia = maxMajorDia - tolerance * 1.5;
      const maxPitchDia = nominalPitchDia - allowance;
      const minPitchDia = maxPitchDia - tolerance;
      const minMinorDia = maxMajorDia - 2 * threadDepth * 1.08; // Approximate

      return {
        type: 'external',
        className: classData.name,
        description: classData.description,
        maxMajorDia: maxMajorDia.toFixed(4),
        minMajorDia: minMajorDia.toFixed(4),
        maxPitchDia: maxPitchDia.toFixed(4),
        minPitchDia: minPitchDia.toFixed(4),
        minMinorDia: minMinorDia.toFixed(4),
        allowance: allowance.toFixed(5),
        tolerance: tolerance.toFixed(5)
      };
    } else {
      const classData = internalClasses.find(c => c.name === state.internalClass) || internalClasses[1];
      const tolerance = tol2A * classData.toleranceMultiplier;

      // Internal thread dimensions
      const minMinorDia = majorDia - 2 * threadDepth;
      const maxMinorDia = minMinorDia + tolerance;
      const minPitchDia = nominalPitchDia;
      const maxPitchDia = minPitchDia + tolerance;
      const maxMajorDia = majorDia + tolerance * 0.5;

      return {
        type: 'internal',
        className: classData.name,
        description: classData.description,
        minMinorDia: minMinorDia.toFixed(4),
        maxMinorDia: maxMinorDia.toFixed(4),
        minPitchDia: minPitchDia.toFixed(4),
        maxPitchDia: maxPitchDia.toFixed(4),
        maxMajorDia: maxMajorDia.toFixed(4),
        tolerance: tolerance.toFixed(5)
      };
    }
  }, [threadParams, state.threadType, state.threadSide, state.externalClass, state.internalClass]);

  // Wire measurement calculations
  const wireResults = useMemo(() => {
    const { pitch } = threadParams;
    const pitchDia = parseFloat(basicResults.pitchDia);

    const bestWire = getBestWireSize(pitch, state.threadType);
    const wireSize = parseFloat(state.wireSize) || bestWire;

    const mNominal = calculateMOverWires(pitchDia, wireSize, pitch, state.threadType);

    // M at class limits
    const maxPD = parseFloat(classResults.type === 'external' ? classResults.maxPitchDia : classResults.maxPitchDia);
    const minPD = parseFloat(classResults.type === 'external' ? classResults.minPitchDia : classResults.minPitchDia);

    const mAtMax = calculateMOverWires(maxPD, wireSize, pitch, state.threadType);
    const mAtMin = calculateMOverWires(minPD, wireSize, pitch, state.threadType);

    // If user entered M measurement, calculate actual PD
    let actualPD = null;
    let passStatus = null;
    if (state.mMeasurement) {
      const mMeas = parseFloat(state.mMeasurement);
      if (!isNaN(mMeas)) {
        actualPD = calculatePitchDiameterFromM(mMeas, wireSize, pitch, state.threadType);
        // Check if within tolerance
        if (state.threadSide === 'external') {
          passStatus = actualPD <= maxPD && actualPD >= minPD;
        } else {
          passStatus = actualPD >= minPD && actualPD <= maxPD;
        }
      }
    }

    return {
      bestWire: bestWire.toFixed(4),
      wireSize: wireSize.toFixed(4),
      mNominal: mNominal.toFixed(4),
      mAtMax: mAtMax.toFixed(4),
      mAtMin: mAtMin.toFixed(4),
      mRange: `${mAtMin.toFixed(4)} - ${mAtMax.toFixed(4)}`,
      actualPD: actualPD?.toFixed(4),
      passStatus
    };
  }, [threadParams, basicResults.pitchDia, state.threadType, state.wireSize, state.mMeasurement, classResults, state.threadSide]);

  // G76 code generation
  const g76Code = useMemo(() => {
    const { majorDia, tpi, pitch } = threadParams;
    const threadDepth = parseFloat(basicResults.threadDepth);
    const minorDia = parseFloat(basicResults.minorDia);
    const rpm = parseInt(state.threadingRPM) || 400;
    const length = parseFloat(state.threadLength) || 0.5;

    // Haas format
    const haasK = (threadDepth * 10000).toFixed(0); // K in ten-thousandths
    const haasD = Math.round(threadDepth * 10000 * 0.3); // First pass ~30% of depth
    const haasCode = `( THREAD: ${state.inputMode === 'standard' ? state.standardSize : `${majorDia}" - ${tpi} TPI`} )
G50 S${Math.round(rpm * 1.2)}
G97 S${rpm} M03
G00 X${(majorDia + 0.1).toFixed(3)} Z0.1
G76 X${minorDia.toFixed(4)} Z-${length.toFixed(3)} K${haasK} D${haasD} F${pitch.toFixed(5)} A29`;

    // Fanuc format
    const fanucP = `${2}${1}${29}`.padStart(6, '0'); // 2 finish passes, 1 chamfer, 29° angle
    const fanucCode = `( THREAD: ${state.inputMode === 'standard' ? state.standardSize : `${majorDia}" - ${tpi} TPI`} )
G50 S${Math.round(rpm * 1.2)}
G97 S${rpm} M03
G00 X${(majorDia + 0.1).toFixed(3)} Z0.1
G76 P${fanucP} Q${Math.round(threadDepth * 10000 * 0.1)} R0.001
G76 X${minorDia.toFixed(4)} Z-${length.toFixed(3)} P${Math.round(threadDepth * 10000)} Q${Math.round(threadDepth * 10000 * 0.3)} F${pitch.toFixed(5)}`;

    return { haas: haasCode, fanuc: fanucCode };
  }, [threadParams, basicResults, state.threadingRPM, state.threadLength, state.inputMode, state.standardSize]);

  return (
    <div className="thread-calc">
      {/* Input Selection */}
      <Card title="Thread Calculator" icon="🔩">
        <div className="card-header-row">
          <ResetButton onClick={handleReset} />
        </div>
        <div className="form-group">
          <label>Thread System</label>
          <PillToggle
            options={[
              { value: 'imperial', label: 'Imperial' },
              { value: 'metric', label: 'Metric' },
              { value: 'metricFine', label: 'Metric Fine' }
            ]}
            value={state.threadSystem}
            onChange={(v) => {
              const threads = getThreadsForSystem(v);
              setState({
                ...state,
                threadSystem: v,
                standardSize: threads[0]?.name || state.standardSize,
                threadType: v === 'imperial' ? 'un60' : 'iso60'
              });
            }}
            size="small"
          />
        </div>

        <div className="form-group">
          <label>Input Mode</label>
          <PillToggle
            options={[
              { value: 'standard', label: 'Standard Size' },
              { value: 'custom', label: 'Custom' }
            ]}
            value={state.inputMode}
            onChange={(v) => setState({ ...state, inputMode: v })}
            fullWidth
          />
        </div>

        {state.inputMode === 'standard' ? (
          <div className="form-group">
            <label>Thread Size</label>
            <select
              value={state.standardSize}
              onChange={(e) => setState({ ...state, standardSize: e.target.value })}
            >
              {getThreadsForSystem(state.threadSystem).map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} {t.isMetric ? `(${(t.pitch * 25.4).toFixed(2)}mm pitch)` : `(${t.tpi} TPI)`}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid-2">
            <div className="form-group">
              <label>Major Diameter</label>
              <input
                type="number"
                value={state.customMajorDia}
                onChange={(e) => setState({ ...state, customMajorDia: e.target.value })}
                step="0.001"
              />
            </div>
            <div className="form-group">
              <label>TPI</label>
              <input
                type="number"
                value={state.customTPI}
                onChange={(e) => setState({ ...state, customTPI: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Thread Profile</label>
          <PillToggle
            options={state.threadSystem === 'imperial' ? [
              { value: 'un60', label: 'UN 60°' },
              { value: 'whitworth55', label: 'Whitworth 55°' },
              { value: 'acme29', label: 'ACME 29°' }
            ] : [
              { value: 'iso60', label: 'ISO 60°' },
              { value: 'whitworth55', label: 'Whitworth 55°' }
            ]}
            value={state.threadType}
            onChange={(v) => setState({ ...state, threadType: v })}
            size="small"
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Threading RPM</label>
            <input
              type="number"
              value={state.threadingRPM}
              onChange={(e) => setState({ ...state, threadingRPM: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Thread Length</label>
            <input
              type="number"
              value={state.threadLength}
              onChange={(e) => setState({ ...state, threadLength: e.target.value })}
              step="0.125"
            />
          </div>
        </div>
      </Card>

      {/* Section A: Basic Thread Data */}
      <Card title="A: Basic Thread Data" icon="📐">
        <div className="results-grid-3">
          <ResultItem label="Pitch" value={basicResults.pitch} unit="in" variant="default" />
          <ResultItem label="Thread Depth" value={basicResults.threadDepth} unit="in" variant="accent" />
          <ResultItem label="Minor Dia" value={basicResults.minorDia} unit="in" variant="accent2" />
        </div>
        <div className="results-grid-3" style={{ marginTop: '1rem' }}>
          <ResultItem label="Pitch Dia" value={basicResults.pitchDia} unit="in" variant="accent3" />
          <ResultItem label="Tap Drill" value={basicResults.tapDrill} unit="in" variant="default" />
          <ResultItem label="Feed IPM" value={basicResults.feedIPM} unit="IPM" variant="accent" />
        </div>
      </Card>

      {/* Section B: Thread Class & Tolerance */}
      <Card title="B: Thread Class & Tolerance" icon="📏">
        <div className="form-group">
          <label>Thread Type</label>
          <PillToggle
            options={[
              { value: 'external', label: 'External' },
              { value: 'internal', label: 'Internal' }
            ]}
            value={state.threadSide}
            onChange={(v) => setState({ ...state, threadSide: v })}
            fullWidth
          />
        </div>

        {state.threadSide === 'external' ? (
          <div className="form-group">
            <label>Class</label>
            <PillToggle
              options={externalClasses.map(c => ({ value: c.name, label: c.name }))}
              value={state.externalClass}
              onChange={(v) => setState({ ...state, externalClass: v })}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Class</label>
            <PillToggle
              options={internalClasses.map(c => ({ value: c.name, label: c.name }))}
              value={state.internalClass}
              onChange={(v) => setState({ ...state, internalClass: v })}
            />
          </div>
        )}

        <NoteBox variant="info" title={`Class ${classResults.className}`}>
          {classResults.description}
        </NoteBox>

        <div className="class-results">
          {classResults.type === 'external' ? (
            <>
              <div className="results-grid-2">
                <ResultItem label="Max Major Dia" value={classResults.maxMajorDia!} variant="accent" />
                <ResultItem label="Min Major Dia" value={classResults.minMajorDia!} variant="default" />
              </div>
              <div className="results-grid-2">
                <ResultItem label="Max Pitch Dia" value={classResults.maxPitchDia} variant="accent2" />
                <ResultItem label="Min Pitch Dia" value={classResults.minPitchDia} variant="default" />
              </div>
              <div className="results-grid-2">
                <ResultItem label="Min Minor Dia" value={classResults.minMinorDia} variant="accent3" />
                <ResultItem label="Allowance" value={classResults.allowance!} variant="default" />
              </div>
            </>
          ) : (
            <>
              <div className="results-grid-2">
                <ResultItem label="Min Minor Dia" value={classResults.minMinorDia} variant="accent" />
                <ResultItem label="Max Minor Dia" value={classResults.maxMinorDia!} variant="default" />
              </div>
              <div className="results-grid-2">
                <ResultItem label="Min Pitch Dia" value={classResults.minPitchDia} variant="accent2" />
                <ResultItem label="Max Pitch Dia" value={classResults.maxPitchDia} variant="default" />
              </div>
              <div className="results-grid-2">
                <ResultItem label="Max Major Dia" value={classResults.maxMajorDia} variant="accent3" />
                <ResultItem label="Tolerance" value={classResults.tolerance} variant="default" />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Section C: Thread Over Wires */}
      <Card title="C: Measure Over Wires (MOW)" icon="📐">
        <p className="wire-description">
          Three-wire measurement is the most accurate shop method for verifying thread pitch
          diameter. Three precision wires are placed in the thread grooves and measured with a micrometer.
        </p>

        <div className="results-grid-2">
          <ResultItem label="Best Wire Size" value={wireResults.bestWire} unit="in" variant="accent" />
          <ResultItem label="M at Nominal PD" value={wireResults.mNominal} unit="in" variant="accent2" />
        </div>

        <div className="grid-2" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>Wire Size (optional)</label>
            <input
              type="number"
              value={state.wireSize}
              onChange={(e) => setState({ ...state, wireSize: e.target.value })}
              placeholder={wireResults.bestWire}
              step="0.0001"
            />
          </div>
          <div className="form-group">
            <label>M Reading (optional)</label>
            <input
              type="number"
              value={state.mMeasurement}
              onChange={(e) => setState({ ...state, mMeasurement: e.target.value })}
              placeholder="Your measurement"
              step="0.0001"
            />
          </div>
        </div>

        <div className="results-grid-2" style={{ marginTop: '0.5rem' }}>
          <ResultItem label="M at Max PD" value={wireResults.mAtMax} variant="default" />
          <ResultItem label="M at Min PD" value={wireResults.mAtMin} variant="default" />
        </div>

        <div className="m-range">
          <span className="m-range-label">Acceptable M Range:</span>
          <span className="m-range-value">{wireResults.mRange}</span>
        </div>

        {wireResults.actualPD && (
          <div className={`pass-fail ${wireResults.passStatus ? 'pass' : 'fail'}`}>
            <span className="pf-label">Actual Pitch Dia:</span>
            <span className="pf-value">{wireResults.actualPD}"</span>
            <span className="pf-status">{wireResults.passStatus ? '✓ PASS' : '✗ FAIL'}</span>
          </div>
        )}

        <button
          className="btn-secondary wire-table-btn"
          onClick={() => setShowWireTable(!showWireTable)}
        >
          {showWireTable ? 'Hide' : 'Show'} Wire Reference Table
        </button>

        {showWireTable && (
          <div className="wire-table-wrapper">
            <table className="wire-table">
              <thead>
                <tr>
                  <th>Thread</th>
                  <th>Best Wire</th>
                  <th>M Nominal</th>
                </tr>
              </thead>
              <tbody>
                {wireReferenceData.map((row) => (
                  <tr key={row.thread}>
                    <td>{row.thread}</td>
                    <td>{row.bestWire.toFixed(4)}</td>
                    <td>{row.nominalM.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Section D: G76 G-Code */}
      <Card title="D: G76 Threading Code" icon="💻">
        <CodeBlock title="Haas Format" code={g76Code.haas} />
        <div style={{ marginTop: '1rem' }}>
          <CodeBlock title="Fanuc Format" code={g76Code.fanuc} />
        </div>
      </Card>
    </div>
  );
};
