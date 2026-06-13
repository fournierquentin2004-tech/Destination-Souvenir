import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const QUALITY = 85;
const folder = process.argv[2];

if (!folder) {
    console.error('Usage: node convert-webp.mjs "public/images/Phuket blog"');
    process.exit(1);
}

const files = readdirSync(folder).filter(f => ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()));

console.log(`${files.length} images trouvées dans ${folder}\n`);

let totalAvant = 0;
let totalApres = 0;

for (const file of files) {
    const inputPath = join(folder, file);
    const outputPath = join(folder, basename(file, extname(file)) + '.webp');
    const sizeBefore = statSync(inputPath).size;

    await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);

    const sizeAfter = statSync(outputPath).size;
    const gain = Math.round((1 - sizeAfter / sizeBefore) * 100);

    totalAvant += sizeBefore;
    totalApres += sizeAfter;

    console.log(`${file} → ${basename(outputPath)}  |  ${Math.round(sizeBefore/1024)} Ko → ${Math.round(sizeAfter/1024)} Ko  (-${gain}%)`);
}

const gainTotal = Math.round((1 - totalApres / totalAvant) * 100);
console.log(`\nTotal : ${Math.round(totalAvant/1024)} Ko → ${Math.round(totalApres/1024)} Ko  (-${gainTotal}%)`);
console.log('\nLes JPG originaux sont conservés. Vérifie le résultat avant de mettre à jour l\'article.');
