import sharp from 'sharp';
import { existsSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';

const src = 'public/images/Zanzibar blog';
const dst = 'public/images/formatjpg/Zanzibar';
mkdirSync(dst, { recursive: true });

const toConvert = [
    { file: '1.jpg', ext: 'jpg' },
    { file: '2.jpg', ext: 'jpg' },
    { file: '3.jpg', ext: 'jpg' },
    { file: '4.jpg', ext: 'jpg' },
    { file: '5.jpg', ext: 'jpg' },
    { file: '6.jpg', ext: 'jpg' },
    { file: '7.jpg', ext: 'jpg' },
    { file: '8.jpg', ext: 'jpg' },
    { file: '9.jpg', ext: 'jpg' },
    { file: '10.jpg', ext: 'jpg' },
    { file: '11.jpg', ext: 'jpg' },
    { file: '12.jpg', ext: 'jpg' },
    { file: '13.jpg', ext: 'jpg' },
    { file: '16.jpg', ext: 'jpg' },
    { file: '17.jpg', ext: 'jpg' },
    { file: '18.jpg', ext: 'jpg' },
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
