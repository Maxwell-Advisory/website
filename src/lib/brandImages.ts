// ---------------------------------------------------------------------------
// Build-time brand images: favicon, touch icon, square logo and the 1200x630
// link-preview image. Generated with sharp from the brand assets in
// src/assets/images/, so they stay in step with the logo and hero photo and no
// derived binaries live in the repo. Each is served by an endpoint in
// src/pages/ (e.g. og-image.jpg.ts -> /og-image.jpg).
// ---------------------------------------------------------------------------
import sharp from 'sharp';
import path from 'node:path';

const asset = (name: string) => path.join(process.cwd(), 'src/assets/images', name);
const PICTOGRAM = asset('ASSETS-MAXWELLadvisory-26-1.png');
const WORDMARK = asset('ASSETS-MAXWELLadvisory-40-1-1024x78.png');
const HERO = asset('fabian-wiktor-pPITJDEYR78-unsplash-scaled.jpg');

type RGB = { r: number; g: number; b: number };
const LILAC: RGB = { r: 0xe0, g: 0xe5, b: 0xfc };  // --c-lilac
const INK: RGB = { r: 0x33, g: 0x33, b: 0x33 };    // --c-ink
const WHITE: RGB = { r: 255, g: 255, b: 255 };

/** A logo file recoloured to one flat colour, trimmed to its shape and fitted
 *  inside a box (scaling up or down). Returns a PNG buffer. */
async function mark(file: string, colour: RGB, maxW: number, maxH: number) {
  const alpha = await sharp(file).ensureAlpha().extractChannel('alpha').toBuffer();
  const shape = await sharp(alpha).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  const { width, height } = shape.info;
  const scale = Math.min(maxW / width, maxH / height);
  const w = Math.round(width * scale), h = Math.round(height * scale);
  const a = await sharp(shape.data).resize(w, h, { kernel: 'lanczos3' }).toBuffer();
  return sharp({ create: { width: w, height: h, channels: 3, background: colour } })
    .joinChannel(a)
    .png()
    .toBuffer();
}

/** The pictogram centred on a lilac tile. `radius` rounds the corners (as a
 *  share of the size); `pad` is the margin around the mark. */
export async function icon(size: number, { pad = 0.14, radius = 0 } = {}) {
  const S = size * 4;   // draw large, then downsample, for clean small icons
  const inner = Math.round(S * (1 - 2 * pad));
  const m = await mark(PICTOGRAM, INK, inner, inner);
  const meta = await sharp(m).metadata();
  let tile = sharp({ create: { width: S, height: S, channels: 4, background: { ...LILAC, alpha: 1 } } })
    .composite([{ input: m, left: Math.round((S - meta.width!) / 2), top: Math.round((S - meta.height!) / 2) }]);
  if (radius > 0) {
    const r = Math.round(S * radius);
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect width="${S}" height="${S}" rx="${r}" ry="${r}"/></svg>`);
    tile = sharp(await tile.png().toBuffer()).composite([{ input: mask, blend: 'dest-in' }]);
  }
  return sharp(await tile.png().toBuffer()).resize(size, size, { kernel: 'lanczos3' }).png().toBuffer();
}

/** A .ico holding PNG images (supported by every current browser). */
export async function favicon(sizes = [16, 32, 48]) {
  const images = await Promise.all(sizes.map((s) => icon(s, { pad: 0.08, radius: 0.18 })));
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);             // reserved
  header.writeUInt16LE(1, 2);             // type: icon
  header.writeUInt16LE(images.length, 4); // image count
  let offset = header.length;
  images.forEach((img, i) => {
    const e = 6 + 16 * i, s = sizes[i];
    header.writeUInt8(s >= 256 ? 0 : s, e);      // width
    header.writeUInt8(s >= 256 ? 0 : s, e + 1);  // height
    header.writeUInt16LE(1, e + 4);              // colour planes
    header.writeUInt16LE(32, e + 6);             // bits per pixel
    header.writeUInt32LE(img.length, e + 8);     // image size
    header.writeUInt32LE(offset, e + 12);        // image offset
    offset += img.length;
  });
  return Buffer.concat([header, ...images]);
}

/** 1200x630 link-preview image: the hero photo, darkened, with the wordmark. */
export async function shareImage() {
  const W = 1200, H = 630;
  // Fit to the width, then crop vertically 35% of the way down the spare
  // height, which keeps the turbines in frame.
  const resized = await sharp(HERO).resize({ width: W }).toBuffer({ resolveWithObject: true });
  const top = Math.round((resized.info.height - H) * 0.35);
  const photo = await sharp(resized.data).extract({ left: 0, top, width: W, height: H })
    .modulate({ brightness: 0.62 }).toBuffer();
  const word = await mark(WORDMARK, WHITE, Math.round(W * 0.66), 200);
  const wm = await sharp(word).metadata();
  return sharp(photo)
    .composite([{ input: word, left: Math.round((W - wm.width!) / 2), top: Math.round(H * 0.56 - wm.height! / 2) }])
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}
