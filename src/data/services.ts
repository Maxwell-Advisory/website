// ---------------------------------------------------------------------------
// SERVICE CARDS — the homepage accordion (src/components/home/ServiceAccordion.astro)
// ---------------------------------------------------------------------------
//   title – heading text (keep the leading number to preserve the numbering)
//   body  – the description; wrap each paragraph in <p>…</p>
//   image – filename in src/assets/images/
// ---------------------------------------------------------------------------

export interface ServiceCard {
  title: string;
  body: string;
  image: string;
}

export const services: ServiceCard[] = [
  {
    title: '1. Development Support',
    body: '<p>We work with developers and management teams in the months before a raise, while the decisions that determine investor appetite are still open.</p><p>That means structuring the project, negotiating the commercial contracts, and building the financial model and business plan that investors will test.</p><p>We have sat on the investor side of these decisions, so we know which questions arrive first and what evidence answers them.</p>',
    image: 'nagy-arnold-jc5ZUZ_rfZk-unsplash-scaled.jpg',
  },
  {
    title: '2. Capital Raising and M&amp;A',
    body: '<p>We act for businesses raising institutional capital. We add current market knowledge, who is investing and on what terms, and bring the experience to run a process without losing momentum.</p><p>A mandate covers preparation and positioning, marketing to investors or buyers, due diligence, documentation and negotiation, through to close.</p><p>Our network runs to more than 100 specialist investors: European mid-market infrastructure funds, global climate private equity, family offices, and corporates active in the energy transition.</p>',
    image: 'image2.png',
  },
  {
    title: '3. Debt Advisory',
    body: '<p>We act for developers and sponsors raising debt against energy and infrastructure assets, whether at construction, in operation, or refinancing something already built.</p><p>Debt is usually the largest and cheapest part of the capital structure, which makes its terms one of the biggest levers on equity returns.</p><p>We know which lenders are active in each market and what each will accept, so we can shape a structure that delivers your objectives and still secures credit approval.</p>',
    image: 'image11.png',
  },
];
