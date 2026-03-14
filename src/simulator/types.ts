// G-Code Simulator Types

export type MachineMode = 'mill' | 'lathe';

// G-code motion types
export type MotionType = 'rapid' | 'linear' | 'cw_arc' | 'ccw_arc';

// Plane selection for arcs
export type Plane = 'XY' | 'XZ' | 'YZ';

// Units
export type Units = 'inch' | 'metric';

// Distance mode
export type DistanceMode = 'absolute' | 'incremental';

// Spindle state
export type SpindleState = 'off' | 'cw' | 'ccw';

// Coolant state
export type CoolantState = 'off' | 'flood' | 'mist';

// 3D point
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Arc center offset
export interface ArcOffset {
  i: number;
  j: number;
  k: number;
}

// Parsed G-code command
export interface GCodeCommand {
  lineNumber: number;
  rawLine: string;
  type: 'motion' | 'modal' | 'mcode' | 'comment' | 'unknown';
  motion?: MotionType;
  target?: Partial<Point3D>;
  feedRate?: number;
  spindleSpeed?: number;
  arcOffset?: Partial<ArcOffset>;
  gCodes?: number[];
  mCodes?: number[];
  error?: string;
}

// Toolpath segment (for rendering)
export interface ToolpathSegment {
  type: MotionType;
  start: Point3D;
  end: Point3D;
  feedRate: number;
  // For arcs
  center?: Point3D;
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  clockwise?: boolean;
  plane?: Plane;
  // Arc interpolation points for rendering
  arcPoints?: Point3D[];
}

// Machine state at any point
export interface MachineState {
  position: Point3D;
  plane: Plane;
  units: Units;
  distanceMode: DistanceMode;
  feedRate: number;
  spindleSpeed: number;
  spindleState: SpindleState;
  coolant: CoolantState;
  toolNumber: number;
  // Current line being executed
  currentLine: number;
}

// Complete toolpath
export interface Toolpath {
  segments: ToolpathSegment[];
  bounds: {
    min: Point3D;
    max: Point3D;
  };
  totalLength: number;
  rapidLength: number;
  cuttingLength: number;
}

// Workpiece dimensions
export interface WorkpieceConfig {
  x: number;
  y: number;
  z: number;
  // For lathe: diameter and length
  diameter?: number;
  length?: number;
}

// Tool configuration
export interface ToolConfig {
  type: 'endmill' | 'drill' | 'insert';
  diameter: number;
  length?: number;
  fluteCount?: number;
}

// Simulator configuration
export interface SimulatorConfig {
  mode: MachineMode;
  workpiece: WorkpieceConfig;
  tool: ToolConfig;
  qualityPreset: 'low' | 'medium' | 'high';
  showRapids: boolean;
  showWorkpiece: boolean;
  animationSpeed: number;
}

// Playback state
export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSegment: number;
  progress: number; // 0-1 within current segment
  totalProgress: number; // 0-1 overall
  speed: number; // Playback speed multiplier
}

// Sample G-code programs
export interface SampleProgram {
  name: string;
  mode: MachineMode;
  code: string;
  description: string;
}

export const samplePrograms: SampleProgram[] = [
  {
    name: 'Mill Square Pocket',
    mode: 'mill',
    description: 'Simple square pocket milling',
    code: `G20 G90 G17
G0 Z0.5
G0 X-1 Y-1
G1 Z-0.25 F10
G1 X1 F20
G1 Y1
G1 X-1
G1 Y-1
G0 Z0.5
M30`
  },
  {
    name: 'Mill Circle with Arc',
    mode: 'mill',
    description: 'Circle using arc interpolation',
    code: `G20 G90 G17
G0 Z0.5
G0 X1 Y0
G1 Z-0.125 F10
G2 X1 Y0 I-1 J0 F15
G0 Z0.5
M30`
  },
  {
    name: 'Lathe Facing',
    mode: 'lathe',
    description: 'Simple facing operation',
    code: `G20 G90
G0 X1.25 Z0.1
G1 Z0 F0.005
G1 X-0.05 F0.003
G0 Z0.1
G0 X1.25
M30`
  },
  {
    name: 'Lathe Taper',
    mode: 'lathe',
    description: 'Tapered profile turning',
    code: `G20 G90
G0 X1.25 Z0.1
G1 Z0 F0.005
G1 X0.75 Z-1 F0.003
G1 Z-2.5
G0 X1.5
G0 Z0.1
M30`
  }
];
