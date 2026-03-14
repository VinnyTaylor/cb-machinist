// G-Code Simulator - Haas-style
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { parseProgram, generateToolpath } from './parser/gcode-parser';
import { PillToggle } from '../components/PillToggle';
import { useFavorites } from '../hooks/useFavorites';
import type { MachineMode, Toolpath, Point3D, ToolpathSegment } from './types';
import { samplePrograms } from './types';
import './GCodeSimulator.css';

interface SavedProgram {
  code: string;
  mode: MachineMode;
}

const defaultMillCode = `G20 G90 G17
G0 X0 Y0 Z0.5
G0 X-1 Y-1
G1 Z-0.1 F10
G1 X1 F15
G1 Y1
G1 X-1
G1 Y-1
G0 Z0.5
G0 X0 Y0
M30`;

const defaultLatheCode = `G20 G90
G0 X1.5 Z0.1
G1 Z0 F0.01
G1 X1 Z-0.5 F0.005
G1 Z-2
G1 X1.25
G0 X1.5
G0 Z0.1
M30`;

export const GCodeSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<MachineMode>('mill');
  const [gcode, setGcode] = useState(defaultMillCode);
  const [currentSegment, setCurrentSegment] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const intervalRef = useRef<number>(0);

  // Favorites
  const { favorites, addFavorite, removeFavorite } = useFavorites<SavedProgram>('gcode-programs');

  // Parse G-code into toolpath
  const toolpath: Toolpath | null = useMemo(() => {
    try {
      const commands = parseProgram(gcode);
      const path = generateToolpath(commands);
      return path.segments.length > 0 ? path : null;
    } catch {
      return null;
    }
  }, [gcode]);

  // Get current position
  const position: Point3D = useMemo(() => {
    if (!toolpath || currentSegment < 0) return { x: 0, y: 0, z: 0 };
    if (currentSegment >= toolpath.segments.length) {
      return toolpath.segments[toolpath.segments.length - 1].end;
    }
    return toolpath.segments[currentSegment].end;
  }, [toolpath, currentSegment]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, w, h);

    if (!toolpath || toolpath.segments.length === 0) {
      ctx.fillStyle = '#666';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Enter G-code to visualize', w / 2, h / 2);
      return;
    }

    // Calculate view bounds - fit all toolpath with padding
    const bounds = toolpath.bounds;
    const pad = 0.5;

    let viewMinX: number, viewMaxX: number, viewMinY: number, viewMaxY: number;

    if (mode === 'mill') {
      viewMinX = bounds.min.x - pad;
      viewMaxX = bounds.max.x + pad;
      viewMinY = bounds.min.y - pad;
      viewMaxY = bounds.max.y + pad;
    } else {
      // Lathe: Z is horizontal (left = negative = into part), X is vertical (radius)
      viewMinX = bounds.min.z - pad;
      viewMaxX = bounds.max.z + pad;
      viewMinY = Math.min(bounds.min.x, 0) - pad;
      viewMaxY = bounds.max.x + pad;
    }

    // Make it square-ish to avoid distortion
    const viewW = viewMaxX - viewMinX;
    const viewH = viewMaxY - viewMinY;
    const viewAspect = viewW / viewH;
    const canvasAspect = w / h;

    if (viewAspect > canvasAspect) {
      // View is wider, add height
      const extra = (viewW / canvasAspect - viewH) / 2;
      viewMinY -= extra;
      viewMaxY += extra;
    } else {
      // View is taller, add width
      const extra = (viewH * canvasAspect - viewW) / 2;
      viewMinX -= extra;
      viewMaxX += extra;
    }

    const finalViewW = viewMaxX - viewMinX;
    const finalViewH = viewMaxY - viewMinY;
    const scale = Math.min(w / finalViewW, h / finalViewH) * 0.9;
    const offsetX = (w - finalViewW * scale) / 2;
    const offsetY = (h - finalViewH * scale) / 2;

    const toX = (v: number) => offsetX + (v - viewMinX) * scale;
    const toY = (v: number) => h - offsetY - (v - viewMinY) * scale;

    // Grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    const gridSize = Math.pow(10, Math.floor(Math.log10(Math.max(finalViewW, finalViewH) / 5)));

    for (let gx = Math.floor(viewMinX / gridSize) * gridSize; gx <= viewMaxX; gx += gridSize) {
      ctx.beginPath();
      ctx.moveTo(toX(gx), 0);
      ctx.lineTo(toX(gx), h);
      ctx.stroke();
    }
    for (let gy = Math.floor(viewMinY / gridSize) * gridSize; gy <= viewMaxY; gy += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, toY(gy));
      ctx.lineTo(w, toY(gy));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 2;
    if (viewMinY <= 0 && viewMaxY >= 0) {
      ctx.beginPath();
      ctx.moveTo(0, toY(0));
      ctx.lineTo(w, toY(0));
      ctx.stroke();
    }
    if (viewMinX <= 0 && viewMaxX >= 0) {
      ctx.beginPath();
      ctx.moveTo(toX(0), 0);
      ctx.lineTo(toX(0), h);
      ctx.stroke();
    }

    // Helper to get canvas coords from segment point
    const getCoords = (p: Point3D): [number, number] => {
      if (mode === 'mill') {
        return [toX(p.x), toY(p.y)];
      } else {
        return [toX(p.z), toY(p.x)];
      }
    };

    // Draw segments
    const drawSegment = (seg: ToolpathSegment, highlight: boolean, dim: boolean) => {
      const isRapid = seg.type === 'rapid';

      if (highlight) {
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 4;
      } else if (dim) {
        ctx.strokeStyle = isRapid ? '#2a2a3a' : '#1a4a1a';
        ctx.lineWidth = isRapid ? 1 : 2;
      } else {
        ctx.strokeStyle = isRapid ? '#4a4a5a' : '#22aa22';
        ctx.lineWidth = isRapid ? 1 : 3;
      }

      ctx.setLineDash(isRapid ? [6, 4] : []);
      ctx.beginPath();

      if (seg.arcPoints && seg.arcPoints.length > 1) {
        const [sx, sy] = getCoords(seg.arcPoints[0]);
        ctx.moveTo(sx, sy);
        for (let i = 1; i < seg.arcPoints.length; i++) {
          const [px, py] = getCoords(seg.arcPoints[i]);
          ctx.lineTo(px, py);
        }
      } else {
        const [sx, sy] = getCoords(seg.start);
        const [ex, ey] = getCoords(seg.end);
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Draw future segments (dim)
    for (let i = currentSegment + 1; i < toolpath.segments.length; i++) {
      drawSegment(toolpath.segments[i], false, true);
    }

    // Draw past segments (normal)
    for (let i = 0; i < currentSegment; i++) {
      drawSegment(toolpath.segments[i], false, false);
    }

    // Draw current segment (highlighted)
    if (currentSegment >= 0 && currentSegment < toolpath.segments.length) {
      drawSegment(toolpath.segments[currentSegment], true, false);
    }

    // Draw tool
    const [toolX, toolY] = getCoords(position);

    // Glow
    const gradient = ctx.createRadialGradient(toolX, toolY, 0, toolX, toolY, 20);
    gradient.addColorStop(0, 'rgba(255, 100, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(toolX, toolY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Crosshair
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toolX - 15, toolY);
    ctx.lineTo(toolX - 5, toolY);
    ctx.moveTo(toolX + 5, toolY);
    ctx.lineTo(toolX + 15, toolY);
    ctx.moveTo(toolX, toolY - 15);
    ctx.lineTo(toolX, toolY - 5);
    ctx.moveTo(toolX, toolY + 5);
    ctx.lineTo(toolX, toolY + 15);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(toolX, toolY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#555';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(mode === 'mill' ? 'X →' : 'Z →', w - 10, toY(0) - 8);
    ctx.textAlign = 'left';
    ctx.fillText(mode === 'mill' ? '↑ Y' : '↑ X', toX(0) + 8, 20);

  }, [toolpath, currentSegment, position, mode]);

  // Resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      setCurrentSegment(s => s); // Force redraw
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Auto-run
  useEffect(() => {
    if (isRunning && toolpath) {
      intervalRef.current = window.setInterval(() => {
        setCurrentSegment(prev => {
          if (prev >= toolpath.segments.length - 1) {
            setIsRunning(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, speed, toolpath]);

  const handleCycleStart = () => {
    if (!toolpath) return;
    if (currentSegment >= toolpath.segments.length - 1) {
      setCurrentSegment(-1);
    }
    setIsRunning(true);
  };

  const handleFeedHold = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentSegment(-1);
  };

  const handleSingleBlock = () => {
    if (!toolpath) return;
    setCurrentSegment(prev => Math.min(prev + 1, toolpath.segments.length - 1));
  };

  const handleModeChange = (newMode: MachineMode) => {
    setMode(newMode);
    setGcode(newMode === 'mill' ? defaultMillCode : defaultLatheCode);
    handleReset();
  };

  const loadSample = (name: string) => {
    const sample = samplePrograms.find(s => s.name === name);
    if (sample) {
      setGcode(sample.code);
      setMode(sample.mode);
      handleReset();
    }
  };

  const handleSaveProgram = () => {
    if (saveName.trim()) {
      addFavorite(saveName.trim(), { code: gcode, mode });
      setSaveName('');
      setShowSaveInput(false);
    }
  };

  const handleLoadProgram = (id: string) => {
    const program = favorites.find(f => f.id === id);
    if (program) {
      setGcode(program.data.code);
      setMode(program.data.mode);
      handleReset();
    }
  };

  return (
    <div className="sim-container">
      {/* Main Canvas - Center */}
      <div className="sim-main">
        <canvas ref={canvasRef} className="sim-canvas" />

        {/* DRO Overlay */}
        <div className="sim-dro">
          <div className="dro-row">
            <span className="dro-label">X</span>
            <span className="dro-value">{position.x >= 0 ? '+' : ''}{position.x.toFixed(4)}</span>
          </div>
          <div className="dro-row">
            <span className="dro-label">Y</span>
            <span className="dro-value">{position.y >= 0 ? '+' : ''}{position.y.toFixed(4)}</span>
          </div>
          <div className="dro-row">
            <span className="dro-label">Z</span>
            <span className="dro-value">{position.z >= 0 ? '+' : ''}{position.z.toFixed(4)}</span>
          </div>
        </div>

        {/* Status */}
        <div className="sim-status">
          {isRunning ? 'RUNNING' : currentSegment < 0 ? 'READY' : 'STOPPED'}
          {toolpath && ` | Block ${currentSegment + 1} / ${toolpath.segments.length}`}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="sim-bottom">
        <div className="sim-controls">
          <div className="sim-mode">
            <PillToggle
              options={[
                { value: 'mill', label: 'Mill' },
                { value: 'lathe', label: 'Lathe' }
              ]}
              value={mode}
              onChange={handleModeChange}
            />
          </div>

          <div className="sim-buttons">
            <button className="btn-ctrl" onClick={handleReset}>RESET</button>
            <button className="btn-ctrl" onClick={handleSingleBlock} disabled={isRunning}>SINGLE</button>
            <button className="btn-ctrl btn-green" onClick={handleCycleStart} disabled={isRunning}>
              CYCLE START
            </button>
            <button className="btn-ctrl btn-red" onClick={handleFeedHold} disabled={!isRunning}>
              FEED HOLD
            </button>
          </div>

          <div className="sim-speed">
            <span>Speed</span>
            <input
              type="range"
              min="50"
              max="800"
              value={850 - speed}
              onChange={e => setSpeed(850 - parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Code Editor */}
        <div className="sim-code">
          <div className="sim-code-header">
            <span>G-CODE</span>
            <div className="sim-code-actions">
              {/* Save button */}
              {!showSaveInput ? (
                <button className="btn-save" onClick={() => setShowSaveInput(true)} title="Save program">
                  Save
                </button>
              ) : (
                <div className="save-input-group">
                  <input
                    type="text"
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveProgram();
                      if (e.key === 'Escape') { setShowSaveInput(false); setSaveName(''); }
                    }}
                    placeholder="Name..."
                    autoFocus
                    maxLength={20}
                  />
                  <button className="btn-save-confirm" onClick={handleSaveProgram}>✓</button>
                  <button className="btn-save-cancel" onClick={() => { setShowSaveInput(false); setSaveName(''); }}>✕</button>
                </div>
              )}
              {/* Saved programs dropdown */}
              {favorites.length > 0 && (
                <select
                  onChange={e => { if (e.target.value) handleLoadProgram(e.target.value); e.target.value = ''; }}
                  value=""
                  className="saved-select"
                >
                  <option value="">Saved ({favorites.length})</option>
                  {favorites.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.data.mode})
                    </option>
                  ))}
                </select>
              )}
              {/* Sample programs dropdown */}
              <select onChange={e => e.target.value && loadSample(e.target.value)} value="">
                <option value="">Samples</option>
                {samplePrograms.filter(s => s.mode === mode).map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <textarea
            value={gcode}
            onChange={e => { setGcode(e.target.value); handleReset(); }}
            spellCheck={false}
          />
          {/* Delete saved programs */}
          {favorites.length > 0 && (
            <div className="sim-saved-list">
              {favorites.map(f => (
                <span key={f.id} className="saved-tag">
                  {f.name}
                  <button onClick={() => removeFavorite(f.id)} title="Delete">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GCodeSimulator;
