export interface ThreadSize {
  name: string;
  tpi: number;
  majorDia: number;
  pitch: number;
  threadDepth: number;
  minorDia: number;
  tapDrill: string;
  tapDrillDecimal: number;
}

export const standardThreads: ThreadSize[] = [
  { name: '#4-40', tpi: 40, majorDia: 0.112, pitch: 0.025, threadDepth: 0.0162, minorDia: 0.0795, tapDrill: '#43', tapDrillDecimal: 0.089 },
  { name: '#6-32', tpi: 32, majorDia: 0.138, pitch: 0.03125, threadDepth: 0.0203, minorDia: 0.0974, tapDrill: '#36', tapDrillDecimal: 0.1065 },
  { name: '#8-32', tpi: 32, majorDia: 0.164, pitch: 0.03125, threadDepth: 0.0203, minorDia: 0.1234, tapDrill: '#29', tapDrillDecimal: 0.136 },
  { name: '#10-24', tpi: 24, majorDia: 0.190, pitch: 0.04167, threadDepth: 0.0271, minorDia: 0.1359, tapDrill: '#25', tapDrillDecimal: 0.1495 },
  { name: '#10-32', tpi: 32, majorDia: 0.190, pitch: 0.03125, threadDepth: 0.0203, minorDia: 0.1494, tapDrill: '#21', tapDrillDecimal: 0.159 },
  { name: '1/4-20', tpi: 20, majorDia: 0.250, pitch: 0.050, threadDepth: 0.0325, minorDia: 0.185, tapDrill: '#7', tapDrillDecimal: 0.201 },
  { name: '1/4-28', tpi: 28, majorDia: 0.250, pitch: 0.0357, threadDepth: 0.0232, minorDia: 0.2036, tapDrill: '#3', tapDrillDecimal: 0.213 },
  { name: '5/16-18', tpi: 18, majorDia: 0.3125, pitch: 0.0556, threadDepth: 0.0361, minorDia: 0.2403, tapDrill: 'F', tapDrillDecimal: 0.257 },
  { name: '5/16-24', tpi: 24, majorDia: 0.3125, pitch: 0.04167, threadDepth: 0.0271, minorDia: 0.2584, tapDrill: 'I', tapDrillDecimal: 0.272 },
  { name: '3/8-16', tpi: 16, majorDia: 0.375, pitch: 0.0625, threadDepth: 0.0406, minorDia: 0.2938, tapDrill: '5/16', tapDrillDecimal: 0.3125 },
  { name: '3/8-24', tpi: 24, majorDia: 0.375, pitch: 0.04167, threadDepth: 0.0271, minorDia: 0.3209, tapDrill: 'Q', tapDrillDecimal: 0.332 },
  { name: '7/16-14', tpi: 14, majorDia: 0.4375, pitch: 0.0714, threadDepth: 0.0464, minorDia: 0.3447, tapDrill: 'U', tapDrillDecimal: 0.368 },
  { name: '7/16-20', tpi: 20, majorDia: 0.4375, pitch: 0.050, threadDepth: 0.0325, minorDia: 0.3725, tapDrill: '25/64', tapDrillDecimal: 0.3906 },
  { name: '1/2-13', tpi: 13, majorDia: 0.500, pitch: 0.0769, threadDepth: 0.050, minorDia: 0.400, tapDrill: '27/64', tapDrillDecimal: 0.4219 },
  { name: '1/2-20', tpi: 20, majorDia: 0.500, pitch: 0.050, threadDepth: 0.0325, minorDia: 0.435, tapDrill: '29/64', tapDrillDecimal: 0.4531 },
  { name: '9/16-12', tpi: 12, majorDia: 0.5625, pitch: 0.0833, threadDepth: 0.0541, minorDia: 0.4542, tapDrill: '31/64', tapDrillDecimal: 0.4844 },
  { name: '9/16-18', tpi: 18, majorDia: 0.5625, pitch: 0.0556, threadDepth: 0.0361, minorDia: 0.4903, tapDrill: '33/64', tapDrillDecimal: 0.5156 },
  { name: '5/8-11', tpi: 11, majorDia: 0.625, pitch: 0.0909, threadDepth: 0.0591, minorDia: 0.5069, tapDrill: '17/32', tapDrillDecimal: 0.5312 },
  { name: '5/8-18', tpi: 18, majorDia: 0.625, pitch: 0.0556, threadDepth: 0.0361, minorDia: 0.5528, tapDrill: '37/64', tapDrillDecimal: 0.5781 },
  { name: '3/4-10', tpi: 10, majorDia: 0.750, pitch: 0.100, threadDepth: 0.065, minorDia: 0.620, tapDrill: '21/32', tapDrillDecimal: 0.6562 },
  { name: '3/4-16', tpi: 16, majorDia: 0.750, pitch: 0.0625, threadDepth: 0.0406, minorDia: 0.6688, tapDrill: '11/16', tapDrillDecimal: 0.6875 },
  { name: '7/8-9', tpi: 9, majorDia: 0.875, pitch: 0.1111, threadDepth: 0.0722, minorDia: 0.7307, tapDrill: '49/64', tapDrillDecimal: 0.7656 },
  { name: '1"-8', tpi: 8, majorDia: 1.000, pitch: 0.125, threadDepth: 0.0812, minorDia: 0.8376, tapDrill: '7/8', tapDrillDecimal: 0.875 }
];

export const getThreadByName = (name: string): ThreadSize | undefined => {
  return standardThreads.find(t => t.name === name);
};

// Thread class tolerances based on ASME B1.1
export interface ThreadClassData {
  name: string;
  description: string;
  toleranceMultiplier: number;
  hasAllowance: boolean;
  allowanceMultiplier: number;
}

export const externalClasses: ThreadClassData[] = [
  {
    name: '1A',
    description: 'Loose fit — easy assembly, allows for dirt/damage (rarely used in precision work)',
    toleranceMultiplier: 1.5,
    hasAllowance: true,
    allowanceMultiplier: 1.0
  },
  {
    name: '2A',
    description: 'Standard fit — used for most commercial bolts, nuts, and machined threads',
    toleranceMultiplier: 1.0,
    hasAllowance: true,
    allowanceMultiplier: 1.0
  },
  {
    name: '3A',
    description: 'Precision fit — tight tolerances, used in aerospace, tooling, critical assemblies',
    toleranceMultiplier: 0.75,
    hasAllowance: false,
    allowanceMultiplier: 0
  }
];

export const internalClasses: ThreadClassData[] = [
  {
    name: '1B',
    description: 'Loose fit — easy assembly, allows for dirt/damage',
    toleranceMultiplier: 1.95,
    hasAllowance: false,
    allowanceMultiplier: 0
  },
  {
    name: '2B',
    description: 'Standard fit — used for most commercial tapped holes',
    toleranceMultiplier: 1.30,
    hasAllowance: false,
    allowanceMultiplier: 0
  },
  {
    name: '3B',
    description: 'Precision fit — tight tolerances for critical assemblies',
    toleranceMultiplier: 0.975,
    hasAllowance: false,
    allowanceMultiplier: 0
  }
];

// Wire measurement constants by thread type
export const wireConstants = {
  un60: { bestWireFactor: 0.57735, mFormula: { wireCoeff: 3, pitchCoeff: 0.866025 } },
  whitworth55: { bestWireFactor: 0.56369, mFormula: { wireCoeff: 3.1657, pitchCoeff: 0.9605 } },
  acme29: { bestWireFactor: 0.51635, mFormula: { wireCoeff: 4.9939, pitchCoeff: 1.9333 } }
};
