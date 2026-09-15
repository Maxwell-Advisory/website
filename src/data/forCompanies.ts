// ---------------------------------------------------------------------------
// /for-companies/ content. Edit the strings here to change the page.
//   eyebrow / intro  – the lilac band at the top
//   blocks           – each is a heading, an image (a filename in
//                      src/assets/images/), and body copy split into a
//                      visible excerpt plus a "READ MORE" continuation
// ---------------------------------------------------------------------------
export interface ContentBlock {
  heading: string;
  image: string;
  alt: string;
  visible: string;
  hidden: string;
}

export const forCompanies = {
  eyebrow: "For companies",
  intro: "Maxwell Advisory supports companies at every stage of their growth journey, helping founders and management teams transition from early-stage funding to infrastructure-scale investment. Our expertise in the energy transition and industrial sectors ensures our clients can access the capital and strategic guidance they need to scale successfully.",
  blocks: [
    {
      heading: 'Development Support',
      image: 'patrik-maki-RKRvSeX2sPs-unsplash-scaled.jpg',
      alt: '',
      visible: "We assist with project and company development prior to fundraising, ensuring that business models, contracts, and economics are structured to meet investor expectations.",
      hidden: "Our team works closely with company management teams across a range of project deliverables, including contract negotiation, building financial models, and communicating project fundamentals to investors.",
    },
    {
      heading: 'Fundraising & M&A',
      image: 'usgs-1_IV9CRLnd8-unsplash.jpg',
      alt: '',
      visible: "Our fundraising services cover the full transaction cycle, including preparation of investor materials, deal structuring, and transaction execution.",
      hidden: "We also support clients in buy-side and sell-side M&A processes, using our experience in infrastructure-style transactions to secure competitive outcomes. We have privileged access to over 60 specialist investors spanning European mid-market infrastructure funds, family offices, climate PE, and corporate investors.",
    },
    {
      heading: 'Debt Advisory',
      image: 'hazel-OhUURadmw-k-unsplash.jpg',
      alt: '',
      visible: "PLACEHOLDER — a short description of the debt advisory offering, sized to sit alongside the two blocks either side of it.",
      hidden: "PLACEHOLDER — the continuation revealed by READ MORE. Replace both strings with the real copy when it is ready.",
    },
  ] satisfies ContentBlock[],
};
