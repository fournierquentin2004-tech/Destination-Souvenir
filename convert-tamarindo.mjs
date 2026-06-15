import sharp from 'sharp';
import { existsSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';

const src = 'public/images/Tamarindo Costa Rica blog';
const dst = 'public/images/formatjpg/Tamarindo Costa Rica';
mkdirSync(dst, { recursive: true });

for (const i of [16]) {
    const jpg = `${src}/${i}.jpg`;
    if (!existsSync(jpg)) continue;
    await sharp(jpg).webp({ quality: 85 }).toFile(`${src}/${i}.webp`);
    copyFileSync(jpg, `${dst}/${i}.jpg`);
    unlinkSync(jpg);
    console.log(`✅ ${i}.jpg → ${i}.webp`);
}
console.log('Done');
