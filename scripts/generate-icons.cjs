const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

const createIconSvg = (size) => {
  const gearRadius = size * 0.094;
  const gearY = size * 0.25;
  const gearStroke = Math.max(2, size * 0.02);
  const toothLength = gearRadius * 0.5;
  const fontSize = size * 0.25;
  const subtitleSize = size * 0.082;

  // Generate gear teeth
  const teeth = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45) * Math.PI / 180;
    const innerR = gearRadius * 0.9;
    const outerR = gearRadius + toothLength;
    const x1 = size / 2 + Math.cos(angle) * innerR;
    const y1 = gearY + Math.sin(angle) * innerR;
    const x2 = size / 2 + Math.cos(angle) * outerR;
    const y2 = gearY + Math.sin(angle) * outerR;
    teeth.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#F97316" stroke-width="${gearStroke}" stroke-linecap="round"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0B0D11"/>
  <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" rx="${size * 0.1}" fill="#13171E" stroke="#2A3140" stroke-width="${Math.max(1, size * 0.008)}"/>
  <circle cx="${size / 2}" cy="${gearY}" r="${gearRadius}" fill="none" stroke="#F97316" stroke-width="${gearStroke}"/>
  ${teeth.join('\n  ')}
  <circle cx="${size / 2}" cy="${gearY}" r="${gearRadius * 0.4}" fill="#F97316"/>
  <text x="${size / 2}" y="${size * 0.625}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#F97316" text-anchor="middle">C&amp;B</text>
  ${size >= 128 ? `<text x="${size / 2}" y="${size * 0.78}" font-family="Arial, Helvetica, sans-serif" font-size="${subtitleSize}" fill="#64748B" text-anchor="middle">MACHINIST</text>` : ''}
</svg>`;
};

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Create icons directory
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate all icon sizes as SVG
sizes.forEach(size => {
  const svg = createIconSvg(size);
  const svgPath = path.join(iconsDir, `icon-${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Generated: icon-${size}.svg`);
});

// Create favicon.svg
const faviconSvg = createIconSvg(32);
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSvg);
console.log('Generated: favicon.svg');

console.log('\n✓ All icons generated successfully!\n');
console.log('Note: For production PNG icons, convert SVGs using:');
console.log('  - Inkscape: inkscape -w 192 icon-192.svg -o icon-192.png');
console.log('  - ImageMagick: convert -background none icon-192.svg icon-192.png');
console.log('  - Online: cloudconvert.com or svgtopng.com');
