// Machine State Management
// Tracks current machine position, modals, and tool state

import type {
  MachineState,
  Point3D,
  GCodeCommand
} from '../types';

import type { Units } from '../types';

export function createInitialState(): MachineState {
  return {
    position: { x: 0, y: 0, z: 0 },
    plane: 'XY',
    units: 'metric',
    distanceMode: 'absolute',
    feedRate: 100,
    spindleSpeed: 0,
    spindleState: 'off',
    coolant: 'off',
    toolNumber: 1,
    currentLine: 0
  };
}

export function cloneState(state: MachineState): MachineState {
  return {
    ...state,
    position: { ...state.position }
  };
}

export function applyCommand(state: MachineState, cmd: GCodeCommand): MachineState {
  const newState = cloneState(state);

  // Handle G-codes
  if (cmd.gCodes) {
    for (const g of cmd.gCodes) {
      switch (g) {
        // Plane selection
        case 17: newState.plane = 'XY'; break;
        case 18: newState.plane = 'XZ'; break;
        case 19: newState.plane = 'YZ'; break;
        // Units
        case 20: newState.units = 'inch'; break;
        case 21: newState.units = 'metric'; break;
        // Distance mode
        case 90: newState.distanceMode = 'absolute'; break;
        case 91: newState.distanceMode = 'incremental'; break;
      }
    }
  }

  // Handle M-codes
  if (cmd.mCodes) {
    for (const m of cmd.mCodes) {
      switch (m) {
        case 3: newState.spindleState = 'cw'; break;
        case 4: newState.spindleState = 'ccw'; break;
        case 5: newState.spindleState = 'off'; break;
        case 7: newState.coolant = 'mist'; break;
        case 8: newState.coolant = 'flood'; break;
        case 9: newState.coolant = 'off'; break;
      }
    }
  }

  // Update feed rate and spindle speed
  if (cmd.feedRate !== undefined) {
    newState.feedRate = cmd.feedRate;
  }
  if (cmd.spindleSpeed !== undefined) {
    newState.spindleSpeed = cmd.spindleSpeed;
  }

  // Update position for motion commands
  if (cmd.type === 'motion' && cmd.target) {
    if (newState.distanceMode === 'absolute') {
      if (cmd.target.x !== undefined) newState.position.x = cmd.target.x;
      if (cmd.target.y !== undefined) newState.position.y = cmd.target.y;
      if (cmd.target.z !== undefined) newState.position.z = cmd.target.z;
    } else {
      if (cmd.target.x !== undefined) newState.position.x += cmd.target.x;
      if (cmd.target.y !== undefined) newState.position.y += cmd.target.y;
      if (cmd.target.z !== undefined) newState.position.z += cmd.target.z;
    }
  }

  newState.currentLine = cmd.lineNumber;

  return newState;
}

export function formatPosition(pos: Point3D, units: Units): string {
  const fmt = (n: number) => n.toFixed(units === 'inch' ? 4 : 3);
  return `X${fmt(pos.x)} Y${fmt(pos.y)} Z${fmt(pos.z)}`;
}

export function formatState(state: MachineState): string {
  const lines = [
    formatPosition(state.position, state.units),
    `Feed: F${state.feedRate}`,
    `Spindle: S${state.spindleSpeed} ${state.spindleState}`,
    `Mode: ${state.distanceMode === 'absolute' ? 'G90' : 'G91'} ${state.units === 'metric' ? 'G21' : 'G20'}`,
    `Plane: ${state.plane === 'XY' ? 'G17' : state.plane === 'XZ' ? 'G18' : 'G19'}`,
    `Coolant: ${state.coolant}`
  ];
  return lines.join('\n');
}
