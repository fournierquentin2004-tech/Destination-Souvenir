import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, renameSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const QUALITY = 85;
const IMAGES_DIR = 'public/images';
const ARCHIVE_DIR = 'public/images/formatjpg';

// Mapping dossier source → nom de ville pour l'archive
const BLOG_FOLDERS = {
  'Australie plage Blog': 'Australie plage',
  'Bali blog': 'Bali',
  'Bangkok blog': 'Bangkok',
  'Bora Bora blog': 'Bora Bora',
  'Cairns blog': 'Cairns',
  'Cancún Mexique Blog': 'Cancun',
  'Coron blog': 'Coron',
  'El Nido Philippines blog': 'El Nido',
  'Koh Phi Phi blog': 'Koh Phi Phi',
  'Koh Samui blog': 'Koh Samui',
  'Maldives blog': 'Maldives',
  'Marrakech blog': 'Marrakech',
  'Phuket blog': 'Phuket',
  'Seoul blog': 'Seoul',
  'Sydney blog': 'Sydney',
  'Tokyo blog': 'Tokyo',
};

let totalAvant = 0;
let totalApres = 0;
let totalConverted = 0;
let totalMoved = 0;

for (const [folder, cityName] of Object.entries(BLOG_FOLDERS)) {
  const sourceDir = join(IMAGES_DIR, folder);
  const archiveDir = join(ARCHIVE_DIR, cityName);

  if (!existsSync(sourceDir)) {
    console.log(`⚠️  Dossier introuvable : ${folder}`);
    continue;
  }

  mkdirSync(archiveDir, { recursive: true });

  const jpgs = readdirSync(sourceDir).filter(f =>
    ['.jpg', '.jpeg'].includes(extname(f).toLowerCase())
  );

  console.log(`\n📁 ${folder} → ${jpgs.length} JPG`);

  for (const file of jpgs) {
    const inputPath = join(sourceDir, file);
    const webpName = basename(file, extname(file)) + '.webp';
    const outputPath = join(sourceDir, webpName);
    const archivePath = join(archiveDir, file);

    const sizeBefore = statSync(inputPath).size;

    // Convertir en WebP si pas déjà fait
    if (!existsSync(outputPath)) {
      await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);
      const sizeAfter = statSync(outputPath).size;
      const gain = Math.round((1 - sizeAfter / sizeBefore) * 100);
      totalAvant += sizeBefore;
      totalApres += sizeAfter;
      totalConverted++;
      console.log(`  ✅ ${file} → ${webpName}  (-${gain}%)`);
    } else {
      // WebP déjà existant (ex: Phuket déjà fait)
      const sizeAfter = statSync(outputPath).size;
      totalAvant += sizeBefore;
      totalApres += sizeAfter;
      console.log(`  ⏭️  ${webpName} déjà existant`);
    }

    // Déplacer le JPG dans l'archive
    renameSync(inputPath, archivePath);
    totalMoved++;
    console.log(`  📦 ${file} archivé dans formatjpg/${cityName}/`);
  }
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`✅ ${totalConverted} images converties en WebP`);
console.log(`📦 ${totalMoved} JPG archivés dans public/images/formatjpg/`);
const gainTotal = Math.round((1 - totalApres / totalAvant) * 100);
console.log(`📉 Gain total : ${Math.round(totalAvant / 1024)} Ko → ${Math.round(totalApres / 1024)} Ko  (-${gainTotal}%)`);
