// ---------------------------------------------------------------------------
// STUB PAGES — the sector pages and the individual team-member pages.
//
// On the live site these 9 pages have NO content: the whole <main> is the
// hello-elementor default template with just the page title, i.e.
//     <div class="page-header"><h1 class="entry-title">Renewables</h1></div>
//     <div class="page-content"></div>
// We reproduce that (title only) rather than invent content. When real copy is
// written, give the entry a `body` and render it in the [slug] routes.
//
//   slug  - the URL segment (/sectors/<slug>/ or /team/<slug>/)
//   title - the <h1>
// ---------------------------------------------------------------------------

export interface StubPage {
  slug: string;
  title: string;
}

export const sectorPages: StubPage[] = [
  { slug: 'circular-economy', title: 'Circular Economy' },
  { slug: 'clean-transport', title: 'Clean Transport' },
  { slug: 'green-gases', title: 'Green Gases' },
  { slug: 'grids', title: 'Grids' },
  { slug: 'industrial-decarbonisation', title: 'Industrial Decarbonisation' },
  { slug: 'renewables', title: 'Renewables' },
  { slug: 'storage', title: 'Storage' },
];

export const teamMemberPages: StubPage[] = [
  { slug: 'adrien-dormesson', title: 'Adrien d’Ormesson' },
  { slug: 'joe-davis', title: 'Joe Davis' },
];
