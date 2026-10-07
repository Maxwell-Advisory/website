import type { APIRoute } from 'astro';
import { shareImage } from '../lib/brandImages.ts';

// Built to /og-image.jpg at build time; see src/lib/brandImages.ts.
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await shareImage()), { headers: { 'Content-Type': 'image/jpeg' } });
