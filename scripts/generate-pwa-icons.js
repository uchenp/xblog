const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const config = {
  gradient: { from: '#3B82F6', to: '#9333EA' },
  text: { char: 'X', font: 'Arial', color: '#FFFFFF' },
  sizes: [192, 512],
};

function buildIconSvg(size) {
  const fontSize = Math.floor(size * 0.5);
  const radius = size === 512 ? 96 : 32;
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${config.gradient.from}"/>
        <stop offset="100%" stop-color="${config.gradient.to}"/>
      </linearGradient>
      <clipPath id="round">
        <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}"/>
      </clipPath>
    </defs>
    <g clip-path="url(#round)">
      <rect width="${size}" height="${size}" fill="url(#grad)"/>
      <text x="50%" y="50%"
        font-family="${config.text.font}"
        font-size="${fontSize}"
        font-weight="bold"
        fill="${config.text.color}"
        text-anchor="middle"
        dominant-baseline="central">${config.text.char}</text>
    </g>
  </svg>`;
}

async function generateIcon(size) {
  const svg = buildIconSvg(size);
  const outputPath = path.join(__dirname, '..', 'public', `icon-${size}x${size}.png`);
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  const { size: bytes } = fs.statSync(outputPath);
  console.log(`✅ icon-${size}x${size}.png  (${bytes} bytes)`);
}

async function updateManifest() {
  const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    manifest.icons = [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ];
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    console.log('✅ manifest.json 已更新');
  } catch (error) {
    console.error('❌ manifest.json 更新失败:', error);
  }
}

(async () => {
  for (const size of config.sizes) await generateIcon(size);
  await updateManifest();
})();
