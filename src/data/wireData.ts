// Pre-calculated best wire sizes for standard threads (60° UN threads)
export interface WireReference {
  thread: string;
  tpi: number;
  pitch: number;
  bestWire: number;
  nominalM: number; // M over wires at nominal pitch diameter
}

export const wireReferenceData: WireReference[] = [
  { thread: '#4-40', tpi: 40, pitch: 0.025, bestWire: 0.0144, nominalM: 0.1200 },
  { thread: '#6-32', tpi: 32, pitch: 0.03125, bestWire: 0.0180, nominalM: 0.1494 },
  { thread: '#8-32', tpi: 32, pitch: 0.03125, bestWire: 0.0180, nominalM: 0.1754 },
  { thread: '#10-24', tpi: 24, pitch: 0.04167, bestWire: 0.0241, nominalM: 0.2060 },
  { thread: '#10-32', tpi: 32, pitch: 0.03125, bestWire: 0.0180, nominalM: 0.2014 },
  { thread: '1/4-20', tpi: 20, pitch: 0.050, bestWire: 0.0289, nominalM: 0.2716 },
  { thread: '1/4-28', tpi: 28, pitch: 0.0357, bestWire: 0.0206, nominalM: 0.2632 },
  { thread: '5/16-18', tpi: 18, pitch: 0.0556, bestWire: 0.0321, nominalM: 0.3394 },
  { thread: '5/16-24', tpi: 24, pitch: 0.04167, bestWire: 0.0241, nominalM: 0.3310 },
  { thread: '3/8-16', tpi: 16, pitch: 0.0625, bestWire: 0.0361, nominalM: 0.4065 },
  { thread: '3/8-24', tpi: 24, pitch: 0.04167, bestWire: 0.0241, nominalM: 0.3935 },
  { thread: '7/16-14', tpi: 14, pitch: 0.0714, bestWire: 0.0412, nominalM: 0.4739 },
  { thread: '7/16-20', tpi: 20, pitch: 0.050, bestWire: 0.0289, nominalM: 0.4591 },
  { thread: '1/2-13', tpi: 13, pitch: 0.0769, bestWire: 0.0444, nominalM: 0.5422 },
  { thread: '1/2-20', tpi: 20, pitch: 0.050, bestWire: 0.0289, nominalM: 0.5216 },
  { thread: '9/16-12', tpi: 12, pitch: 0.0833, bestWire: 0.0481, nominalM: 0.6089 },
  { thread: '9/16-18', tpi: 18, pitch: 0.0556, bestWire: 0.0321, nominalM: 0.5894 },
  { thread: '5/8-11', tpi: 11, pitch: 0.0909, bestWire: 0.0525, nominalM: 0.6762 },
  { thread: '5/8-18', tpi: 18, pitch: 0.0556, bestWire: 0.0321, nominalM: 0.6519 },
  { thread: '3/4-10', tpi: 10, pitch: 0.100, bestWire: 0.0577, nominalM: 0.8086 },
  { thread: '3/4-16', tpi: 16, pitch: 0.0625, bestWire: 0.0361, nominalM: 0.7815 },
  { thread: '7/8-9', tpi: 9, pitch: 0.1111, bestWire: 0.0642, nominalM: 0.9407 },
  { thread: '1"-8', tpi: 8, pitch: 0.125, bestWire: 0.0722, nominalM: 1.0730 }
];

export type ThreadProfile = 'un60' | 'iso60' | 'whitworth55' | 'acme29';

// Calculate M over wires
export function calculateMOverWires(
  pitchDiameter: number,
  wireSize: number,
  pitch: number,
  threadType: ThreadProfile = 'un60'
): number {
  switch (threadType) {
    case 'un60':
    case 'iso60': // ISO 60° uses same formula as UN 60°
      return pitchDiameter + 3 * wireSize - 0.866025 * pitch;
    case 'whitworth55':
      return pitchDiameter + 3.1657 * wireSize - 0.9605 * pitch;
    case 'acme29':
      return pitchDiameter + 4.9939 * wireSize - 1.9333 * pitch;
  }
}

// Calculate pitch diameter from M measurement
export function calculatePitchDiameterFromM(
  mMeasurement: number,
  wireSize: number,
  pitch: number,
  threadType: ThreadProfile = 'un60'
): number {
  switch (threadType) {
    case 'un60':
    case 'iso60':
      return mMeasurement - 3 * wireSize + 0.866025 * pitch;
    case 'whitworth55':
      return mMeasurement - 3.1657 * wireSize + 0.9605 * pitch;
    case 'acme29':
      return mMeasurement - 4.9939 * wireSize + 1.9333 * pitch;
  }
}

// Get best wire size for thread type
export function getBestWireSize(
  pitch: number,
  threadType: ThreadProfile = 'un60'
): number {
  switch (threadType) {
    case 'un60':
    case 'iso60':
      return 0.57735 * pitch;
    case 'whitworth55':
      return 0.56369 * pitch;
    case 'acme29':
      return 0.51635 * pitch;
  }
}
