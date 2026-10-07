import type { APIRoute } from 'astro';
import { icon } from '../lib/brandImages.ts';

// Built to /logo.png at build time; see src/lib/brandImages.ts.
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await icon(512)), { headers: { 'Content-Type': 'image/png' } });
