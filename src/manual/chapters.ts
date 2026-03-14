export interface Chapter {
  id: string;
  title: string;
  icon: string;
  content: ChapterContent[];
}

export interface ChapterContent {
  type: 'heading' | 'paragraph' | 'formula' | 'note' | 'warning' | 'code' | 'list';
  text?: string;
  items?: string[];
  title?: string;
}

export const chapters: Chapter[] = [
  {
    id: 'anatomy',
    title: 'Machine Anatomy & Coordinate Systems',
    icon: '🔧',
    content: [
      { type: 'heading', text: 'Cartesian Coordinate System' },
      { type: 'paragraph', text: 'CNC machines use a 3D Cartesian coordinate system with X, Y, and Z axes. Understanding axis orientation is critical for programming and setup.' },
      { type: 'heading', text: 'Mill Axis Convention' },
      { type: 'list', items: [
        'X-Axis: Left/Right (table movement)',
        'Y-Axis: Front/Back (saddle movement)',
        'Z-Axis: Up/Down (spindle movement)',
        'Positive direction: Tool moves away from workpiece'
      ]},
      { type: 'heading', text: 'Lathe Axis Convention' },
      { type: 'list', items: [
        'X-Axis: Cross slide (diameter direction)',
        'Z-Axis: Carriage (along spindle axis)',
        'X is typically programmed in diameter (not radius)',
        'Z negative moves toward chuck, positive away'
      ]},
      { type: 'note', title: 'Work Offsets', text: 'G54-G59 store the relationship between machine home and your part zero. Always verify offsets before running a program!' },
      { type: 'heading', text: 'Machine Zero vs Work Zero' },
      { type: 'paragraph', text: 'Machine zero (G53) is a fixed point set by the manufacturer. Work zero (G54, etc.) is the part datum you establish during setup. Never confuse these — G53 movements go to machine coordinates regardless of active work offset.' },
      { type: 'warning', title: 'Safety', text: 'Always verify G28 home position before running. An incorrect home position stored in parameters can cause crashes.' }
    ]
  },
  {
    id: 'tooling',
    title: 'Tooling: Inserts, Coatings & End Mills',
    icon: '🔨',
    content: [
      { type: 'heading', text: 'Carbide Insert Grades' },
      { type: 'list', items: [
        'C1-C4: Uncoated carbide for non-ferrous materials',
        'C5-C8: Coated grades for steel and cast iron',
        'P-grade (Blue): Steel',
        'M-grade (Yellow): Stainless steel',
        'K-grade (Red): Cast iron',
        'N-grade (Green): Non-ferrous (aluminum)',
        'S-grade (Brown): Superalloys (Inconel, Titanium)'
      ]},
      { type: 'heading', text: 'Common Coatings' },
      { type: 'list', items: [
        'TiN (Gold): General purpose, good for steel',
        'TiCN (Blue-gray): Harder than TiN, good for abrasive materials',
        'TiAlN (Purple/Black): High heat resistance, great for high-speed machining',
        'AlTiN: Maximum heat resistance, excellent for hardened steel and dry machining',
        'Diamond/DLC: Non-ferrous only, excellent for aluminum and composites'
      ]},
      { type: 'note', title: 'Coating Selection', text: 'Match coating to material: AlTiN for steel/stainless, DLC or uncoated for aluminum (coated tools cause aluminum to stick).' },
      { type: 'heading', text: 'End Mill Types' },
      { type: 'list', items: [
        '2-Flute: Deep slotting, soft materials, better chip evacuation',
        '3-Flute: Balance of chip evacuation and finish (aluminum)',
        '4-Flute: General purpose, better finish, harder materials',
        '5+ Flute: High-feed finishing, hardened materials',
        'Ball Nose: 3D contours and rounded features',
        'Bull Nose (Corner Radius): Stronger corner, longer tool life'
      ]},
      { type: 'warning', title: 'Tool Stickout', text: 'Keep stickout under 3× diameter when possible. Chatter increases exponentially with overhang length.' }
    ]
  },
  {
    id: 'speeds-feeds',
    title: 'Speeds & Feeds Formulas',
    icon: '📊',
    content: [
      { type: 'heading', text: 'RPM Calculation' },
      { type: 'paragraph', text: 'Convert Surface Feet per Minute (SFM) to spindle RPM based on cutter diameter.' },
      { type: 'formula', text: 'RPM = (SFM × 3.82) ÷ Diameter' },
      { type: 'paragraph', text: 'Example: 500 SFM with 0.5" end mill = (500 × 3.82) ÷ 0.5 = 3820 RPM' },
      { type: 'heading', text: 'Feed Rate (IPM)' },
      { type: 'formula', text: 'Feed IPM = RPM × Chip Load × Number of Flutes' },
      { type: 'paragraph', text: 'Example: 3820 RPM × 0.003" chip load × 4 flutes = 45.8 IPM' },
      { type: 'heading', text: 'SFM from RPM' },
      { type: 'formula', text: 'SFM = (RPM × Diameter) ÷ 3.82' },
      { type: 'heading', text: 'Material Removal Rate (MRR)' },
      { type: 'formula', text: 'MRR = WOC × DOC × Feed IPM' },
      { type: 'paragraph', text: 'MRR is in cubic inches per minute. Higher MRR = more material removed = faster cycle time.' },
      { type: 'heading', text: 'Tapping Feed Rate' },
      { type: 'formula', text: 'Tap Feed (IPM) = RPM ÷ TPI' },
      { type: 'paragraph', text: 'For rigid tapping, the feed must match thread pitch exactly or you\'ll strip threads.' },
      { type: 'note', title: 'Pro Tip', text: 'Start conservative, increase speed/feed gradually. Listen for chatter and watch chip formation.' }
    ]
  },
  {
    id: 'milling-ops',
    title: 'Milling Operations',
    icon: '⚙️',
    content: [
      { type: 'heading', text: 'Climb vs Conventional Milling' },
      { type: 'paragraph', text: 'Climb milling: Cutter rotates with feed direction. Better finish, less heat in tool, but requires rigid setup with minimal backlash.' },
      { type: 'paragraph', text: 'Conventional milling: Cutter rotates against feed direction. More forgiving for older machines, but generates more heat and poorer finish.' },
      { type: 'note', title: 'When to Use Each', text: 'Use climb milling on CNC machines for better finish. Use conventional on manual mills or when fixturing is weak.' },
      { type: 'heading', text: 'Helical Entry' },
      { type: 'paragraph', text: 'Instead of plunging straight down (stressful for tool), ramp into the cut at a 2-3° angle while circling. Reduces tool shock and improves tool life.' },
      { type: 'heading', text: 'Depth of Cut Strategy' },
      { type: 'list', items: [
        'Roughing: Max DOC machine can handle (40-100% tool diameter)',
        'Semi-finish: 10-15% tool diameter',
        'Finish: 2-5% tool diameter, increased speed'
      ]},
      { type: 'heading', text: 'High-Speed Machining (HSM)' },
      { type: 'paragraph', text: 'HSM uses light depths of cut with high speeds and feeds. Key principles: constant tool engagement, avoid sharp corners (use arcs), maintain chip thinning calculations.' },
      { type: 'warning', title: 'Chip Thinning', text: 'At low radial engagement (<50%), effective chip thickness decreases. Increase feed rate to compensate or you\'ll rub instead of cut.' }
    ]
  },
  {
    id: 'canned-cycles',
    title: 'Milling Canned Cycles',
    icon: '🔄',
    content: [
      { type: 'heading', text: 'G81 - Standard Drill Cycle' },
      { type: 'code', text: 'G81 X___ Y___ Z___ R___ F___' },
      { type: 'paragraph', text: 'Rapid to XY, rapid to R plane, feed to Z, rapid out. Use for shallow holes.' },
      { type: 'heading', text: 'G82 - Drill with Dwell' },
      { type: 'code', text: 'G82 X___ Y___ Z___ R___ P___ F___' },
      { type: 'paragraph', text: 'Same as G81 but pauses at bottom (P = dwell in seconds). Good for flat-bottom holes.' },
      { type: 'heading', text: 'G83 - Deep Hole Peck Drill' },
      { type: 'code', text: 'G83 X___ Y___ Z___ R___ Q___ F___' },
      { type: 'paragraph', text: 'Pecks incrementally (Q = peck depth), fully retracts between pecks to clear chips. Use for holes deeper than 3× drill diameter.' },
      { type: 'heading', text: 'G84 - Tapping Cycle' },
      { type: 'code', text: 'G84 X___ Y___ Z___ R___ F___' },
      { type: 'paragraph', text: 'Rigid tapping. Feed MUST equal pitch (F = RPM/TPI). Spindle reverses at bottom automatically.' },
      { type: 'heading', text: 'G85 - Bore (Feed Out)' },
      { type: 'code', text: 'G85 X___ Y___ Z___ R___ F___' },
      { type: 'paragraph', text: 'Feeds to depth, feeds back out. Good surface finish on the bore.' },
      { type: 'heading', text: 'G86 - Bore (Spindle Stop)' },
      { type: 'code', text: 'G86 X___ Y___ Z___ R___ F___' },
      { type: 'paragraph', text: 'Feeds to depth, stops spindle, rapid out. May leave witness mark from tool retract.' },
      { type: 'note', title: 'R Plane', text: 'G98 returns to initial Z, G99 returns to R plane. Use G98 when obstacles are between holes.' }
    ]
  },
  {
    id: 'lathe-ops',
    title: 'Lathe Operations & G71 Cycle',
    icon: '🔧',
    content: [
      { type: 'heading', text: 'Constant Surface Speed (CSS)' },
      { type: 'code', text: 'G50 S3000  (Set max RPM limit)\nG96 S200 M03  (CSS at 200 SFM)' },
      { type: 'paragraph', text: 'CSS automatically adjusts RPM as diameter changes to maintain constant SFM. Always set G50 max RPM first to prevent spindle overspeeding on small diameters!' },
      { type: 'heading', text: 'G71 Rough Turning Cycle' },
      { type: 'code', text: 'G71 U___ R___\nG71 P___ Q___ U___ W___ F___' },
      { type: 'list', items: [
        'First line: U = depth per pass, R = retract amount',
        'Second line: P = start block, Q = end block',
        'U = X finish allowance (diameter)',
        'W = Z finish allowance',
        'F = roughing feedrate'
      ]},
      { type: 'paragraph', text: 'The control reads the finish profile (blocks P to Q), then automatically generates roughing passes. Use G70 after for the finish pass.' },
      { type: 'heading', text: 'G70 Finish Cycle' },
      { type: 'code', text: 'G70 P___ Q___' },
      { type: 'paragraph', text: 'Traces the finish profile defined in blocks P to Q. Run after G71/G72 roughing.' },
      { type: 'warning', title: 'Feed Modes', text: 'G99 = Feed per revolution (IPR) - standard for lathe. G98 = Feed per minute (IPM). Always verify which mode is active!' }
    ]
  },
  {
    id: 'threading',
    title: 'Lathe Threading & G76',
    icon: '🔩',
    content: [
      { type: 'heading', text: 'Thread Depth Formula' },
      { type: 'formula', text: 'Thread Depth = 0.6495 × Pitch' },
      { type: 'paragraph', text: 'For UN 60° threads. Example: 1/4-20 (pitch = 0.050") → depth = 0.0325"' },
      { type: 'heading', text: 'Threading Feed Rate' },
      { type: 'formula', text: 'Threading IPM = RPM ÷ TPI' },
      { type: 'heading', text: 'G76 Threading Cycle (Haas)' },
      { type: 'code', text: 'G76 X___ Z___ K___ D___ F___ A___' },
      { type: 'list', items: [
        'X = Minor diameter (thread root)',
        'Z = End of thread (include chamfer)',
        'K = Thread height (single side, radius)',
        'D = First pass depth (in ten-thousandths)',
        'F = Thread pitch (1/TPI)',
        'A = Tool angle (29 for infeed angle)'
      ]},
      { type: 'heading', text: 'G76 Threading Cycle (Fanuc)' },
      { type: 'code', text: 'G76 P___ Q___ R___\nG76 X___ Z___ P___ Q___ F___' },
      { type: 'list', items: [
        'First line: P = finish passes + chamfer + angle',
        'Q = minimum cut depth, R = finish allowance',
        'Second line: X = minor dia, Z = end position',
        'P = thread height (radius), Q = first cut depth',
        'F = pitch'
      ]},
      { type: 'note', title: 'Threading Tips', text: 'Use 29° infeed angle for cleaner cutting. Run 200-300 RPM slower than max. Spring passes (full depth, no cut) improve finish.' }
    ]
  },
  {
    id: 'setup-safety',
    title: 'Program Setup, Safety & Inspection',
    icon: '✅',
    content: [
      { type: 'heading', text: 'Program Safety Block' },
      { type: 'code', text: 'O0001 (PROGRAM NAME)\nG20 G40 G49 G80 G90 (Safety line)\nT01 M06 (Tool change)\nG54 (Work offset)\nS___ M03 (Spindle on)\nG43 H01 Z1.0 (Tool length comp)' },
      { type: 'heading', text: 'Pre-Run Checklist' },
      { type: 'list', items: [
        '☐ Verify work offset (G54, etc.) is set correctly',
        '☐ Check all tool length offsets (H values)',
        '☐ Verify tool diameter offsets if using cutter comp',
        '☐ Confirm G28 home position is safe',
        '☐ Check spindle and feed overrides at 100%',
        '☐ Single block through first run',
        '☐ Keep hand on feed hold'
      ]},
      { type: 'heading', text: 'Inspection Points' },
      { type: 'list', items: [
        'First article: Check all critical dimensions',
        'Use calibrated instruments (micrometers, calipers)',
        'For threads: Use thread gauges (go/no-go)',
        'Three-wire measurement for precise pitch diameter',
        'Surface finish: Use profilometer or comparator'
      ]},
      { type: 'warning', title: 'Critical', text: 'Never reach into the machine while spindle is rotating. Always wait for full stop before measuring or adjusting.' },
      { type: 'heading', text: 'Common Error Codes' },
      { type: 'list', items: [
        'Alarm 10: Spindle fault - check drive and belt',
        'Alarm 15: Servo error - axis binding or encoder issue',
        'Alarm 91: Home position invalid - re-home machine',
        'Overtravel: Soft limit hit - check program coordinates'
      ]}
    ]
  }
];
