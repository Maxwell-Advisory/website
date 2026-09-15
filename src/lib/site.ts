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

// ---------------------------------------------------------------------------
// CONTACT FORM
//
// The site is static, so the /contact/ form hands off to Web3Forms, which
// relays the submission to the address the key was registered against
// (contact@maxwelladvisory.eu).
//
// To switch it on: request a key at https://web3forms.com using
// contact@maxwelladvisory.eu, then paste it below. Until it is set, the form
// still renders but tells the visitor to email instead, so nothing is
// silently swallowed.
//
// The key is meant to be public — it only permits posting to that one
// address, and cannot be used to read anything.
// ---------------------------------------------------------------------------
export const contactForm = {
  accessKey: '',
  /** Subject line on the email that lands in the inbox. */
  subject: 'Website enquiry — maxwelladvisory.eu',
  /** Shown, and used as the fallback, if the key is missing or the post fails. */
  fallbackEmail: 'contact@maxwelladvisory.eu',
};
