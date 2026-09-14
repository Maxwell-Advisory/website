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

export interface NavLink {
  label: string;
  href: string;
}

/** The overlay menu's links. The footer keeps its own grouped list. */
export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'For Companies', href: '/for-companies/' },
  { label: 'For Investors', href: '/for-investors/' },
  { label: 'Team', href: '/team/' },
  { label: 'Track Record', href: '/track-record/' },
  { label: 'Contact', href: '/contact/' },
];

export const siteMeta = {
  name: 'Maxwell Advisory',
  tagline: 'Advisors for the energy transition and industrial decarbonisation',
  wordmark: 'Maxwell Advisory',
};
