import sharp from 'sharp';
import { existsSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';

const src = 'public/images/Rio de Janeiro blog';
const dst = 'public/images/formatjpg/Rio de Janeiro';
mkdirSync(dst, { recursive: true });

for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    const jpg = `${src}/${i}.jpg`;
    if (!existsSync(jpg)) { console.log(`⚠️  ${i}.jpg introuvable, ignoré`); continue; }
    await sharp(jpg).webp({ quality: 85 }).toFile(`${src}/${i}.webp`);
    copyFileSync(jpg, `${dst}/${i}.jpg`);
    unlinkSync(jpg);
    console.log(`✅ ${i}.jpg → ${i}.webp`);
}
console.log('Done');
