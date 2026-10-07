import type { APIRoute } from 'astro';
import { favicon } from '../lib/brandImages.ts';

// Built to /favicon.ico at build time; see src/lib/brandImages.ts.
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await favicon()), { headers: { 'Content-Type': 'image/x-icon' } });
