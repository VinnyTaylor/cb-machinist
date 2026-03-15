export interface ThreadSize {
  name: string;
  tpi: number;
  majorDia: number;
  pitch: number;
  threadDepth: number;
  minorDia: number;
  tapDrill: string;
  tapDrillDecimal: number;
  isMetric?: boolean;
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

// ISO Metric Coarse threads (dimensions in inches for consistency)
export const metricThreads: ThreadSize[] = [
  { name: 'M3x0.5', tpi: 50.8, majorDia: 0.1181, pitch: 0.0197, threadDepth: 0.0128, minorDia: 0.0925, tapDrill: '2.5mm', tapDrillDecimal: 0.0984, isMetric: true },
  { name: 'M4x0.7', tpi: 36.29, majorDia: 0.1575, pitch: 0.0276, threadDepth: 0.0179, minorDia: 0.1217, tapDrill: '3.3mm', tapDrillDecimal: 0.1299, isMetric: true },
  { name: 'M5x0.8', tpi: 31.75, majorDia: 0.1969, pitch: 0.0315, threadDepth: 0.0205, minorDia: 0.1560, tapDrill: '4.2mm', tapDrillDecimal: 0.1654, isMetric: true },
  { name: 'M6x1', tpi: 25.4, majorDia: 0.2362, pitch: 0.0394, threadDepth: 0.0256, minorDia: 0.1850, tapDrill: '5mm', tapDrillDecimal: 0.1969, isMetric: true },
  { name: 'M8x1.25', tpi: 20.32, majorDia: 0.3150, pitch: 0.0492, threadDepth: 0.0320, minorDia: 0.2510, tapDrill: '6.8mm', tapDrillDecimal: 0.2677, isMetric: true },
  { name: 'M10x1.5', tpi: 16.93, majorDia: 0.3937, pitch: 0.0591, threadDepth: 0.0384, minorDia: 0.3169, tapDrill: '8.5mm', tapDrillDecimal: 0.3346, isMetric: true },
  { name: 'M12x1.75', tpi: 14.51, majorDia: 0.4724, pitch: 0.0689, threadDepth: 0.0448, minorDia: 0.3829, tapDrill: '10.2mm', tapDrillDecimal: 0.4016, isMetric: true },
  { name: 'M14x2', tpi: 12.7, majorDia: 0.5512, pitch: 0.0787, threadDepth: 0.0512, minorDia: 0.4488, tapDrill: '12mm', tapDrillDecimal: 0.4724, isMetric: true },
  { name: 'M16x2', tpi: 12.7, majorDia: 0.6299, pitch: 0.0787, threadDepth: 0.0512, minorDia: 0.5276, tapDrill: '14mm', tapDrillDecimal: 0.5512, isMetric: true },
  { name: 'M20x2.5', tpi: 10.16, majorDia: 0.7874, pitch: 0.0984, threadDepth: 0.0639, minorDia: 0.6596, tapDrill: '17.5mm', tapDrillDecimal: 0.6890, isMetric: true },
  { name: 'M24x3', tpi: 8.47, majorDia: 0.9449, pitch: 0.1181, threadDepth: 0.0767, minorDia: 0.7914, tapDrill: '21mm', tapDrillDecimal: 0.8268, isMetric: true },
];

// ISO Metric Fine threads
export const metricFineThreads: ThreadSize[] = [
  { name: 'M6x0.75', tpi: 33.87, majorDia: 0.2362, pitch: 0.0295, threadDepth: 0.0192, minorDia: 0.1978, tapDrill: '5.25mm', tapDrillDecimal: 0.2067, isMetric: true },
  { name: 'M8x1', tpi: 25.4, majorDia: 0.3150, pitch: 0.0394, threadDepth: 0.0256, minorDia: 0.2638, tapDrill: '7mm', tapDrillDecimal: 0.2756, isMetric: true },
  { name: 'M10x1.25', tpi: 20.32, majorDia: 0.3937, pitch: 0.0492, threadDepth: 0.0320, minorDia: 0.3297, tapDrill: '8.75mm', tapDrillDecimal: 0.3445, isMetric: true },
  { name: 'M12x1.5', tpi: 16.93, majorDia: 0.4724, pitch: 0.0591, threadDepth: 0.0384, minorDia: 0.3956, tapDrill: '10.5mm', tapDrillDecimal: 0.4134, isMetric: true },
  { name: 'M14x1.5', tpi: 16.93, majorDia: 0.5512, pitch: 0.0591, threadDepth: 0.0384, minorDia: 0.4744, tapDrill: '12.5mm', tapDrillDecimal: 0.4921, isMetric: true },
  { name: 'M16x1.5', tpi: 16.93, majorDia: 0.6299, pitch: 0.0591, threadDepth: 0.0384, minorDia: 0.5531, tapDrill: '14.5mm', tapDrillDecimal: 0.5709, isMetric: true },
  { name: 'M20x1.5', tpi: 16.93, majorDia: 0.7874, pitch: 0.0591, threadDepth: 0.0384, minorDia: 0.7106, tapDrill: '18.5mm', tapDrillDecimal: 0.7283, isMetric: true },
];

export const getThreadByName = (name: string): ThreadSize | undefined => {
  return [...standardThreads, ...metricThreads, ...metricFineThreads].find(t => t.name === name);
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

// NPT (National Pipe Thread Tapered) - ANSI/ASME B1.20.1
// 60° thread angle, 1:16 taper (0.75"/ft = 0.0625"/in per side)
export interface PipeThread {
  name: string;
  tpi: number;
  nominalOD: number;      // Nominal pipe OD at hand-tight engagement
  pitchDia: number;       // Pitch diameter at hand-tight plane
  majorDia: number;       // Major diameter at hand-tight plane
  minorDia: number;       // Minor diameter
  tapDrill: string;
  tapDrillDecimal: number;
  threadLength: number;   // Effective thread length (L2)
  taperPerInch: number;   // Taper rate per inch (diameter change)
  isPipe: true;
}

export const nptThreads: PipeThread[] = [
  { name: '1/8 NPT', tpi: 27, nominalOD: 0.405, pitchDia: 0.37476, majorDia: 0.3896, minorDia: 0.3339, tapDrill: 'R', tapDrillDecimal: 0.339, threadLength: 0.2639, taperPerInch: 0.0625, isPipe: true },
  { name: '1/4 NPT', tpi: 18, nominalOD: 0.540, pitchDia: 0.49163, majorDia: 0.5135, minorDia: 0.4329, tapDrill: '7/16', tapDrillDecimal: 0.4375, threadLength: 0.4018, taperPerInch: 0.0625, isPipe: true },
  { name: '3/8 NPT', tpi: 18, nominalOD: 0.675, pitchDia: 0.62701, majorDia: 0.6485, minorDia: 0.5679, tapDrill: '37/64', tapDrillDecimal: 0.5781, threadLength: 0.4078, taperPerInch: 0.0625, isPipe: true },
  { name: '1/2 NPT', tpi: 14, nominalOD: 0.840, pitchDia: 0.77843, majorDia: 0.8062, minorDia: 0.7013, tapDrill: '23/32', tapDrillDecimal: 0.7188, threadLength: 0.5337, taperPerInch: 0.0625, isPipe: true },
  { name: '3/4 NPT', tpi: 14, nominalOD: 1.050, pitchDia: 0.98887, majorDia: 1.0168, minorDia: 0.9112, tapDrill: '59/64', tapDrillDecimal: 0.9219, threadLength: 0.5457, taperPerInch: 0.0625, isPipe: true },
  { name: '1 NPT', tpi: 11.5, nominalOD: 1.315, pitchDia: 1.23863, majorDia: 1.2735, minorDia: 1.1401, tapDrill: '1-5/32', tapDrillDecimal: 1.1562, threadLength: 0.6828, taperPerInch: 0.0625, isPipe: true },
  { name: '1-1/4 NPT', tpi: 11.5, nominalOD: 1.660, pitchDia: 1.58338, majorDia: 1.6180, minorDia: 1.4849, tapDrill: '1-1/2', tapDrillDecimal: 1.5000, threadLength: 0.7068, taperPerInch: 0.0625, isPipe: true },
  { name: '1-1/2 NPT', tpi: 11.5, nominalOD: 1.900, pitchDia: 1.82234, majorDia: 1.8571, minorDia: 1.7237, tapDrill: '1-47/64', tapDrillDecimal: 1.7344, threadLength: 0.7235, taperPerInch: 0.0625, isPipe: true },
  { name: '2 NPT', tpi: 11.5, nominalOD: 2.375, pitchDia: 2.29627, majorDia: 2.3310, minorDia: 2.1976, tapDrill: '2-7/32', tapDrillDecimal: 2.2188, threadLength: 0.7565, taperPerInch: 0.0625, isPipe: true },
];

// BSPT (British Standard Pipe Tapered) - ISO 7/1, BS 21
// 55° Whitworth thread angle, 1:16 taper
export const bsptThreads: PipeThread[] = [
  { name: '1/8 BSPT', tpi: 28, nominalOD: 0.383, pitchDia: 0.3568, majorDia: 0.3710, minorDia: 0.3200, tapDrill: '8.5mm', tapDrillDecimal: 0.335, threadLength: 0.256, taperPerInch: 0.0625, isPipe: true },
  { name: '1/4 BSPT', tpi: 19, nominalOD: 0.518, pitchDia: 0.4838, majorDia: 0.5040, minorDia: 0.4338, tapDrill: '11.5mm', tapDrillDecimal: 0.453, threadLength: 0.374, taperPerInch: 0.0625, isPipe: true },
  { name: '3/8 BSPT', tpi: 19, nominalOD: 0.656, pitchDia: 0.6217, majorDia: 0.6418, minorDia: 0.5717, tapDrill: '15mm', tapDrillDecimal: 0.591, threadLength: 0.394, taperPerInch: 0.0625, isPipe: true },
  { name: '1/2 BSPT', tpi: 14, nominalOD: 0.825, pitchDia: 0.7793, majorDia: 0.8062, minorDia: 0.7027, tapDrill: '18.5mm', tapDrillDecimal: 0.728, threadLength: 0.512, taperPerInch: 0.0625, isPipe: true },
  { name: '3/4 BSPT', tpi: 14, nominalOD: 1.041, pitchDia: 0.9949, majorDia: 1.0218, minorDia: 0.9183, tapDrill: '24mm', tapDrillDecimal: 0.945, threadLength: 0.531, taperPerInch: 0.0625, isPipe: true },
  { name: '1 BSPT', tpi: 11, nominalOD: 1.309, pitchDia: 1.2531, majorDia: 1.2878, minorDia: 1.1590, tapDrill: '30mm', tapDrillDecimal: 1.181, threadLength: 0.669, taperPerInch: 0.0625, isPipe: true },
  { name: '1-1/4 BSPT', tpi: 11, nominalOD: 1.650, pitchDia: 1.5938, majorDia: 1.6286, minorDia: 1.4997, tapDrill: '39mm', tapDrillDecimal: 1.535, threadLength: 0.709, taperPerInch: 0.0625, isPipe: true },
  { name: '1-1/2 BSPT', tpi: 11, nominalOD: 1.882, pitchDia: 1.8251, majorDia: 1.8599, minorDia: 1.7310, tapDrill: '45mm', tapDrillDecimal: 1.772, threadLength: 0.728, taperPerInch: 0.0625, isPipe: true },
  { name: '2 BSPT', tpi: 11, nominalOD: 2.347, pitchDia: 2.2895, majorDia: 2.3242, minorDia: 2.1954, tapDrill: '57mm', tapDrillDecimal: 2.244, threadLength: 0.768, taperPerInch: 0.0625, isPipe: true },
];

export const getPipeThreadByName = (name: string): PipeThread | undefined => {
  return [...nptThreads, ...bsptThreads].find(t => t.name === name);
};
