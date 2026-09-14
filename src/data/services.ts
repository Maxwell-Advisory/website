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
    body: '<p>We help companies and project developers build investible business models that meet the requirements of infrastructure and institutional investors.</p><p>This includes structuring projects, supporting commercial negotiations, and developing business plans that align with investor expectations.</p><p>Our team ensures projects are bankable before entering the fundraising stage.</p>',
    image: 'nagy-arnold-jc5ZUZ_rfZk-unsplash-scaled.jpg',
  },
  {
    title: '2.Capital Raising and M&amp;A',
    body: '<p>We run fundraising and M&amp;A processes for companies that require capital.</p><p>A typical process will involve Maxwell supporting on pre-transaction preparation and strategic planning, investor marketing, due diligence, documentation and negotiation, and closing.</p><p>Our investor network covers European mid-market infrastructure funds, global climate PE funds, and corporate investors active in the energy transition.</p>',
    image: 'image2.png',
  },
  {
    title: '3.Value Creation Partner',
    body: '<p>We support investors’ existing portfolio companies with value creation activities. This service provides investors with interim resources that bring a disciplined infrastructure approach to value creation.</p><p>Example mandates include delivering a specific transaction, institutionalising internal processes within a portfolio company, or analysing possible value enhancements across a business.</p>',
    image: 'image11.png',
  },
];
