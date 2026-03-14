import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { ResultItem } from '../components/ResultItem';
import { CodeBlock } from '../components/CodeBlock';
import { NoteBox } from '../components/NoteBox';
import { PillToggle } from '../components/PillToggle';
import { materials, getMaterialById } from '../data/materials';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './SpeedsFeedsCalc.css';

type Operation = 'roughing' | 'finishing';
type Mode = 'mill' | 'lathe';

interface MillState {
  materialId: string;
  operation: Operation;
  sfm: string;
  diameter: string;
  flutes: string;
  chipLoad: string;
}

interface LatheState {
  materialId: string;
  operation: Operation;
  partDiameter: string;
  sfm: string;
  feedIPR: string;
  maxRPM: string;
}

export const SpeedsFeedsCalc: React.FC = () => {
  const [mode, setMode] = useState<Mode>('mill');

  const [millState, setMillState] = useLocalStorage<MillState>('speeds-mill', {
    materialId: 'aluminum-6061',
    operation: 'roughing',
    sfm: '800',
    diameter: '0.5',
    flutes: '4',
    chipLoad: '0.004'
  });

  const [latheState, setLatheState] = useLocalStorage<LatheState>('speeds-lathe', {
    materialId: 'aluminum-6061',
    operation: 'roughing',
    partDiameter: '2.0',
    sfm: '800',
    feedIPR: '0.008',
    maxRPM: '3000'
  });

  // Update SFM and chip load when material or operation changes
  const handleMaterialChange = (materialId: string) => {
    const mat = getMaterialById(materialId);
    if (mat) {
      const sfm = millState.operation === 'roughing' ? mat.roughSFM : mat.finishSFM;
      setMillState({
        ...millState,
        materialId,
        sfm: String(sfm),
        chipLoad: String(mat.chipLoad)
      });
    }
  };

  const handleOperationChange = (operation: Operation) => {
    const mat = getMaterialById(millState.materialId);
    if (mat) {
      const sfm = operation === 'roughing' ? mat.roughSFM : mat.finishSFM;
      setMillState({ ...millState, operation, sfm: String(sfm) });
    }
  };

  // Lathe material/operation handlers
  const handleLatheMaterialChange = (materialId: string) => {
    const mat = getMaterialById(materialId);
    if (mat) {
      const sfm = latheState.operation === 'roughing' ? mat.roughSFM : mat.finishSFM;
      setLatheState({
        ...latheState,
        materialId,
        sfm: String(sfm)
      });
    }
  };

  const handleLatheOperationChange = (operation: Operation) => {
    const mat = getMaterialById(latheState.materialId);
    if (mat) {
      const sfm = operation === 'roughing' ? mat.roughSFM : mat.finishSFM;
      setLatheState({ ...latheState, operation, sfm: String(sfm) });
    }
  };

  // Mill calculations
  const millResults = useMemo(() => {
    const sfm = parseFloat(millState.sfm) || 0;
    const dia = parseFloat(millState.diameter) || 0;
    const flutes = parseInt(millState.flutes) || 0;
    const chipLoad = parseFloat(millState.chipLoad) || 0;

    if (dia <= 0) return null;

    const rpm = (sfm * 3.82) / dia;
    const feedIPM = rpm * chipLoad * flutes;
    const sfmVerify = (rpm * dia) / 3.82;
    const mrr = feedIPM * dia * 0.1; // Rough estimate with 0.1" DOC

    return {
      rpm: Math.round(rpm),
      feedIPM: feedIPM.toFixed(1),
      sfmVerify: sfmVerify.toFixed(0),
      mrr: mrr.toFixed(2)
    };
  }, [millState]);

  // Lathe calculations
  const latheResults = useMemo(() => {
    const partDia = parseFloat(latheState.partDiameter) || 0;
    const sfm = parseFloat(latheState.sfm) || 0;
    const feedIPR = parseFloat(latheState.feedIPR) || 0;
    const maxRPM = parseInt(latheState.maxRPM) || 3000;

    if (partDia <= 0) return null;

    const calcRPM = (sfm * 3.82) / partDia;
    const rpm = Math.min(Math.round(calcRPM), maxRPM);
    const feedIPM = rpm * feedIPR;

    return {
      rpm,
      feedIPM: feedIPM.toFixed(1),
      g50: maxRPM,
      cssCode: `G50 S${maxRPM}\nG96 S${Math.round(sfm)} M03\nG01 F${feedIPR} G99`
    };
  }, [latheState]);

  const selectedMaterial = getMaterialById(millState.materialId);
  const selectedLatheMaterial = getMaterialById(latheState.materialId);

  return (
    <div className="speeds-calc">
      <PillToggle
        options={[
          { value: 'mill', label: 'Mill' },
          { value: 'lathe', label: 'Lathe / CSS' }
        ]}
        value={mode}
        onChange={setMode}
        fullWidth
      />

      {mode === 'mill' ? (
        <>
          {/* Mill Calculator */}
          <Card title="Mill Speeds & Feeds" icon="⚙️">
            <div className="form-group">
              <label>Material</label>
              <select
                value={millState.materialId}
                onChange={(e) => handleMaterialChange(e.target.value)}
              >
                {materials.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Operation</label>
              <PillToggle
                options={[
                  { value: 'roughing', label: 'Roughing' },
                  { value: 'finishing', label: 'Finishing' }
                ]}
                value={millState.operation}
                onChange={handleOperationChange}
                fullWidth
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>SFM</label>
                <input
                  type="number"
                  value={millState.sfm}
                  onChange={(e) => setMillState({ ...millState, sfm: e.target.value })}
                  placeholder="Surface Feet/Min"
                />
              </div>
              <div className="form-group">
                <label>Cutter Diameter</label>
                <input
                  type="number"
                  value={millState.diameter}
                  onChange={(e) => setMillState({ ...millState, diameter: e.target.value })}
                  placeholder="Inches"
                  step="0.0625"
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Number of Flutes</label>
                <input
                  type="number"
                  value={millState.flutes}
                  onChange={(e) => setMillState({ ...millState, flutes: e.target.value })}
                  placeholder="Flutes"
                  min="1"
                  max="12"
                />
              </div>
              <div className="form-group">
                <label>Chip Load / Tooth</label>
                <input
                  type="number"
                  value={millState.chipLoad}
                  onChange={(e) => setMillState({ ...millState, chipLoad: e.target.value })}
                  placeholder="Inches"
                  step="0.0005"
                />
              </div>
            </div>
          </Card>

          {/* Mill Results */}
          {millResults && (
            <Card title="Results" icon="📊">
              <div className="results-grid">
                <ResultItem label="RPM" value={millResults.rpm} variant="accent" size="large" />
                <ResultItem label="Feed Rate" value={millResults.feedIPM} unit="IPM" variant="accent2" size="large" />
              </div>
              <div className="results-grid" style={{ marginTop: '1rem' }}>
                <ResultItem label="SFM Verify" value={millResults.sfmVerify} unit="SFM" variant="default" />
                <ResultItem label="MRR Est." value={millResults.mrr} unit="in³/min" variant="accent3" />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <CodeBlock
                  title="G-Code"
                  code={`S${millResults.rpm} M03\nG01 F${millResults.feedIPM}`}
                />
              </div>
            </Card>
          )}

          {/* Material Tips */}
          {selectedMaterial && (
            <NoteBox variant="tip" title={selectedMaterial.name}>
              {selectedMaterial.notes}
            </NoteBox>
          )}
        </>
      ) : (
        <>
          {/* Lathe Calculator */}
          <Card title="Lathe / CSS Mode" icon="🔧">
            <div className="form-group">
              <label>Material</label>
              <select
                value={latheState.materialId}
                onChange={(e) => handleLatheMaterialChange(e.target.value)}
              >
                {materials.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Operation</label>
              <PillToggle
                options={[
                  { value: 'roughing', label: 'Roughing' },
                  { value: 'finishing', label: 'Finishing' }
                ]}
                value={latheState.operation}
                onChange={handleLatheOperationChange}
                fullWidth
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Part Diameter</label>
                <input
                  type="number"
                  value={latheState.partDiameter}
                  onChange={(e) => setLatheState({ ...latheState, partDiameter: e.target.value })}
                  placeholder="Inches"
                  step="0.125"
                />
              </div>
              <div className="form-group">
                <label>Target SFM</label>
                <input
                  type="number"
                  value={latheState.sfm}
                  onChange={(e) => setLatheState({ ...latheState, sfm: e.target.value })}
                  placeholder="Surface Feet/Min"
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Feed (IPR)</label>
                <input
                  type="number"
                  value={latheState.feedIPR}
                  onChange={(e) => setLatheState({ ...latheState, feedIPR: e.target.value })}
                  placeholder="Inches/Rev"
                  step="0.001"
                />
              </div>
              <div className="form-group">
                <label>Max RPM Limit</label>
                <input
                  type="number"
                  value={latheState.maxRPM}
                  onChange={(e) => setLatheState({ ...latheState, maxRPM: e.target.value })}
                  placeholder="RPM"
                  step="100"
                />
              </div>
            </div>
          </Card>

          {/* Lathe Results */}
          {latheResults && (
            <Card title="Results" icon="📊">
              <div className="results-grid">
                <ResultItem label="RPM" value={latheResults.rpm} variant="accent" size="large" />
                <ResultItem label="Feed Rate" value={latheResults.feedIPM} unit="IPM" variant="accent2" size="large" />
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <ResultItem label="G50 (Max RPM)" value={`S${latheResults.g50}`} variant="default" />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <CodeBlock title="CSS G-Code" code={latheResults.cssCode} />
              </div>
            </Card>
          )}

          {/* Material Tips */}
          {selectedLatheMaterial && (
            <NoteBox variant="tip" title={selectedLatheMaterial.name}>
              {selectedLatheMaterial.notes}
            </NoteBox>
          )}

          <NoteBox variant="info" title="CSS Mode">
            Constant Surface Speed (G96) automatically adjusts RPM as diameter changes.
            Always set G50 first to limit max RPM and prevent spindle overspeeding on small diameters!
          </NoteBox>
        </>
      )}
    </div>
  );
};
