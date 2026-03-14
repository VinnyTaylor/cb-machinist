export interface GCode {
  code: string;
  type: 'Mill' | 'Lathe' | 'Both';
  description: string;
  group?: string;
  haasNote?: string;
  fanucNote?: string;
}

// ISO G-Code Groups (Modal Groups)
export const isoGroups: Record<string, string> = {
  '01': 'Motion (G00, G01, G02, G03)',
  '02': 'Plane Selection (G17, G18, G19)',
  '03': 'Absolute/Incremental (G90, G91)',
  '04': 'Dwell (G04)',
  '05': 'Feed Rate Mode (G94, G95)',
  '06': 'Units (G20, G21)',
  '07': 'Cutter Compensation (G40, G41, G42)',
  '08': 'Tool Length Comp (G43, G44, G49)',
  '09': 'Canned Cycles (G73, G80-G89)',
  '10': 'Return Mode (G98, G99)',
  '12': 'Work Coordinates (G54-G59)',
  '13': 'Spindle Speed Mode (G96, G97)',
  '00': 'Non-modal (G04, G28, G53)',
  'M-A': 'Program Control (M00, M01, M02, M30)',
  'M-B': 'Spindle (M03, M04, M05, M19)',
  'M-C': 'Coolant (M08, M09, M88, M89)',
  'M-D': 'Tool Change (M06)',
  'M-E': 'Subprograms (M98, M99)'
};

export const gCodes: GCode[] = [
  // G-Codes - Motion (Group 01)
  { code: 'G00', type: 'Both', group: '01', description: 'Rapid positioning (non-cutting move)', haasNote: 'Max traverse rate', fanucNote: 'Max rapid rate' },
  { code: 'G01', type: 'Both', group: '01', description: 'Linear interpolation (cutting feed)', haasNote: 'Requires F word', fanucNote: 'Requires F word' },
  { code: 'G02', type: 'Both', group: '01', description: 'Circular interpolation CW', haasNote: 'Use I,J or R', fanucNote: 'Use I,J,K or R' },
  { code: 'G03', type: 'Both', group: '01', description: 'Circular interpolation CCW', haasNote: 'Use I,J or R', fanucNote: 'Use I,J,K or R' },
  { code: 'G04', type: 'Both', group: '00', description: 'Dwell (pause)', haasNote: 'P in seconds', fanucNote: 'P in milliseconds or X in seconds' },

  // Plane selection (Group 02)
  { code: 'G17', type: 'Mill', group: '02', description: 'XY plane selection', haasNote: 'Default plane', fanucNote: 'For G02/G03 arcs' },
  { code: 'G18', type: 'Both', group: '02', description: 'XZ plane selection', haasNote: 'For lathe or mill side', fanucNote: 'Lathe default' },
  { code: 'G19', type: 'Mill', group: '02', description: 'YZ plane selection', haasNote: 'Rarely used', fanucNote: 'Rarely used' },

  // Units (Group 06)
  { code: 'G20', type: 'Both', group: '06', description: 'Inch units', haasNote: 'Sets inch mode', fanucNote: 'G70 on older controls' },
  { code: 'G21', type: 'Both', group: '06', description: 'Metric units (mm)', haasNote: 'Sets metric mode', fanucNote: 'G71 on older controls' },

  // Reference point return (Group 00 - Non-modal)
  { code: 'G28', type: 'Both', group: '00', description: 'Return to home position', haasNote: 'Through intermediate point', fanucNote: 'Machine zero return' },
  { code: 'G29', type: 'Both', group: '00', description: 'Return from reference point', haasNote: 'After G28', fanucNote: 'After G28' },
  { code: 'G30', type: 'Both', group: '00', description: 'Return to 2nd reference point', haasNote: 'Secondary home', fanucNote: 'Secondary home' },

  // Cutter compensation (Group 07)
  { code: 'G40', type: 'Both', group: '07', description: 'Cancel cutter compensation', haasNote: 'Cancels G41/G42', fanucNote: 'Cancels G41/G42' },
  { code: 'G41', type: 'Both', group: '07', description: 'Cutter compensation left', haasNote: 'Tool left of path', fanucNote: 'Requires D word' },
  { code: 'G42', type: 'Both', group: '07', description: 'Cutter compensation right', haasNote: 'Tool right of path', fanucNote: 'Requires D word' },
  { code: 'G43', type: 'Mill', group: '08', description: 'Tool length compensation +', haasNote: 'H = offset number', fanucNote: 'H = offset number' },
  { code: 'G44', type: 'Mill', group: '08', description: 'Tool length compensation -', haasNote: 'Rarely used', fanucNote: 'Negative direction' },
  { code: 'G49', type: 'Mill', group: '08', description: 'Cancel tool length compensation', haasNote: 'Cancels G43/G44', fanucNote: 'Cancels G43/G44' },

  // Work offsets (Group 12)
  { code: 'G50', type: 'Lathe', group: '00', description: 'Set coordinate / max RPM limit', haasNote: 'G50 S3000 = max 3000 RPM', fanucNote: 'Same usage' },
  { code: 'G52', type: 'Mill', group: '00', description: 'Local coordinate system', haasNote: 'Temporary shift', fanucNote: 'Temporary shift' },
  { code: 'G53', type: 'Both', group: '00', description: 'Machine coordinate system', haasNote: 'Non-modal', fanucNote: 'Non-modal' },
  { code: 'G54', type: 'Both', group: '12', description: 'Work offset 1', haasNote: 'Most common', fanucNote: 'First work offset' },
  { code: 'G55', type: 'Both', group: '12', description: 'Work offset 2', haasNote: 'Second fixture', fanucNote: 'Second work offset' },
  { code: 'G56', type: 'Both', group: '12', description: 'Work offset 3', haasNote: 'Third fixture', fanucNote: 'Third work offset' },
  { code: 'G57', type: 'Both', group: '12', description: 'Work offset 4', haasNote: 'Fourth fixture', fanucNote: 'Fourth work offset' },
  { code: 'G58', type: 'Both', group: '12', description: 'Work offset 5', haasNote: 'Fifth fixture', fanucNote: 'Fifth work offset' },
  { code: 'G59', type: 'Both', group: '12', description: 'Work offset 6', haasNote: 'Sixth fixture', fanucNote: 'Sixth work offset' },

  // Canned cycles - Drilling (Group 09)
  { code: 'G73', type: 'Mill', group: '09', description: 'High-speed peck drill cycle', haasNote: 'Q = peck depth', fanucNote: 'Chip breaking cycle' },
  { code: 'G74', type: 'Lathe', group: '09', description: 'Left-hand tapping cycle', haasNote: 'Reverse tap', fanucNote: 'Reverse tap' },
  { code: 'G76', type: 'Lathe', group: '00', description: 'Threading cycle (multi-pass)', haasNote: 'Full thread cycle', fanucNote: 'Full thread cycle' },
  { code: 'G80', type: 'Both', group: '09', description: 'Cancel canned cycle', haasNote: 'Ends drilling cycle', fanucNote: 'Ends drilling cycle' },
  { code: 'G81', type: 'Mill', group: '09', description: 'Drill cycle (no peck)', haasNote: 'Simple drill', fanucNote: 'Simple drill' },
  { code: 'G82', type: 'Mill', group: '09', description: 'Drill cycle with dwell', haasNote: 'P = dwell time', fanucNote: 'P = dwell time' },
  { code: 'G83', type: 'Mill', group: '09', description: 'Deep hole peck drill', haasNote: 'Q = peck, full retract', fanucNote: 'Q = peck increment' },
  { code: 'G84', type: 'Mill', group: '09', description: 'Tapping cycle', haasNote: 'Rigid tap default', fanucNote: 'Requires synced spindle' },
  { code: 'G85', type: 'Mill', group: '09', description: 'Boring cycle (feed out)', haasNote: 'Feed retract', fanucNote: 'Feed retract' },
  { code: 'G86', type: 'Mill', group: '09', description: 'Boring cycle (spindle stop)', haasNote: 'Stop, rapid out', fanucNote: 'Stop, rapid out' },

  // Lathe cycles
  { code: 'G70', type: 'Lathe', group: '00', description: 'Finish cycle', haasNote: 'After G71/G72', fanucNote: 'Finish pass' },
  { code: 'G71', type: 'Lathe', group: '00', description: 'Rough turning cycle (OD/ID)', haasNote: 'Stock removal Z', fanucNote: 'Stock removal cycle' },
  { code: 'G72', type: 'Lathe', group: '00', description: 'Rough facing cycle', haasNote: 'Stock removal X', fanucNote: 'Facing cycle' },
  { code: 'G75', type: 'Lathe', group: '00', description: 'Grooving cycle', haasNote: 'OD grooving', fanucNote: 'Grooving cycle' },

  // Feed modes (Group 03, 05, 10, 13)
  { code: 'G90', type: 'Both', group: '03', description: 'Absolute programming', haasNote: 'Default mode', fanucNote: 'Absolute coordinates' },
  { code: 'G91', type: 'Both', group: '03', description: 'Incremental programming', haasNote: 'Relative moves', fanucNote: 'Incremental coordinates' },
  { code: 'G94', type: 'Mill', group: '05', description: 'Feed per minute mode', haasNote: 'IPM / mm/min', fanucNote: 'Feed per minute' },
  { code: 'G95', type: 'Both', group: '05', description: 'Feed per revolution mode', haasNote: 'IPR / mm/rev', fanucNote: 'Feed per revolution' },
  { code: 'G96', type: 'Lathe', group: '13', description: 'Constant surface speed (CSS)', haasNote: 'G96 S200 = 200 SFM', fanucNote: 'CSS mode' },
  { code: 'G97', type: 'Lathe', group: '13', description: 'Constant RPM mode', haasNote: 'Cancels G96', fanucNote: 'Direct RPM' },
  { code: 'G98', type: 'Mill', group: '10', description: 'Return to initial level', haasNote: 'Canned cycle', fanucNote: 'Initial point return' },
  { code: 'G99', type: 'Both', group: '10', description: 'Return to R level / Feed per rev', haasNote: 'Mill: R level, Lathe: IPR', fanucNote: 'R point return / IPR' },

  // M-Codes - Program Control (Group M-A)
  { code: 'M00', type: 'Both', group: 'M-A', description: 'Program stop', haasNote: 'Cycle start to continue', fanucNote: 'Unconditional stop' },
  { code: 'M01', type: 'Both', group: 'M-A', description: 'Optional stop', haasNote: 'If OPT STOP on', fanucNote: 'If optional stop switch on' },
  { code: 'M02', type: 'Both', group: 'M-A', description: 'Program end', haasNote: 'No rewind', fanucNote: 'End without rewind' },

  // M-Codes - Spindle (Group M-B)
  { code: 'M03', type: 'Both', group: 'M-B', description: 'Spindle on CW', haasNote: 'Forward rotation', fanucNote: 'Forward rotation' },
  { code: 'M04', type: 'Both', group: 'M-B', description: 'Spindle on CCW', haasNote: 'Reverse rotation', fanucNote: 'Reverse rotation' },
  { code: 'M05', type: 'Both', group: 'M-B', description: 'Spindle stop', haasNote: 'Stops spindle', fanucNote: 'Stops spindle' },
  { code: 'M19', type: 'Both', group: 'M-B', description: 'Spindle orient', haasNote: 'Orient for tool change', fanucNote: 'Spindle orientation' },

  // M-Codes - Tool Change (Group M-D)
  { code: 'M06', type: 'Mill', group: 'M-D', description: 'Tool change', haasNote: 'T# M06', fanucNote: 'T# M06' },

  // M-Codes - Coolant (Group M-C)
  { code: 'M08', type: 'Both', group: 'M-C', description: 'Coolant on (flood)', haasNote: 'Flood coolant', fanucNote: 'Flood coolant' },
  { code: 'M09', type: 'Both', group: 'M-C', description: 'Coolant off', haasNote: 'Stops coolant', fanucNote: 'Stops coolant' },
  { code: 'M88', type: 'Both', group: 'M-C', description: 'High-pressure coolant on (thru-spindle)', haasNote: 'TSC on, requires option', fanucNote: 'High-pressure coolant on' },
  { code: 'M89', type: 'Both', group: 'M-C', description: 'High-pressure coolant off', haasNote: 'TSC off', fanucNote: 'High-pressure coolant off' },

  // M-Codes - Program Control continued
  { code: 'M30', type: 'Both', group: 'M-A', description: 'Program end and rewind', haasNote: 'Resets to start', fanucNote: 'End with rewind' },

  // M-Codes - Subprograms (Group M-E)
  { code: 'M98', type: 'Both', group: 'M-E', description: 'Subprogram call', haasNote: 'M98 P####', fanucNote: 'M98 P#### L##' },
  { code: 'M99', type: 'Both', group: 'M-E', description: 'Subprogram return / Loop', haasNote: 'Return from sub', fanucNote: 'Return from sub' }
];

export const mCodes = gCodes.filter(c => c.code.startsWith('M'));
export const gCodesOnly = gCodes.filter(c => c.code.startsWith('G'));
