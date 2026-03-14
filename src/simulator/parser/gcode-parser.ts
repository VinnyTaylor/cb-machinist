// G-Code Parser
// Parses G-code text into structured commands

import type {
  GCodeCommand,
  MotionType,
  Point3D,
  ArcOffset,
  Plane,
  ToolpathSegment,
  Toolpath,
  MachineState
} from '../types';

// Initial machine state
export function getInitialState(): MachineState {
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

// Parse a word (letter + number)
interface Word {
  letter: string;
  value: number;
}

function parseWords(line: string): Word[] {
  const words: Word[] = [];
  // Remove comments (parentheses and semicolon)
  let clean = line.replace(/\(.*?\)/g, '').replace(/;.*$/, '').trim().toUpperCase();

  // Match letter-number pairs
  const regex = /([A-Z])(-?[\d.]+)/g;
  let match;
  while ((match = regex.exec(clean)) !== null) {
    words.push({
      letter: match[1],
      value: parseFloat(match[2])
    });
  }
  return words;
}

// Parse a single line of G-code
export function parseLine(line: string, lineNumber: number): GCodeCommand {
  const trimmed = line.trim();

  // Handle empty lines and comments
  if (!trimmed || trimmed.startsWith('(') || trimmed.startsWith(';') || trimmed.startsWith('%')) {
    return {
      lineNumber,
      rawLine: line,
      type: 'comment'
    };
  }

  const words = parseWords(trimmed);
  if (words.length === 0) {
    return {
      lineNumber,
      rawLine: line,
      type: 'comment'
    };
  }

  const command: GCodeCommand = {
    lineNumber,
    rawLine: line,
    type: 'unknown',
    gCodes: [],
    mCodes: [],
    target: {},
    arcOffset: {}
  };

  for (const word of words) {
    switch (word.letter) {
      case 'G':
        command.gCodes!.push(word.value);
        break;
      case 'M':
        command.mCodes!.push(word.value);
        break;
      case 'X':
        command.target!.x = word.value;
        break;
      case 'Y':
        command.target!.y = word.value;
        break;
      case 'Z':
        command.target!.z = word.value;
        break;
      case 'I':
        command.arcOffset!.i = word.value;
        break;
      case 'J':
        command.arcOffset!.j = word.value;
        break;
      case 'K':
        command.arcOffset!.k = word.value;
        break;
      case 'F':
        command.feedRate = word.value;
        break;
      case 'S':
        command.spindleSpeed = word.value;
        break;
      case 'N':
        // Line number - ignore
        break;
      case 'T':
        // Tool number - we'll handle in state
        break;
    }
  }

  // Determine command type
  if (command.gCodes!.length > 0) {
    const motionCode = command.gCodes!.find(g => [0, 1, 2, 3].includes(g));
    if (motionCode !== undefined) {
      command.type = 'motion';
      switch (motionCode) {
        case 0: command.motion = 'rapid'; break;
        case 1: command.motion = 'linear'; break;
        case 2: command.motion = 'cw_arc'; break;
        case 3: command.motion = 'ccw_arc'; break;
      }
    } else {
      command.type = 'modal';
    }
  } else if (command.mCodes!.length > 0) {
    command.type = 'mcode';
  } else if (Object.keys(command.target!).length > 0) {
    // Has position but no G-code - use modal motion
    command.type = 'motion';
  }

  return command;
}

// Parse entire G-code program
export function parseProgram(code: string): GCodeCommand[] {
  const lines = code.split('\n');
  return lines.map((line, index) => parseLine(line, index + 1));
}

// Interpolate arc into line segments
function interpolateArc(
  start: Point3D,
  end: Point3D,
  center: Point3D,
  clockwise: boolean,
  plane: Plane,
  _segmentsHint: number = 36
): Point3D[] {
  const points: Point3D[] = [];

  // Determine which axes to use based on plane
  let axis1: 'x' | 'y' | 'z', axis2: 'x' | 'y' | 'z', axis3: 'x' | 'y' | 'z';
  switch (plane) {
    case 'XY': axis1 = 'x'; axis2 = 'y'; axis3 = 'z'; break;
    case 'XZ': axis1 = 'x'; axis2 = 'z'; axis3 = 'y'; break;
    case 'YZ': axis1 = 'y'; axis2 = 'z'; axis3 = 'x'; break;
  }

  const startAngle = Math.atan2(start[axis2] - center[axis2], start[axis1] - center[axis1]);
  let endAngle = Math.atan2(end[axis2] - center[axis2], end[axis1] - center[axis1]);

  // Handle full circles
  const isFullCircle = Math.abs(start[axis1] - end[axis1]) < 0.0001 &&
    Math.abs(start[axis2] - end[axis2]) < 0.0001;

  if (isFullCircle) {
    endAngle = clockwise ? startAngle - 2 * Math.PI : startAngle + 2 * Math.PI;
  } else {
    // Adjust end angle for direction
    if (clockwise) {
      while (endAngle >= startAngle) endAngle -= 2 * Math.PI;
    } else {
      while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    }
  }

  const radius = Math.sqrt(
    Math.pow(start[axis1] - center[axis1], 2) +
    Math.pow(start[axis2] - center[axis2], 2)
  );

  const angleSpan = endAngle - startAngle;
  const numSegments = Math.max(Math.ceil(Math.abs(angleSpan) / (Math.PI / 18)), 8);

  // Interpolate along third axis (helical arc support)
  const axis3Start = start[axis3];
  const axis3End = end[axis3];

  for (let i = 0; i <= numSegments; i++) {
    const t = i / numSegments;
    const angle = startAngle + angleSpan * t;

    const point: Point3D = { x: 0, y: 0, z: 0 };
    point[axis1] = center[axis1] + radius * Math.cos(angle);
    point[axis2] = center[axis2] + radius * Math.sin(angle);
    point[axis3] = axis3Start + (axis3End - axis3Start) * t;

    points.push(point);
  }

  return points;
}

// Generate toolpath from parsed commands
export function generateToolpath(commands: GCodeCommand[]): Toolpath {
  const segments: ToolpathSegment[] = [];
  const state = getInitialState();
  let modalMotion: MotionType = 'rapid';

  // Track bounds
  const bounds = {
    min: { x: Infinity, y: Infinity, z: Infinity },
    max: { x: -Infinity, y: -Infinity, z: -Infinity }
  };

  function updateBounds(point: Point3D) {
    bounds.min.x = Math.min(bounds.min.x, point.x);
    bounds.min.y = Math.min(bounds.min.y, point.y);
    bounds.min.z = Math.min(bounds.min.z, point.z);
    bounds.max.x = Math.max(bounds.max.x, point.x);
    bounds.max.y = Math.max(bounds.max.y, point.y);
    bounds.max.z = Math.max(bounds.max.z, point.z);
  }

  updateBounds(state.position);

  for (const cmd of commands) {
    // Handle modal G-codes
    if (cmd.gCodes) {
      for (const g of cmd.gCodes) {
        switch (g) {
          case 17: state.plane = 'XY'; break;
          case 18: state.plane = 'XZ'; break;
          case 19: state.plane = 'YZ'; break;
          case 20: state.units = 'inch'; break;
          case 21: state.units = 'metric'; break;
          case 90: state.distanceMode = 'absolute'; break;
          case 91: state.distanceMode = 'incremental'; break;
        }
      }
    }

    // Handle M-codes
    if (cmd.mCodes) {
      for (const m of cmd.mCodes) {
        switch (m) {
          case 3: state.spindleState = 'cw'; break;
          case 4: state.spindleState = 'ccw'; break;
          case 5: state.spindleState = 'off'; break;
          case 8: state.coolant = 'flood'; break;
          case 9: state.coolant = 'off'; break;
        }
      }
    }

    // Update feed rate and spindle speed
    if (cmd.feedRate !== undefined) state.feedRate = cmd.feedRate;
    if (cmd.spindleSpeed !== undefined) state.spindleSpeed = cmd.spindleSpeed;

    // Handle motion
    if (cmd.type === 'motion') {
      const motion = cmd.motion || modalMotion;
      if (cmd.motion) modalMotion = cmd.motion;

      // Calculate target position
      const target: Point3D = { ...state.position };
      if (cmd.target) {
        if (state.distanceMode === 'absolute') {
          if (cmd.target.x !== undefined) target.x = cmd.target.x;
          if (cmd.target.y !== undefined) target.y = cmd.target.y;
          if (cmd.target.z !== undefined) target.z = cmd.target.z;
        } else {
          if (cmd.target.x !== undefined) target.x += cmd.target.x;
          if (cmd.target.y !== undefined) target.y += cmd.target.y;
          if (cmd.target.z !== undefined) target.z += cmd.target.z;
        }
      }

      // Create segment
      if (target.x !== state.position.x ||
        target.y !== state.position.y ||
        target.z !== state.position.z) {

        const segment: ToolpathSegment = {
          type: motion,
          start: { ...state.position },
          end: target,
          feedRate: motion === 'rapid' ? 9999 : state.feedRate,
          plane: state.plane,
          sourceLine: cmd.lineNumber
        };

        // Handle arcs
        if (motion === 'cw_arc' || motion === 'ccw_arc') {
          const offset: ArcOffset = {
            i: cmd.arcOffset?.i || 0,
            j: cmd.arcOffset?.j || 0,
            k: cmd.arcOffset?.k || 0
          };

          // Calculate center based on plane
          let center: Point3D;
          switch (state.plane) {
            case 'XY':
              center = {
                x: state.position.x + offset.i,
                y: state.position.y + offset.j,
                z: state.position.z
              };
              break;
            case 'XZ':
              center = {
                x: state.position.x + offset.i,
                y: state.position.y,
                z: state.position.z + offset.k
              };
              break;
            case 'YZ':
              center = {
                x: state.position.x,
                y: state.position.y + offset.j,
                z: state.position.z + offset.k
              };
              break;
          }

          segment.center = center;
          segment.clockwise = motion === 'cw_arc';
          segment.arcPoints = interpolateArc(
            state.position,
            target,
            center,
            segment.clockwise,
            state.plane
          );

          // Update bounds for arc points
          segment.arcPoints.forEach(updateBounds);
        }

        segments.push(segment);
        updateBounds(target);
        state.position = target;
      }
    }

    state.currentLine = cmd.lineNumber;
  }

  // Calculate lengths
  let totalLength = 0;
  let rapidLength = 0;
  let cuttingLength = 0;

  for (const seg of segments) {
    let length: number;

    if (seg.arcPoints && seg.arcPoints.length > 1) {
      // Arc length
      length = 0;
      for (let i = 1; i < seg.arcPoints.length; i++) {
        const dx = seg.arcPoints[i].x - seg.arcPoints[i - 1].x;
        const dy = seg.arcPoints[i].y - seg.arcPoints[i - 1].y;
        const dz = seg.arcPoints[i].z - seg.arcPoints[i - 1].z;
        length += Math.sqrt(dx * dx + dy * dy + dz * dz);
      }
    } else {
      // Linear length
      const dx = seg.end.x - seg.start.x;
      const dy = seg.end.y - seg.start.y;
      const dz = seg.end.z - seg.start.z;
      length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    totalLength += length;
    if (seg.type === 'rapid') {
      rapidLength += length;
    } else {
      cuttingLength += length;
    }
  }

  // Handle edge case of no segments
  if (segments.length === 0) {
    bounds.min = { x: 0, y: 0, z: 0 };
    bounds.max = { x: 0, y: 0, z: 0 };
  }

  return {
    segments,
    bounds,
    totalLength,
    rapidLength,
    cuttingLength
  };
}

// Get point along toolpath at given progress (0-1)
export function getPointAtProgress(toolpath: Toolpath, progress: number): {
  point: Point3D;
  segmentIndex: number;
  segmentProgress: number;
} {
  if (toolpath.segments.length === 0) {
    return { point: { x: 0, y: 0, z: 0 }, segmentIndex: 0, segmentProgress: 0 };
  }

  const targetLength = progress * toolpath.totalLength;
  let accumulatedLength = 0;

  for (let i = 0; i < toolpath.segments.length; i++) {
    const seg = toolpath.segments[i];
    let segLength: number;

    if (seg.arcPoints && seg.arcPoints.length > 1) {
      segLength = 0;
      for (let j = 1; j < seg.arcPoints.length; j++) {
        const dx = seg.arcPoints[j].x - seg.arcPoints[j - 1].x;
        const dy = seg.arcPoints[j].y - seg.arcPoints[j - 1].y;
        const dz = seg.arcPoints[j].z - seg.arcPoints[j - 1].z;
        segLength += Math.sqrt(dx * dx + dy * dy + dz * dz);
      }
    } else {
      const dx = seg.end.x - seg.start.x;
      const dy = seg.end.y - seg.start.y;
      const dz = seg.end.z - seg.start.z;
      segLength = Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    if (accumulatedLength + segLength >= targetLength || i === toolpath.segments.length - 1) {
      const segProgress = segLength > 0 ? (targetLength - accumulatedLength) / segLength : 1;

      let point: Point3D;
      if (seg.arcPoints && seg.arcPoints.length > 1) {
        // Interpolate along arc
        const idx = Math.min(
          Math.floor(segProgress * (seg.arcPoints.length - 1)),
          seg.arcPoints.length - 2
        );
        const t = (segProgress * (seg.arcPoints.length - 1)) - idx;
        const p0 = seg.arcPoints[idx];
        const p1 = seg.arcPoints[idx + 1];
        point = {
          x: p0.x + (p1.x - p0.x) * t,
          y: p0.y + (p1.y - p0.y) * t,
          z: p0.z + (p1.z - p0.z) * t
        };
      } else {
        // Linear interpolation
        point = {
          x: seg.start.x + (seg.end.x - seg.start.x) * segProgress,
          y: seg.start.y + (seg.end.y - seg.start.y) * segProgress,
          z: seg.start.z + (seg.end.z - seg.start.z) * segProgress
        };
      }

      return { point, segmentIndex: i, segmentProgress: segProgress };
    }

    accumulatedLength += segLength;
  }

  // Return end of last segment
  const lastSeg = toolpath.segments[toolpath.segments.length - 1];
  return {
    point: { ...lastSeg.end },
    segmentIndex: toolpath.segments.length - 1,
    segmentProgress: 1
  };
}
