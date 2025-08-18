import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create PWA icons directory
const pwaDir = path.join(__dirname, '../public/images/pwa');
if (!fs.existsSync(pwaDir)) {
  fs.mkdirSync(pwaDir, { recursive: true });
}

// Icon sizes for PWA
const iconSizes = [
  16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 384, 512
];

// Generate SVG icon
function generateSVG(size) {
  const center = size / 2;
  const radius = size * 0.35;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
    <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#3b82f6" stroke-width="${size * 0.08}"/>
    <circle cx="${center}" cy="${center}" r="${radius * 0.6}" fill="none" stroke="#60a5fa" stroke-width="${size * 0.06}"/>
    <circle cx="${center}" cy="${center}" r="${radius * 0.3}" fill="#93c5fd"/>
    <text x="${center}" y="${center + size * 0.15}" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="${size * 0.2}" font-weight="bold">K53</text>
  </svg>`;
}

// Generate shortcut icons
function generateShortcutIcon(type, size = 96) {
  const center = size / 2;
  const radius = size * 0.3;
  
  let icon = '';
  switch (type) {
    case 'practice':
      icon = `<path d="M${center - radius * 0.5} ${center - radius} L${center + radius * 0.5} ${center} L${center - radius * 0.5} ${center + radius} Z" fill="#10b981"/>`;
      break;
    case 'progress':
      icon = `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#f59e0b" stroke-width="${size * 0.08}"/>
              <path d="M${center - radius * 0.7} ${center + radius * 0.7} A${radius} ${radius} 0 0 1 ${center + radius * 0.7} ${center + radius * 0.7}" fill="none" stroke="#f59e0b" stroke-width="${size * 0.08}"/>`;
      break;
    case 'achievements':
      icon = `<path d="M${center} ${center - radius} L${center + radius * 0.3} ${center - radius * 0.3} L${center + radius} ${center} L${center + radius * 0.3} ${center + radius * 0.3} L${center} ${center + radius} L${center - radius * 0.3} ${center + radius * 0.3} L${center - radius} ${center} L${center - radius * 0.3} ${center - radius * 0.3} Z" fill="#8b5cf6"/>`;
      break;
  }
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#grad-${type})" rx="${size * 0.1}"/>
    ${icon}
  </svg>`;
}

// Generate all icons
console.log('Generating PWA icons...');

// Generate main icons
iconSizes.forEach(size => {
  const svg = generateSVG(size);
  const filePath = path.join(pwaDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated icon-${size}x${size}.svg`);
});

// Generate shortcut icons
['practice', 'progress', 'achievements'].forEach(type => {
  const svg = generateShortcutIcon(type);
  const filePath = path.join(pwaDir, `shortcut-${type}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated shortcut-${type}.svg`);
});

// Generate placeholder screenshots
const screenshotSVG = `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-screenshot" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#grad-screenshot)"/>
  <text x="640" y="360" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="48" font-weight="bold">SuperK53 Dashboard</text>
  <text x="640" y="420" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="24">K53 Learner's License Practice Platform</text>
</svg>`;

fs.writeFileSync(path.join(pwaDir, 'screenshot-wide.svg'), screenshotSVG);
console.log('Generated screenshot-wide.svg');

const mobileScreenshotSVG = `<svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="750" height="1334" fill="url(#grad-mobile)"/>
  <text x="375" y="667" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="32" font-weight="bold">SuperK53 Mobile</text>
  <text x="375" y="720" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="18">K53 Practice on Mobile</text>
</svg>`;

fs.writeFileSync(path.join(pwaDir, 'screenshot-narrow.svg'), mobileScreenshotSVG);
console.log('Generated screenshot-narrow.svg');

console.log('PWA icons generation complete!');
console.log('Note: These are SVG placeholders. For production, convert to PNG with proper dimensions.'); 