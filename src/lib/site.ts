// ---------------------------------------------------------------------------
// Site-wide configuration: navigation and a base-path-aware URL helper.
// Change the nav here and Header + Footer update together.
// ---------------------------------------------------------------------------

/** Prefix an internal path with the configured base (e.g. "/website"). */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

/**
 * Resolve an asset path from the data files. They store image paths with a
 * "__BASE__/" placeholder (a hangover from the WordPress export); swap it for
 * the real base URL. Passing an already-absolute path returns it unchanged.
 */
export function asset(path: string): string {
  if (!path) return path;
  if (path.startsWith('__BASE__/')) return url('/' + path.slice('__BASE__/'.length));
  return path;
}

/** Resolve a srcset string that contains "__BASE__/" placeholders. */
export function assetSrcset(srcset?: string): string | undefined {
  if (!srcset) return undefined;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return srcset.replaceAll('__BASE__/', base + '/');
}

export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation (header + footer). */
export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'For Companies', href: '/for-companies/' },
  { label: 'For Investors', href: '/for-investors/' },
  { label: 'Team', href: '/team/' },
  { label: 'Track Record', href: '/track-record/' },
  { label: 'Contact', href: '/contact/' },
];

/** Secondary / legal links (footer only). */
export const legalNav: NavLink[] = [
  { label: 'Legal Notice', href: '/legal-notice/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
];

export const siteMeta = {
  name: 'Maxwell Advisory',
  tagline: 'Advisors for the energy transition and industrial decarbonisation',
  wordmark: 'Maxwell Advisory',
};
