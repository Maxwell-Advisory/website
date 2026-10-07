// ---------------------------------------------------------------------------
// Site-wide configuration: navigation and a base-path-aware URL helper.
// Change the nav here and Header + Footer update together.
// ---------------------------------------------------------------------------

/** Prefix an internal path with the configured base ("/" in production). */
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
  { label: 'Our Services', href: '/our-services/' },
  { label: 'Team', href: '/team/' },
  { label: 'Track Record', href: '/track-record/' },
  { label: 'Contact', href: '/contact/' },
];

export const siteMeta = {
  name: 'Maxwell Advisory',
  tagline: 'Advisors for the energy transition and industrial decarbonisation',
  wordmark: 'Maxwell Advisory',
  /** Fallback meta description, for any page not listed in pageDescriptions. */
  description:
    'Maxwell Advisory helps energy transition businesses prepare projects for investment and raise equity and debt from infrastructure investors.',
  locale: 'en_GB',
  email: 'contact@maxwelladvisory.eu',
  /** The office address shown on /contact/ (the registered office is in the legal notice). */
  address: {
    streetAddress: 'Climate House, 39 rue du Caire',
    postalCode: '75002',
    addressLocality: 'Paris',
    addressCountry: 'FR',
  },
  /** Generated at build time (src/lib/brandImages.ts); used for sharing previews and structured data. */
  shareImage: { path: '/og-image.jpg', width: 1200, height: 630 },
  logo: '/logo.png',
  /** The firm's official profiles (e.g. the LinkedIn company page). Listed in
   *  the structured data so search engines can tie them to the site. */
  sameAs: ['https://www.linkedin.com/company/maxwell-advisory'] as string[],
};

/** Meta descriptions shown in search results, by page path. Keep each under
 *  about 155 characters. A page can also pass `description` to Site.astro. */
export const pageDescriptions: Record<string, string> = {
  '/': siteMeta.description,
  '/our-services/':
    'Development support, capital raising and M&A, and debt advisory for energy transition businesses moving from early-stage to infrastructure-scale capital.',
  '/team/':
    'Meet the Maxwell Advisory team: experienced investors and advisors dedicated to accelerating the energy transition, based in Paris.',
  '/track-record/':
    'Maxwell Advisory and its team have advised on or executed more than 70 transactions across the energy transition, infrastructure and industrial sectors.',
  '/contact/':
    'Contact Maxwell Advisory at Climate House, 39 rue du Caire, 75002 Paris, or email contact@maxwelladvisory.eu.',
  '/legal-notice/':
    'Legal notice for maxwelladvisory.eu: the company that operates the website, its registration details, intellectual property and applicable law.',
  '/privacy-policy/':
    'How Maxwell Advisory collects, uses and protects personal data submitted through maxwelladvisory.eu, and how to exercise your rights under the GDPR.',
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
  accessKey: 'c13fa07c-c780-4bd5-a79a-8745aa74f03a',
  /** Subject line on the email that lands in the inbox. */
  subject: 'Website enquiry — maxwelladvisory.eu',
  /** Shown, and used as the fallback, if the key is missing or the post fails. */
  fallbackEmail: 'contact@maxwelladvisory.eu',
};
