export interface GCode {
  code: string;
  type: 'Mill' | 'Lathe' | 'Both';
  description: string;
  haasNote?: string;
  fanucNote?: string;
}

export const gCodes: GCode[] = [
  // G-Codes - Motion
  { code: 'G00', type: 'Both', description: 'Rapid positioning (non-cutting move)', haasNote: 'Max traverse rate', fanucNote: 'Max rapid rate' },
  { code: 'G01', type: 'Both', description: 'Linear interpolation (cutting feed)', haasNote: 'Requires F word', fanucNote: 'Requires F word' },
  { code: 'G02', type: 'Both', description: 'Circular interpolation CW', haasNote: 'Use I,J or R', fanucNote: 'Use I,J,K or R' },
  { code: 'G03', type: 'Both', description: 'Circular interpolation CCW', haasNote: 'Use I,J or R', fanucNote: 'Use I,J,K or R' },
  { code: 'G04', type: 'Both', description: 'Dwell (pause)', haasNote: 'P in seconds', fanucNote: 'P in milliseconds or X in seconds' },

  // Plane selection
  { code: 'G17', type: 'Mill', description: 'XY plane selection', haasNote: 'Default plane', fanucNote: 'For G02/G03 arcs' },
  { code: 'G18', type: 'Both', description: 'XZ plane selection', haasNote: 'For lathe or mill side', fanucNote: 'Lathe default' },
  { code: 'G19', type: 'Mill', description: 'YZ plane selection', haasNote: 'Rarely used', fanucNote: 'Rarely used' },

  // Units
  { code: 'G20', type: 'Both', description: 'Inch units', haasNote: 'Sets inch mode', fanucNote: 'G70 on older controls' },
  { code: 'G21', type: 'Both', description: 'Metric units (mm)', haasNote: 'Sets metric mode', fanucNote: 'G71 on older controls' },

  // Reference point return
  { code: 'G28', type: 'Both', description: 'Return to home position', haasNote: 'Through intermediate point', fanucNote: 'Machine zero return' },
  { code: 'G29', type: 'Both', description: 'Return from reference point', haasNote: 'After G28', fanucNote: 'After G28' },
  { code: 'G30', type: 'Both', description: 'Return to 2nd reference point', haasNote: 'Secondary home', fanucNote: 'Secondary home' },

  // Cutter compensation
  { code: 'G40', type: 'Both', description: 'Cancel cutter compensation', haasNote: 'Cancels G41/G42', fanucNote: 'Cancels G41/G42' },
  { code: 'G41', type: 'Both', description: 'Cutter compensation left', haasNote: 'Tool left of path', fanucNote: 'Requires D word' },
  { code: 'G42', type: 'Both', description: 'Cutter compensation right', haasNote: 'Tool right of path', fanucNote: 'Requires D word' },
  { code: 'G43', type: 'Mill', description: 'Tool length compensation +', haasNote: 'H = offset number', fanucNote: 'H = offset number' },
  { code: 'G44', type: 'Mill', description: 'Tool length compensation -', haasNote: 'Rarely used', fanucNote: 'Negative direction' },
  { code: 'G49', type: 'Mill', description: 'Cancel tool length compensation', haasNote: 'Cancels G43/G44', fanucNote: 'Cancels G43/G44' },

  // Work offsets
  { code: 'G50', type: 'Lathe', description: 'Set coordinate / max RPM limit', haasNote: 'G50 S3000 = max 3000 RPM', fanucNote: 'Same usage' },
  { code: 'G52', type: 'Mill', description: 'Local coordinate system', haasNote: 'Temporary shift', fanucNote: 'Temporary shift' },
  { code: 'G53', type: 'Both', description: 'Machine coordinate system', haasNote: 'Non-modal', fanucNote: 'Non-modal' },
  { code: 'G54', type: 'Both', description: 'Work offset 1', haasNote: 'Most common', fanucNote: 'First work offset' },
  { code: 'G55', type: 'Both', description: 'Work offset 2', haasNote: 'Second fixture', fanucNote: 'Second work offset' },
  { code: 'G56', type: 'Both', description: 'Work offset 3', haasNote: 'Third fixture', fanucNote: 'Third work offset' },
  { code: 'G57', type: 'Both', description: 'Work offset 4', haasNote: 'Fourth fixture', fanucNote: 'Fourth work offset' },
  { code: 'G58', type: 'Both', description: 'Work offset 5', haasNote: 'Fifth fixture', fanucNote: 'Fifth work offset' },
  { code: 'G59', type: 'Both', description: 'Work offset 6', haasNote: 'Sixth fixture', fanucNote: 'Sixth work offset' },

  // Canned cycles - Drilling
  { code: 'G73', type: 'Mill', description: 'High-speed peck drill cycle', haasNote: 'Q = peck depth', fanucNote: 'Chip breaking cycle' },
  { code: 'G74', type: 'Lathe', description: 'Left-hand tapping cycle', haasNote: 'Reverse tap', fanucNote: 'Reverse tap' },
  { code: 'G76', type: 'Lathe', description: 'Threading cycle (multi-pass)', haasNote: 'Full thread cycle', fanucNote: 'Full thread cycle' },
  { code: 'G80', type: 'Both', description: 'Cancel canned cycle', haasNote: 'Ends drilling cycle', fanucNote: 'Ends drilling cycle' },
  { code: 'G81', type: 'Mill', description: 'Drill cycle (no peck)', haasNote: 'Simple drill', fanucNote: 'Simple drill' },
  { code: 'G82', type: 'Mill', description: 'Drill cycle with dwell', haasNote: 'P = dwell time', fanucNote: 'P = dwell time' },
  { code: 'G83', type: 'Mill', description: 'Deep hole peck drill', haasNote: 'Q = peck, full retract', fanucNote: 'Q = peck increment' },
  { code: 'G84', type: 'Mill', description: 'Tapping cycle', haasNote: 'Rigid tap default', fanucNote: 'Requires synced spindle' },
  { code: 'G85', type: 'Mill', description: 'Boring cycle (feed out)', haasNote: 'Feed retract', fanucNote: 'Feed retract' },
  { code: 'G86', type: 'Mill', description: 'Boring cycle (spindle stop)', haasNote: 'Stop, rapid out', fanucNote: 'Stop, rapid out' },

  // Lathe cycles
  { code: 'G70', type: 'Lathe', description: 'Finish cycle', haasNote: 'After G71/G72', fanucNote: 'Finish pass' },
  { code: 'G71', type: 'Lathe', description: 'Rough turning cycle (OD/ID)', haasNote: 'Stock removal Z', fanucNote: 'Stock removal cycle' },
  { code: 'G72', type: 'Lathe', description: 'Rough facing cycle', haasNote: 'Stock removal X', fanucNote: 'Facing cycle' },
  { code: 'G75', type: 'Lathe', description: 'Grooving cycle', haasNote: 'OD grooving', fanucNote: 'Grooving cycle' },

  // Feed modes
  { code: 'G90', type: 'Both', description: 'Absolute programming', haasNote: 'Default mode', fanucNote: 'Absolute coordinates' },
  { code: 'G91', type: 'Both', description: 'Incremental programming', haasNote: 'Relative moves', fanucNote: 'Incremental coordinates' },
  { code: 'G94', type: 'Mill', description: 'Feed per minute mode', haasNote: 'IPM / mm/min', fanucNote: 'Feed per minute' },
  { code: 'G95', type: 'Both', description: 'Feed per revolution mode', haasNote: 'IPR / mm/rev', fanucNote: 'Feed per revolution' },
  { code: 'G96', type: 'Lathe', description: 'Constant surface speed (CSS)', haasNote: 'G96 S200 = 200 SFM', fanucNote: 'CSS mode' },
  { code: 'G97', type: 'Lathe', description: 'Constant RPM mode', haasNote: 'Cancels G96', fanucNote: 'Direct RPM' },
  { code: 'G98', type: 'Mill', description: 'Return to initial level', haasNote: 'Canned cycle', fanucNote: 'Initial point return' },
  { code: 'G99', type: 'Both', description: 'Return to R level / Feed per rev', haasNote: 'Mill: R level, Lathe: IPR', fanucNote: 'R point return / IPR' },

  // M-Codes
  { code: 'M00', type: 'Both', description: 'Program stop', haasNote: 'Cycle start to continue', fanucNote: 'Unconditional stop' },
  { code: 'M01', type: 'Both', description: 'Optional stop', haasNote: 'If OPT STOP on', fanucNote: 'If optional stop switch on' },
  { code: 'M02', type: 'Both', description: 'Program end', haasNote: 'No rewind', fanucNote: 'End without rewind' },
  { code: 'M03', type: 'Both', description: 'Spindle on CW', haasNote: 'Forward rotation', fanucNote: 'Forward rotation' },
  { code: 'M04', type: 'Both', description: 'Spindle on CCW', haasNote: 'Reverse rotation', fanucNote: 'Reverse rotation' },
  { code: 'M05', type: 'Both', description: 'Spindle stop', haasNote: 'Stops spindle', fanucNote: 'Stops spindle' },
  { code: 'M06', type: 'Mill', description: 'Tool change', haasNote: 'T# M06', fanucNote: 'T# M06' },
  { code: 'M08', type: 'Both', description: 'Coolant on (flood)', haasNote: 'Flood coolant', fanucNote: 'Flood coolant' },
  { code: 'M09', type: 'Both', description: 'Coolant off', haasNote: 'Stops coolant', fanucNote: 'Stops coolant' },
  { code: 'M19', type: 'Both', description: 'Spindle orient', haasNote: 'Orient for tool change', fanucNote: 'Spindle orientation' },
  { code: 'M30', type: 'Both', description: 'Program end and rewind', haasNote: 'Resets to start', fanucNote: 'End with rewind' },
  { code: 'M98', type: 'Both', description: 'Subprogram call', haasNote: 'M98 P####', fanucNote: 'M98 P#### L##' },
  { code: 'M99', type: 'Both', description: 'Subprogram return / Loop', haasNote: 'Return from sub', fanucNote: 'Return from sub' }
];

export const mCodes = gCodes.filter(c => c.code.startsWith('M'));
export const gCodesOnly = gCodes.filter(c => c.code.startsWith('G'));
