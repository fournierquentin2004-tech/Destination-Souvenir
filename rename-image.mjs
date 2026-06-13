/**
 * Synchronise le renommage d'une image entre le WebP (blog) et le JPG (archive).
 * Met aussi à jour toutes les références dans les fichiers .astro.
 *
 * Usage:
 *   node rename-image.mjs --city "Bali" --from "1" --to "surf-uluwatu"
 *
 * Renomme :
 *   public/images/Bali blog/1.webp          → public/images/Bali blog/surf-uluwatu.webp
 *   public/images/formatjpg/Bali/1.jpg      → public/images/formatjpg/Bali/surf-uluwatu.jpg
 *   Toutes les refs /images/Bali%20blog/1.webp dans src/ → .../surf-uluwatu.webp
 */

import { renameSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BLOG_FOLDERS = {
  'Australie plage': 'Australie plage Blog',
  'Bali': 'Bali blog',
  'Bangkok': 'Bangkok blog',
  'Bora Bora': 'Bora Bora blog',
  'Cairns': 'Cairns blog',
  'Cancun': 'Cancún Mexique Blog',
  'Coron': 'Coron blog',
  'El Nido': 'El Nido Philippines blog',
  'Koh Phi Phi': 'Koh Phi Phi blog',
  'Koh Samui': 'Koh Samui blog',
  'Maldives': 'Maldives blog',
  'Marrakech': 'Marrakech blog',
  'Phuket': 'Phuket blog',
  'Seoul': 'Seoul blog',
  'Sydney': 'Sydney blog',
  'Tokyo': 'Tokyo blog',
};

// Lecture des arguments
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };

const city = get('--city');
const from = get('--from');
const to = get('--to');

if (!city || !from || !to) {
  console.error('Usage: node rename-image.mjs --city "Bali" --from "1" --to "surf-uluwatu"');
  console.error('\nVilles disponibles:');
  console.error(Object.keys(BLOG_FOLDERS).join(', '));
  process.exit(1);
}

const blogFolder = BLOG_FOLDERS[city];
if (!blogFolder) {
  console.error(`Ville inconnue: "${city}"`);
  console.error('Villes disponibles:', Object.keys(BLOG_FOLDERS).join(', '));
  process.exit(1);
}

// Chemins
const webpSrc = join('public/images', blogFolder, `${from}.webp`);
const webpDst = join('public/images', blogFolder, `${to}.webp`);
const jpgSrc  = join('public/images/formatjpg', city, `${from}.jpg`);
const jpgDst  = join('public/images/formatjpg', city, `${to}.jpg`);

let renamed = 0;

// Renommer WebP
if (existsSync(webpSrc)) {
  renameSync(webpSrc, webpDst);
  console.log(`✅ WebP : ${webpSrc} → ${webpDst}`);
  renamed++;
} else {
  console.warn(`⚠️  WebP introuvable : ${webpSrc}`);
}

// Renommer JPG archivé
if (existsSync(jpgSrc)) {
  renameSync(jpgSrc, jpgDst);
  console.log(`✅ JPG  : ${jpgSrc} → ${jpgDst}`);
  renamed++;
} else {
  console.warn(`⚠️  JPG introuvable : ${jpgSrc}`);
}

if (renamed === 0) {
  console.error('Aucun fichier renommé. Vérifie le nom de la ville et le numéro.');
  process.exit(1);
}

// Encoder le nom du dossier pour les URLs (espaces → %20, é → %C3%A9, etc.)
const encodeFolder = (name) => name.split('').map(c => {
  if (/[a-zA-Z0-9\-_~]/.test(c)) return c;
  return encodeURIComponent(c);
}).join('');

const encodedFolder = encodeFolder(blogFolder);
const oldRef = `/images/${encodedFolder}/${from}.webp`;
const newRef = `/images/${encodedFolder}/${to}.webp`;

// Mettre à jour les références dans src/
let filesUpdated = 0;
const srcFiles = readdirSync('src', { recursive: true })
  .filter(f => f.endsWith('.astro'))
  .map(f => join('src', f));

for (const file of srcFiles) {
  const content = readFileSync(file, 'utf8');
  if (content.includes(oldRef)) {
    writeFileSync(file, content.replaceAll(oldRef, newRef), 'utf8');
    console.log(`✅ Refs : ${file}`);
    filesUpdated++;
  }
}

if (filesUpdated === 0) {
  console.log(`ℹ️  Aucune référence à "${oldRef}" dans les fichiers .astro`);
} else {
  console.log(`\n✅ ${filesUpdated} fichier(s) mis à jour`);
}

console.log(`\nDone. N'oublie pas de vérifier le build : npm run build`);
