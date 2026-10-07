import type { APIRoute } from 'astro';
import { icon } from '../lib/brandImages.ts';

// Built to /favicon-32.png at build time; see src/lib/brandImages.ts.
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await icon(32, { pad: 0.10, radius: 0.18 })), { headers: { 'Content-Type': 'image/png' } });
