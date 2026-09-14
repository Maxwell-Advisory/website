// ---------------------------------------------------------------------------
// IMAGE REGISTRY
//
// Every image lives in src/assets/images/ so Astro can process it: it emits
// responsive WebP/AVIF variants, fingerprints the filenames for caching, and
// fails the build if a file is missing (a broken path in public/ would only
// show up as a 404 in the browser).
//
// Data files still refer to images by plain filename, e.g. 'Grid-2.png'; this
// module maps that name to the processed asset.
//
//   import { image } from '../lib/images.ts';
//   <Image src={image('Grid-2.png')} alt="" />            // <img> case
//   const bg = await getImage({ src: image('hero.jpg') }); // CSS background
// ---------------------------------------------------------------------------
import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.{jpg,jpeg,png,webp,avif,gif,svg}',
  { eager: true },
);

/** filename (no path) -> processed asset */
const byName = new Map<string, ImageMetadata>(
  Object.entries(modules).map(([path, mod]) => [
    path.split('/').pop() as string,
    mod.default,
  ]),
);

/**
 * Look up an image by filename. Throws at build time if it is missing, so a
 * typo or a deleted file is caught before it ships.
 */
export function image(name: string): ImageMetadata {
  // tolerate legacy "__BASE__/wp-content/uploads/2025/12/foo.jpg" strings
  const file = name.split('/').pop() as string;
  // Data files may still name a WordPress size-variant ("foo-1024x576.jpg").
  // We keep only the original of each family and let Astro generate its own
  // responsive set, so fall back to the base name and to WP's "-scaled".
  const base = file.replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
  const scaled = base.replace(/(\.[a-z]+)$/i, '-scaled$1');
  const found = byName.get(file) ?? byName.get(base) ?? byName.get(scaled);
  if (!found) {
    throw new Error(
      `Unknown image "${file}". Add it to src/assets/images/ (have: ${[...byName.keys()].join(', ')})`,
    );
  }
  return found;
}

/** True if the named image exists — for optional fields such as client logos. */
export function hasImage(name: string): boolean {
  const file = name.split('/').pop() as string;
  const base = file.replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
  return byName.has(file) || byName.has(base) || byName.has(base.replace(/(\.[a-z]+)$/i, '-scaled$1'));
}
