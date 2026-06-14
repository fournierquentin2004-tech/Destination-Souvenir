import sharp from 'sharp';
import { existsSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';

const src = 'public/images/Cancún Mexique Blog';
const dst = 'public/images/formatjpg/Cancun Mexique';
mkdirSync(dst, { recursive: true });

const toConvert = [
    { file: '21.jpg', ext: 'jpg' },
];

for (const { file, ext } of toConvert) {
    const input = `${src}/${file}`;
    const base  = file.replace(`.${ext}`, '');
    const out   = `${src}/${base}.webp`;
    if (!existsSync(input)) { console.log(`⚠️  ${file} introuvable, ignoré`); continue; }
    await sharp(input).webp({ quality: 85 }).toFile(out);
    copyFileSync(input, `${dst}/${file}`);
    unlinkSync(input);
    console.log(`✅ ${file} → ${base}.webp`);
}
console.log('Done');
