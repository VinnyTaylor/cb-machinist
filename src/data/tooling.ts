// Tooling recommendations and reference data

// Flute count guidance - why and when to use more or fewer flutes
export interface FluteGuidance {
  fluteCount: string;
  chipLoad: string;
  rigidity: string;
  chipEvacuation: string;
  bestFor: string[];
  notes: string;
}

export const fluteGuidance: FluteGuidance[] = [
  {
    fluteCount: '1-2 flutes',
    chipLoad: 'Highest chip load per tooth',
    rigidity: 'Lower rigidity',
    chipEvacuation: 'Excellent - large gullets',
    bestFor: ['Aluminum', 'Plastics', 'Soft materials', 'Slotting', 'Deep pockets'],
    notes: 'More room for chips to escape. Prevents chip re-cutting and heat buildup. Essential for gummy materials that produce long, stringy chips.'
  },
  {
    fluteCount: '3 flutes',
    chipLoad: 'Balanced chip load',
    rigidity: 'Moderate rigidity',
    chipEvacuation: 'Good',
    bestFor: ['Aluminum (finishing)', 'General purpose', 'Balanced roughing/finishing'],
    notes: 'Good compromise between chip evacuation and surface finish. Popular for aluminum when higher feeds are needed but 2-flute is insufficient.'
  },
  {
    fluteCount: '4 flutes',
    chipLoad: 'Moderate chip load',
    rigidity: 'Good rigidity',
    chipEvacuation: 'Moderate',
    bestFor: ['Steel', 'Cast iron', 'General purpose metals', 'Side milling'],
    notes: 'Standard for ferrous materials. More cutting edges means higher feed rates at same chip load, or better finish at same feed. Good strength for side loads.'
  },
  {
    fluteCount: '5-6 flutes',
    chipLoad: 'Lower chip load per tooth',
    rigidity: 'High rigidity',
    chipEvacuation: 'Limited',
    bestFor: ['Stainless steel', 'High-temp alloys', 'Finishing passes', 'Hardened materials'],
    notes: 'More edges in cut = smoother finish and higher feed rates. Reduced chip load per tooth helps with work-hardening materials. Light DOC required.'
  },
  {
    fluteCount: '7+ flutes',
    chipLoad: 'Lowest chip load per tooth',
    rigidity: 'Maximum rigidity',
    chipEvacuation: 'Very limited',
    bestFor: ['Superalloys', 'Hardened steel (45+ HRC)', 'High-speed finishing'],
    notes: 'For difficult materials where tool engagement must be light. Very high feed rates possible with light DOC. Requires rigid setup and proper speeds.'
  }
];

// Flute count decision factors
export const fluteDecisionFactors = {
  moreFlutes: {
    title: 'When to Use MORE Flutes',
    factors: [
      'Harder materials (stainless, hardened steel, superalloys)',
      'Finishing operations requiring smooth surface',
      'Side milling where rigidity matters',
      'Higher feed rates needed (more teeth = higher feed at same chip load)',
      'Materials prone to work hardening (need light chip load)',
      'Rigid setups with good workholding'
    ]
  },
  fewerFlutes: {
    title: 'When to Use FEWER Flutes',
    factors: [
      'Soft, gummy materials (aluminum, plastics, brass)',
      'Slotting operations (full-width cuts)',
      'Deep pockets where chips must escape',
      'Materials producing long, stringy chips',
      'Less rigid setups or long tool stick-out',
      'Roughing operations removing lots of material'
    ]
  },
  tradeoffs: {
    title: 'Key Trade-offs',
    points: [
      'Feed rate = RPM × chip load × number of flutes (more flutes = higher feed)',
      'Chip gullet size decreases with more flutes (less room for chips)',
      'Tool rigidity increases with more flutes (larger core diameter)',
      'Surface finish improves with more flutes (more cutting edges)',
      'Heat per tooth decreases with more flutes (load is distributed)'
    ]
  }
};

// Coating overview - quick comparison guide
export interface CoatingOverview {
  coating: string;
  color: string;
  priceRange: string;
  heatResistance: string;
  primaryUse: string;
  quickTip: string;
}

export const coatingOverview: CoatingOverview[] = [
  {
    coating: 'Uncoated (Bright)',
    color: 'Silver/Gray',
    priceRange: '$',
    heatResistance: 'Low',
    primaryUse: 'Aluminum, non-ferrous',
    quickTip: 'Sharp edge, no BUE. Cheapest option for aluminum.'
  },
  {
    coating: 'TiN',
    color: 'Gold',
    priceRange: '$$',
    heatResistance: 'Medium',
    primaryUse: 'General purpose, mild steel',
    quickTip: 'Classic gold coating. Good all-around performer.'
  },
  {
    coating: 'TiCN',
    color: 'Blue-Gray',
    priceRange: '$$',
    heatResistance: 'Medium',
    primaryUse: 'Stainless, abrasive materials',
    quickTip: 'Harder than TiN but less heat tolerant. Good for abrasive cuts.'
  },
  {
    coating: 'TiAlN',
    color: 'Purple/Violet',
    priceRange: '$$$',
    heatResistance: 'High',
    primaryUse: 'Steels, stainless, cast iron',
    quickTip: 'Excellent heat resistance. Great for dry machining steel.'
  },
  {
    coating: 'AlTiN',
    color: 'Black/Dark',
    priceRange: '$$$$',
    heatResistance: 'Very High',
    primaryUse: 'Hardened steel, titanium, superalloys',
    quickTip: 'Premium coating for difficult materials. Aerospace standard.'
  },
  {
    coating: 'DLC',
    color: 'Black',
    priceRange: '$$$$',
    heatResistance: 'Low',
    primaryUse: 'Aluminum, copper, graphite, composites',
    quickTip: 'Extremely slick. Prevents aluminum from sticking. Premium non-ferrous.'
  },
  {
    coating: 'ZrN',
    color: 'Light Gold',
    priceRange: '$$$',
    heatResistance: 'Medium',
    primaryUse: 'Aluminum, non-ferrous, plastics',
    quickTip: 'Low friction like DLC but cheaper. Great aluminum alternative.'
  }
];

// Coating selection quick guide
export const coatingSelectionGuide = {
  aluminum: {
    material: 'Aluminum',
    recommended: ['Uncoated', 'ZrN', 'DLC'],
    avoid: ['TiAlN', 'AlTiN'],
    reason: 'Aluminum welds to aluminum-containing coatings at high temps. Slick coatings prevent BUE.'
  },
  steel: {
    material: 'Steel (Mild/Alloy)',
    recommended: ['TiN', 'TiAlN', 'TiCN'],
    avoid: ['Uncoated', 'DLC'],
    reason: 'Coatings add heat resistance and hardness needed for ferrous materials.'
  },
  stainless: {
    material: 'Stainless Steel',
    recommended: ['TiAlN', 'AlTiN'],
    avoid: ['Uncoated', 'TiN'],
    reason: 'Work-hardens quickly. Need sharp edge + heat resistance. TiAlN/AlTiN excel here.'
  },
  titanium: {
    material: 'Titanium',
    recommended: ['AlTiN', 'Uncoated'],
    avoid: ['TiN', 'DLC'],
    reason: 'Generates extreme heat. AlTiN handles it. Some prefer uncoated for sharpest edge.'
  },
  hardened: {
    material: 'Hardened Steel (45+ HRC)',
    recommended: ['AlTiN'],
    avoid: ['TiN', 'Uncoated', 'DLC'],
    reason: 'Only premium coatings survive. Consider CBN tooling for best results.'
  },
  plastic: {
    material: 'Plastics',
    recommended: ['Uncoated', 'DLC'],
    avoid: ['TiAlN', 'AlTiN'],
    reason: 'Need sharpest possible edge to cut cleanly without melting. No heat benefits needed.'
  }
};

export interface ToolCoating {
  id: string;
  name: string;
  abbrev: string;
  maxTemp: number; // °F
  hardness: string; // Vickers
  color: string;
  bestFor: string[];
  avoid: string[];
  notes: string;
}

export const toolCoatings: ToolCoating[] = [
  {
    id: 'uncoated',
    name: 'Uncoated Carbide',
    abbrev: 'Uncoated',
    maxTemp: 1200,
    hardness: '1500-1800 HV',
    color: 'Gray',
    bestFor: ['Aluminum', 'Plastics', 'Non-ferrous'],
    avoid: ['Steel', 'Stainless', 'Titanium'],
    notes: 'Sharp edge possible. Best for aluminum to prevent BUE. Economical choice for non-ferrous.'
  },
  {
    id: 'tin',
    name: 'Titanium Nitride',
    abbrev: 'TiN',
    maxTemp: 1100,
    hardness: '2300 HV',
    color: 'Gold',
    bestFor: ['Mild steel', 'Cast iron', 'General purpose'],
    avoid: ['High-temp alloys', 'Hardened steel'],
    notes: 'Good all-around coating. Reduces friction and wear. Classic gold color.'
  },
  {
    id: 'ticn',
    name: 'Titanium Carbonitride',
    abbrev: 'TiCN',
    maxTemp: 750,
    hardness: '3000 HV',
    color: 'Blue-gray',
    bestFor: ['Stainless steel', 'Cast iron', 'High-silicon aluminum'],
    avoid: ['Titanium', 'High-temp applications'],
    notes: 'Harder than TiN but lower heat resistance. Good for abrasive materials.'
  },
  {
    id: 'tialn',
    name: 'Titanium Aluminum Nitride',
    abbrev: 'TiAlN',
    maxTemp: 1470,
    hardness: '3300 HV',
    color: 'Purple/Violet',
    bestFor: ['Stainless steel', 'Hardened steel', 'Cast iron', 'High-temp alloys'],
    avoid: ['Aluminum (may weld)'],
    notes: 'Excellent heat resistance. Forms aluminum oxide layer at high temps. Great for dry machining.'
  },
  {
    id: 'altin',
    name: 'Aluminum Titanium Nitride',
    abbrev: 'AlTiN',
    maxTemp: 1650,
    hardness: '3500 HV',
    color: 'Black/Dark gray',
    bestFor: ['Hardened steel', 'Superalloys', 'Titanium', 'Inconel'],
    avoid: ['Aluminum'],
    notes: 'Highest heat resistance. Best for difficult materials. Premium coating for aerospace.'
  },
  {
    id: 'dlc',
    name: 'Diamond-Like Carbon',
    abbrev: 'DLC',
    maxTemp: 600,
    hardness: '5000+ HV',
    color: 'Black',
    bestFor: ['Aluminum', 'Copper', 'Plastics', 'Graphite', 'Composites'],
    avoid: ['Steel', 'Iron alloys'],
    notes: 'Extremely low friction. Prevents aluminum adhesion. Premium non-ferrous coating.'
  },
  {
    id: 'zrn',
    name: 'Zirconium Nitride',
    abbrev: 'ZrN',
    maxTemp: 1050,
    hardness: '2800 HV',
    color: 'Gold (light)',
    bestFor: ['Aluminum', 'Non-ferrous', 'Plastics'],
    avoid: ['Hardened steel'],
    notes: 'Excellent for aluminum. Very low friction, prevents BUE. Good alternative to uncoated.'
  }
];

export interface EndMillRecommendation {
  materialCategory: string;
  flutes: number;
  fluteNote: string;
  helix: string;
  coating: string[];
  geometry: string;
  notes: string;
}

export const endMillRecommendations: EndMillRecommendation[] = [
  {
    materialCategory: 'aluminum',
    flutes: 2,
    fluteNote: '2-3 flutes',
    helix: '35-45° (high helix)',
    coating: ['Uncoated', 'ZrN', 'DLC'],
    geometry: 'Polished flutes, large chip gullets',
    notes: 'High helix evacuates chips. Uncoated or ZrN prevents built-up edge. Can run aggressive feeds.'
  },
  {
    materialCategory: 'mild-steel',
    flutes: 4,
    fluteNote: '4 flutes',
    helix: '30-35°',
    coating: ['TiN', 'TiAlN', 'TiCN'],
    geometry: 'Standard geometry',
    notes: 'Good balance of chip evacuation and rigidity. TiAlN for higher speeds.'
  },
  {
    materialCategory: 'alloy-steel',
    flutes: 4,
    fluteNote: '4-5 flutes',
    helix: '35-40°',
    coating: ['TiAlN', 'AlTiN'],
    geometry: 'Variable helix reduces chatter',
    notes: 'Higher flute count for rigidity. Variable helix/pitch helps with chatter.'
  },
  {
    materialCategory: 'stainless',
    flutes: 5,
    fluteNote: '5-6 flutes',
    helix: '35-40°',
    coating: ['TiAlN', 'AlTiN', 'TiCN'],
    geometry: 'Sharp edge, positive rake',
    notes: 'Work hardens - keep tool engaged. Higher flute count for surface finish. Flood coolant essential.'
  },
  {
    materialCategory: 'titanium',
    flutes: 5,
    fluteNote: '5-7 flutes',
    helix: '35-45°',
    coating: ['AlTiN'],
    geometry: 'Strong edge, variable helix',
    notes: 'Low speed, high feed strategy. Sharp tools, high-pressure coolant. AlTiN handles heat.'
  },
  {
    materialCategory: 'superalloy',
    flutes: 6,
    fluteNote: '6-8 flutes',
    helix: '35-40°',
    coating: ['AlTiN'],
    geometry: 'Reinforced edge, variable pitch',
    notes: 'Very slow speeds. Light DOC, high flute count for finish. Ceramic inserts for finishing.'
  },
  {
    materialCategory: 'cast-iron',
    flutes: 4,
    fluteNote: '4-6 flutes',
    helix: '30°',
    coating: ['TiN', 'TiCN', 'TiAlN'],
    geometry: 'Strong edge geometry',
    notes: 'Abrasive material. Run DRY - coolant causes thermal shock. Higher flute count OK.'
  },
  {
    materialCategory: 'plastic',
    flutes: 1,
    fluteNote: '1-2 flutes (O-flute)',
    helix: '20-30° (low helix)',
    coating: ['Uncoated', 'DLC'],
    geometry: 'Large gullets, sharp edge, O-flute',
    notes: 'Single flute O-flute best for chip evacuation. Prevents melting. Air blast cooling.'
  },
  {
    materialCategory: 'hardened-steel',
    flutes: 6,
    fluteNote: '6+ flutes',
    helix: '35-40°',
    coating: ['AlTiN'],
    geometry: 'Reinforced cutting edge',
    notes: 'HRC 45+: Consider CBN end mills. Light DOC, high RPM. Mist or air preferred over flood.'
  }
];

export interface DrillRecommendation {
  materialCategory: string;
  pointAngle: number;
  coating: string[];
  type: string;
  notes: string;
}

export const drillRecommendations: DrillRecommendation[] = [
  {
    materialCategory: 'aluminum',
    pointAngle: 118,
    coating: ['Uncoated', 'ZrN'],
    type: 'Split point, polished flutes',
    notes: 'High helix (30-35°) for chip evacuation. Peck drilling helps in deep holes.'
  },
  {
    materialCategory: 'mild-steel',
    pointAngle: 118,
    coating: ['TiN', 'TiAlN'],
    type: 'Split point',
    notes: 'Standard 118° works well. Split point reduces walking. Through-coolant helps.'
  },
  {
    materialCategory: 'stainless',
    pointAngle: 135,
    coating: ['TiAlN', 'AlTiN'],
    type: 'Split point, parabolic flute',
    notes: '135° reduces work hardening at center. Parabolic flutes clear chips. Flood coolant critical.'
  },
  {
    materialCategory: 'titanium',
    pointAngle: 135,
    coating: ['AlTiN'],
    type: 'Heavy-duty web, through-coolant',
    notes: 'Slow speed, consistent feed. Through-coolant essential. No pecking - stay engaged.'
  },
  {
    materialCategory: 'hardened-steel',
    pointAngle: 135,
    coating: ['AlTiN'],
    type: 'Carbide, heavy web',
    notes: 'Solid carbide required for HRC 45+. Reduce speed significantly. Light pecks if needed.'
  },
  {
    materialCategory: 'cast-iron',
    pointAngle: 118,
    coating: ['TiN', 'TiCN'],
    type: 'Standard or split point',
    notes: 'Run DRY. Cast iron is abrasive but chips clear easily. No coolant!'
  },
  {
    materialCategory: 'plastic',
    pointAngle: 90,
    coating: ['Uncoated'],
    type: 'High helix, slow spiral',
    notes: '60-90° point prevents grabbing. High RPM, moderate feed. Air blast for chip clearing.'
  }
];

export interface InsertRecommendation {
  materialCategory: string;
  grade: string;
  geometry: string;
  chipbreaker: string;
  coating: string[];
  notes: string;
}

export const insertRecommendations: InsertRecommendation[] = [
  {
    materialCategory: 'aluminum',
    grade: 'Uncoated carbide or PCD',
    geometry: 'Positive rake (C, D shape)',
    chipbreaker: 'Sharp edge, polished',
    coating: ['Uncoated', 'DLC'],
    notes: 'PCD for high volume/abrasive aluminum. Positive geometry prevents BUE. High speeds OK.'
  },
  {
    materialCategory: 'mild-steel',
    grade: 'P10-P30 carbide',
    geometry: 'Neutral to positive',
    chipbreaker: 'Medium chipbreaker',
    coating: ['TiN', 'TiCN', 'TiAlN'],
    notes: 'Wide speed range. M or F chipbreaker depending on DOC. Coated inserts last longer.'
  },
  {
    materialCategory: 'stainless',
    grade: 'M15-M30 carbide',
    geometry: 'Positive rake, sharp edge',
    chipbreaker: 'Light chipbreaker (F/MF)',
    coating: ['TiAlN', 'AlTiN'],
    notes: 'Work hardening requires positive geometry. Keep chip flowing. Never dwell!'
  },
  {
    materialCategory: 'titanium',
    grade: 'Uncoated carbide or ceramic',
    geometry: 'Positive, round insert preferred',
    chipbreaker: 'Light chipbreaker',
    coating: ['Uncoated', 'AlTiN'],
    notes: 'Round inserts (RCMT) spread heat. Uncoated often preferred. High-pressure coolant essential.'
  },
  {
    materialCategory: 'superalloy',
    grade: 'Ceramic (SiAlON, Whisker)',
    geometry: 'Round insert, negative rake',
    chipbreaker: 'Wiper for finish',
    coating: ['None (ceramic)'],
    notes: 'Ceramic for finishing at high speed. Carbide for roughing at low speed. Rigid setup critical.'
  },
  {
    materialCategory: 'hardened-steel',
    grade: 'CBN or ceramic',
    geometry: 'Negative rake, strong edge',
    chipbreaker: 'Chamfered/honed edge',
    coating: ['None'],
    notes: 'CBN for continuous cuts. Ceramic for interrupted. Can often replace grinding.'
  }
];

// Helper to get recommendations by material
export const getToolingByMaterial = (materialId: string) => {
  const categoryMap: Record<string, string> = {
    'aluminum-6061': 'aluminum',
    'aluminum-7075': 'aluminum',
    'aluminum-2024': 'aluminum',
    'aluminum-5052': 'aluminum',
    'steel-12l14': 'mild-steel',
    'steel-1018': 'mild-steel',
    'steel-4140-ann': 'alloy-steel',
    'steel-4140-ht': 'hardened-steel',
    'tool-a2': 'alloy-steel',
    'tool-d2': 'alloy-steel',
    'tool-o1': 'alloy-steel',
    'tool-h13': 'alloy-steel',
    'tool-s7': 'alloy-steel',
    'ss-303': 'stainless',
    'ss-304': 'stainless',
    'ss-17-4': 'stainless',
    'ti-grade2': 'titanium',
    'ti-grade5': 'titanium',
    'inconel-718': 'superalloy',
    'monel-400': 'superalloy',
    'monel-k500': 'superalloy',
    'hastelloy-c276': 'superalloy',
    'waspaloy': 'superalloy',
    'stellite-6': 'superalloy',
    'cast-iron': 'cast-iron',
    'ductile-iron': 'cast-iron',
    'brass': 'aluminum', // Similar tooling to aluminum
    'copper': 'aluminum',
    'delrin': 'plastic',
    'uhmw': 'plastic',
    'acrylic': 'plastic'
  };

  const category = categoryMap[materialId] || 'mild-steel';

  return {
    category,
    endMill: endMillRecommendations.find(r => r.materialCategory === category),
    drill: drillRecommendations.find(r => r.materialCategory === category),
    insert: insertRecommendations.find(r => r.materialCategory === category)
  };
};

// Get coating details
export const getCoatingById = (id: string): ToolCoating | undefined => {
  return toolCoatings.find(c => c.id === id || c.abbrev.toLowerCase() === id.toLowerCase());
};
