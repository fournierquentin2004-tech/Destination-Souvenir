import sharp from 'sharp';
import { readFile, writeFile, stat } from 'fs/promises';
import path from 'path';

const folder = 'C:/Users/fourn/OneDrive/Bureau/destination-souvenir/public/images/Maldives blog';
const needed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const MAX_WIDTH = 1920;
const QUALITY = 85;

for (const num of needed) {
    const filePath = path.join(folder, `${num}.jpg`);
    try {
        const before = (await stat(filePath)).size;
        const inputBuf = await readFile(filePath);
        const meta = await sharp(inputBuf).metadata();

        const buf = await sharp(inputBuf)
            .resize(meta.width > MAX_WIDTH ? MAX_WIDTH : undefined)
            .jpeg({ quality: QUALITY, mozjpeg: true })
            .toBuffer();

        await writeFile(filePath, buf);

        const saved = Math.round((1 - buf.length / before) * 100);
        console.log(`✅ ${num}.jpg — ${meta.width}×${meta.height}px | ${Math.round(before/1024)}KB → ${Math.round(buf.length/1024)}KB (-${saved}%)`);
    } catch (e) {
        console.log(`⚠️  ${num}.jpg : ${e.message}`);
    }
}
console.log('\nTerminé.');
