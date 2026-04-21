const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const MASTER_ICON = path.resolve(PUBLIC_DIR, 'icon-512.png');

const SIZES = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

async function generateIcons() {
  if (!fs.existsSync(MASTER_ICON)) {
    console.error('Master icon (icon-512.png) not found in public directory.');
    process.exit(1);
  }

  console.log('Generating PWA icons...');

  for (const { size, name } of SIZES) {
    await sharp(MASTER_ICON)
      .resize(size, size)
      .toFile(path.resolve(PUBLIC_DIR, name));
    console.log(`Generated: ${name}`);
  }

  console.log('Icon generation complete!');
}

generateIcons().catch(console.error);
