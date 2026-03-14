// HSS Drill Speeds & Feeds Data
// Based on Norseman drill bit recommendations

export interface HssSfmRange {
  min: number;
  max: number;
}

export interface HssIprRange {
  maxDia: number;  // Diameter up to this value
  min: number;
  max: number;
}

export interface HssMaterial {
  id: string;
  name: string;
  sfm: HssSfmRange;
  notes?: string;
}

// SFM by material (from Norseman and industry standards)
export const hssMaterials: HssMaterial[] = [
  { id: 'aluminum', name: 'Aluminum (2024, 6061, 7075)', sfm: { min: 200, max: 300 }, notes: 'Use coolant to prevent chip welding' },
  { id: 'aluminum-cast', name: 'Aluminum Cast', sfm: { min: 150, max: 250 }, notes: 'Reduce speed for high-silicon alloys' },
  { id: 'brass', name: 'Brass / Bronze', sfm: { min: 150, max: 300 }, notes: 'Free-machining, watch for grabbing on breakthrough' },
  { id: 'copper', name: 'Copper', sfm: { min: 100, max: 150 }, notes: 'Gummy material, use sharp drills' },
  { id: 'mild-steel', name: 'Mild Steel (1018, A36)', sfm: { min: 80, max: 110 }, notes: 'Standard HSS drill parameters' },
  { id: 'medium-carbon', name: 'Medium Carbon Steel (1045)', sfm: { min: 60, max: 90 }, notes: 'Reduce speed as hardness increases' },
  { id: 'alloy-steel', name: 'Alloy Steel (4140, 4340)', sfm: { min: 50, max: 70 }, notes: 'Use sulphurized cutting oil' },
  { id: 'tool-steel', name: 'Tool Steel (A2, D2, O1)', sfm: { min: 30, max: 50 }, notes: 'Very slow speeds, sharp drills essential' },
  { id: 'stainless-303', name: 'Stainless 303/304', sfm: { min: 30, max: 50 }, notes: 'Avoid work hardening - maintain positive feed' },
  { id: 'stainless-316', name: 'Stainless 316', sfm: { min: 25, max: 40 }, notes: 'Slower than 304, maintain constant feed' },
  { id: 'stainless-17-4', name: 'Stainless 17-4 PH', sfm: { min: 20, max: 35 }, notes: 'Very low speeds, high pressure coolant helps' },
  { id: 'cast-iron-gray', name: 'Cast Iron (Gray)', sfm: { min: 75, max: 125 }, notes: 'Run dry or with air blast' },
  { id: 'cast-iron-ductile', name: 'Cast Iron (Ductile)', sfm: { min: 60, max: 100 }, notes: 'Slightly lower speeds than gray' },
  { id: 'titanium', name: 'Titanium (6Al-4V)', sfm: { min: 20, max: 35 }, notes: 'Very slow, high feed, flood coolant' },
  { id: 'inconel', name: 'Inconel / Hastelloy', sfm: { min: 10, max: 20 }, notes: 'Extremely slow, sharp drills, peck drilling' },
  { id: 'plastic-acrylic', name: 'Plastic (Acrylic, Delrin)', sfm: { min: 150, max: 300 }, notes: 'High speed, watch for melting' },
  { id: 'plastic-nylon', name: 'Plastic (Nylon, HDPE)', sfm: { min: 100, max: 200 }, notes: 'Moderate speed, may need peck cycle' },
  { id: 'wood-softwood', name: 'Wood (Softwood)', sfm: { min: 300, max: 500 }, notes: 'Brad point preferred' },
  { id: 'wood-hardwood', name: 'Wood (Hardwood)', sfm: { min: 200, max: 400 }, notes: 'Reduce speed for very hard woods' }
];

// IPR (inches per revolution) by drill diameter range
export const hssIprByDiameter: HssIprRange[] = [
  { maxDia: 0.125, min: 0.001, max: 0.003 },   // Up to 1/8"
  { maxDia: 0.25, min: 0.002, max: 0.006 },    // Up to 1/4"
  { maxDia: 0.375, min: 0.003, max: 0.008 },   // Up to 3/8"
  { maxDia: 0.5, min: 0.004, max: 0.010 },     // Up to 1/2"
  { maxDia: 0.75, min: 0.006, max: 0.012 },    // Up to 3/4"
  { maxDia: 1.0, min: 0.007, max: 0.015 },     // Up to 1"
  { maxDia: 1.5, min: 0.010, max: 0.018 },     // Up to 1.5"
  { maxDia: Infinity, min: 0.015, max: 0.025 } // Over 1.5"
];

// Get SFM range for a material
export function getHssSfm(materialId: string): HssSfmRange | null {
  const mat = hssMaterials.find(m => m.id === materialId);
  return mat ? mat.sfm : null;
}

// Get material by ID
export function getHssMaterial(materialId: string): HssMaterial | null {
  return hssMaterials.find(m => m.id === materialId) || null;
}

// Get IPR range for a given diameter
export function getHssIpr(diameter: number): HssIprRange {
  for (const range of hssIprByDiameter) {
    if (diameter <= range.maxDia) {
      return range;
    }
  }
  return hssIprByDiameter[hssIprByDiameter.length - 1];
}

// Calculate RPM from SFM and diameter
// RPM = (SFM × 3.8197) / diameter
// Or equivalently: RPM = (SFM × 12) / (π × diameter)
export function calculateRpm(sfm: number, diameter: number): number {
  if (diameter <= 0) return 0;
  return (sfm * 3.8197) / diameter;
}

// Calculate IPM from IPR and RPM
export function calculateIpm(ipr: number, rpm: number): number {
  return ipr * rpm;
}

// Calculate peck depth for deep holes
export function calculatePeckDepth(diameter: number, depth: number): {
  isPeckRequired: boolean;
  peckDepth: number;
  numberOfPecks: number;
  depthRatio: number;
} {
  const depthRatio = depth / diameter;
  const isPeckRequired = depthRatio > 4;

  // Standard peck depth is 1-3x diameter
  const peckDepth = isPeckRequired ? diameter * 1.5 : depth;
  const numberOfPecks = isPeckRequired ? Math.ceil(depth / peckDepth) : 1;

  return {
    isPeckRequired,
    peckDepth,
    numberOfPecks,
    depthRatio
  };
}
