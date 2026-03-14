// Icon generation script for C&B Machinist PWA
// Run with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// We'll create simple SVG-based icons and convert them to data URIs
// For production, you'd use a proper image library like sharp or canvas

const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

const iconSvg = (size) => {
  const fontSize = Math.floor(size * 0.35);
  const gearSize = size * 0.15;
  const gearY = size * 0.25;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0B0D11"/>
  <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" rx="${size * 0.1}" fill="#13171E" stroke="#2A3140" stroke-width="${Math.max(1, size * 0.01)}"/>
  <text x="${size * 0.5}" y="${size * 0.58}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#F97316" text-anchor="middle">C&B</text>
  <circle cx="${size * 0.5}" cy="${gearY}" r="${gearSize}" fill="none" stroke="#F97316" stroke-width="${Math.max(1, size * 0.02)}"/>
  <g fill="#F97316">
    ${Array.from({length: 8}, (_, i) => {
      const angle = (i * 45) * Math.PI / 180;
      const x1 = size * 0.5 + Math.cos(angle) * gearSize * 0.7;
      const y1 = gearY + Math.sin(angle) * gearSize * 0.7;
      const x2 = size * 0.5 + Math.cos(angle) * gearSize * 1.3;
      const y2 = gearY + Math.sin(angle) * gearSize * 1.3;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#F97316" stroke-width="${Math.max(1, size * 0.03)}" stroke-linecap="round"/>`;
    }).join('\n    ')}
  </g>
</svg>`;
};

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons (these will work for development)
sizes.forEach(size => {
  const svg = iconSvg(size);
  const filename = path.join(iconsDir, `icon-${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Generated: icon-${size}.svg`);
});

console.log('\nSVG icons generated successfully!');
console.log('\nFor production PNG icons, convert these SVGs using:');
console.log('- Online: https://cloudconvert.com/svg-to-png');
console.log('- CLI: inkscape -w SIZE -h SIZE icon.svg -o icon.png');
console.log('- Node.js: Use sharp or canvas library');
