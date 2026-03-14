export interface Material {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  roughSFM: number;
  finishSFM: number;
  hssSFM: number;
  chipLoad: number; // per tooth at 0.5" cutter
  notes: string;
}

export const materials: Material[] = [
  {
    id: 'aluminum-6061',
    name: '6061/7075 Aluminum',
    difficulty: 'Easy',
    roughSFM: 800,
    finishSFM: 1000,
    hssSFM: 300,
    chipLoad: 0.004,
    notes: 'Use 2-3 flute, high helix. Watch for BUE at low speeds. Flood coolant recommended.'
  },
  {
    id: 'steel-12l14',
    name: '12L14 Steel (Free-machining)',
    difficulty: 'Easy',
    roughSFM: 400,
    finishSFM: 500,
    hssSFM: 100,
    chipLoad: 0.003,
    notes: 'Lead-free machining steel. Excellent chip breaking. Great for screw machine parts.'
  },
  {
    id: 'steel-1018',
    name: '1018 Mild Steel',
    difficulty: 'Easy',
    roughSFM: 350,
    finishSFM: 450,
    hssSFM: 90,
    chipLoad: 0.003,
    notes: 'Low carbon, good machinability. May produce stringy chips. Use chip breakers.'
  },
  {
    id: 'steel-4140-ann',
    name: '4140 Alloy (Annealed)',
    difficulty: 'Medium',
    roughSFM: 300,
    finishSFM: 400,
    hssSFM: 70,
    chipLoad: 0.0025,
    notes: 'Chrome-moly alloy. Harder than mild steel. Requires rigid setup.'
  },
  {
    id: 'steel-4140-ht',
    name: '4140 (HRC 28-32)',
    difficulty: 'Hard',
    roughSFM: 200,
    finishSFM: 275,
    hssSFM: 40,
    chipLoad: 0.002,
    notes: 'Heat-treated. Use coated carbide. Light DOC, higher RPM strategy works well.'
  },
  {
    id: 'ss-303',
    name: '303 Stainless',
    difficulty: 'Medium',
    roughSFM: 275,
    finishSFM: 350,
    hssSFM: 65,
    chipLoad: 0.0025,
    notes: 'Free-machining SS. Better than 304 but still work hardens. Keep tool engaged.'
  },
  {
    id: 'ss-304',
    name: '304/316 Stainless',
    difficulty: 'Hard',
    roughSFM: 200,
    finishSFM: 275,
    hssSFM: 50,
    chipLoad: 0.002,
    notes: 'Work hardens rapidly! Never dwell. Keep constant chip load. Flood coolant critical.'
  },
  {
    id: 'ss-17-4',
    name: '17-4 PH Stainless',
    difficulty: 'Hard',
    roughSFM: 175,
    finishSFM: 225,
    hssSFM: 40,
    chipLoad: 0.002,
    notes: 'Precipitation hardening SS. Very abrasive. Use AlTiN coated tools.'
  },
  {
    id: 'ti-grade2',
    name: 'Ti Grade 2 (CP)',
    difficulty: 'Hard',
    roughSFM: 150,
    finishSFM: 200,
    hssSFM: 35,
    chipLoad: 0.002,
    notes: 'Commercially pure Ti. Gummy, work hardens. High pressure coolant helps.'
  },
  {
    id: 'ti-grade5',
    name: 'Ti Grade 5 (6Al-4V)',
    difficulty: 'Hard',
    roughSFM: 120,
    finishSFM: 175,
    hssSFM: 25,
    chipLoad: 0.0015,
    notes: 'Ti-6-4 alloy. Very low thermal conductivity. Light cuts, sharp tools, flood coolant.'
  },
  {
    id: 'inconel-718',
    name: 'Inconel 718',
    difficulty: 'Hard',
    roughSFM: 75,
    finishSFM: 100,
    hssSFM: 15,
    chipLoad: 0.001,
    notes: 'Nickel superalloy. Extreme heat resistance. Ceramic/CBN inserts for finishing. Very slow.'
  },
  {
    id: 'cast-iron',
    name: 'Cast Iron (Gray)',
    difficulty: 'Easy',
    roughSFM: 350,
    finishSFM: 450,
    hssSFM: 80,
    chipLoad: 0.004,
    notes: 'Abrasive graphite flakes. DRY machining only - coolant causes thermal shock cracks.'
  },
  {
    id: 'brass',
    name: 'Brass / Bronze',
    difficulty: 'Easy',
    roughSFM: 600,
    finishSFM: 800,
    hssSFM: 200,
    chipLoad: 0.004,
    notes: 'Free-cutting. Use 0° rake tools to prevent grabbing. Can run dry or with mist.'
  },
  {
    id: 'delrin',
    name: 'Delrin / Acetal',
    difficulty: 'Easy',
    roughSFM: 500,
    finishSFM: 700,
    hssSFM: 250,
    chipLoad: 0.005,
    notes: 'Engineering plastic. Sharp tools, high speeds. Air blast for chip clearing.'
  },
  {
    id: 'uhmw',
    name: 'UHMW Polyethylene',
    difficulty: 'Easy',
    roughSFM: 600,
    finishSFM: 800,
    hssSFM: 300,
    chipLoad: 0.006,
    notes: 'Very gummy plastic. Extremely sharp tools. May need climb milling for finish.'
  },
  {
    id: 'acrylic',
    name: 'Acrylic / PMMA',
    difficulty: 'Easy',
    roughSFM: 400,
    finishSFM: 500,
    hssSFM: 150,
    chipLoad: 0.004,
    notes: 'Brittle - chips easily. Single flute O-flute end mills. Air cool to prevent melting.'
  },
  {
    id: 'copper',
    name: 'Copper (Pure)',
    difficulty: 'Medium',
    roughSFM: 400,
    finishSFM: 500,
    hssSFM: 100,
    chipLoad: 0.003,
    notes: 'Very gummy, smears. Positive rake geometry helps. Flood coolant recommended.'
  }
];

export const getMaterialById = (id: string): Material | undefined => {
  return materials.find(m => m.id === id);
};
