/**
 * Lit les dimensions réelles de chaque image WebP et les injecte
 * dans les attributs width/height de chaque <img> des fichiers .astro.
 * Lancé automatiquement en prebuild via package.json.
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const decode = str => decodeURIComponent(str);

async function getDimensions(filePath) {
  try {
    const { width, height } = await sharp(filePath).metadata();
    return { width, height };
  } catch {
    return null;
  }
}

const files = readdirSync('src/pages')
  .filter(f => f.endsWith('.astro'))
  .map(f => join('src/pages', f));

let totalImgs = 0;
let totalFiles = 0;

for (const file of files) {
  const content = readFileSync(file, 'utf8');

  // Collecter tous les src qui ont besoin de dimensions
  const srcSet = new Set();
  const imgRe = /<img\s([^>]+?)(\s*\/?>)/gs;
  let m;
  while ((m = imgRe.exec(content)) !== null) {
    const attrs = m[1];
    if (/\bwidth=/.test(attrs) && /\bheight=/.test(attrs)) continue;
    const srcM = attrs.match(/src=["']([^"']+)["']/);
    if (!srcM) continue;
    const src = srcM[1];
    if (!src.startsWith('/images/')) continue;
    const fp = join('public', decode(src));
    if (existsSync(fp)) srcSet.add(fp);
  }

  if (srcSet.size === 0) continue;

  // Charger toutes les dimensions en parallèle
  const dimMap = {};
  await Promise.all([...srcSet].map(async fp => {
    const dims = await getDimensions(fp);
    if (dims) dimMap[fp] = dims;
  }));

  // Remplacer les img tags
  let modified = false;
  const newContent = content.replace(/<img\s([^>]+?)(\s*\/?>)/gs, (match, attrs, close) => {
    if (/\bwidth=/.test(attrs) && /\bheight=/.test(attrs)) return match;
    const srcM = attrs.match(/src=["']([^"']+)["']/);
    if (!srcM) return match;
    const src = srcM[1];
    if (!src.startsWith('/images/')) return match;
    const fp = join('public', decode(src));
    const dims = dimMap[fp];
    if (!dims) return match;

    modified = true;
    totalImgs++;
    return `<img ${attrs.trimEnd()} width="${dims.width}" height="${dims.height}" />`;
  });

  if (modified) {
    writeFileSync(file, newContent, 'utf8');
    console.log(`✅ ${file.split('\\').pop()} — ${srcSet.size} image(s)`);
    totalFiles++;
  }
}

if (totalFiles === 0) {
  console.log('✅ Toutes les images ont déjà leurs dimensions.');
} else {
  console.log(`\n✅ ${totalImgs} <img> mis à jour dans ${totalFiles} fichier(s)`);
}
