// ---------------------------------------------------------------------------
// /our-services/ content. Edit the strings here to change the page.
//   eyebrow / intro  – the lilac band at the top
//   blocks           – each is a heading, an image (a filename in
//                      src/assets/images/), and body copy split into a
//                      visible excerpt plus a "READ MORE" continuation, which
//                      may be a single string or an array of paragraphs
// ---------------------------------------------------------------------------
export interface ContentBlock {
  heading: string;
  image: string;
  alt: string;
  visible: string;
  /** the continuation behind READ MORE — one paragraph, or several. */
  hidden: string | string[];
}

export const ourServices = {
  eyebrow: "Our services",
  intro: "We take energy transition and infrastructure businesses across the gap between early-stage funding and infrastructure-scale capital. That means preparing projects for investment, raising the equity and the debt behind them, and running the sale when the time comes.",
  blocks: [
    {
      heading: 'Development Support',
      image: 'patrik-maki-RKRvSeX2sPs-unsplash-scaled.jpg',
      alt: '',
      visible: "We make projects investible before you go to market – structuring the business model, the contracts and the economics around what infrastructure investors actually require.",
      hidden: [
        "We work alongside your management team on the deliverables that decide the outcome of a fundraise: commercial negotiations, financial models, and a business plan that carries your project’s fundamentals with credibility. In practice that means testing revenue assumptions before an investor does, reworking contracts that leave risk in the wrong place, and building a financial model that answers the questions an investment committee will actually ask.",
        "We have spent our careers on the other side of these decisions, at infrastructure funds and institutional investors. Diligence tends to come apart over the same handful of things. We would rather find those ourselves, early, while there is still room to address them.",
      ],
    },
    {
      heading: 'Capital Raising and M&A',
      image: 'usgs-1_IV9CRLnd8-unsplash.jpg',
      alt: '',
      visible: "We run capital raisings and M&A processes end to end, taking them to our network of more than 100 specialist investors. Your terms come out of bespoke marketing and competition rather than a single conversation.",
      hidden: [
        "A typical mandate runs from pre-transaction preparation and strategic planning through investor marketing, due diligence, documentation and negotiation, to close. We prepare the materials, build the model, shortlist and approach the investors, and stay on your side of the table through negotiation – on capital raises and on buy-side and sell-side M&A alike.",
        "Our network covers European mid-market infrastructure funds, global climate private equity, family offices, and corporate investors active in the energy transition. We know which of them are deploying right now, what they are looking for, and which conversations are worth your time. Each process we run is tailored to the needs and profile of your company, rather than simply shared with a list of 200 investors.",
      ],
    },
    {
      heading: 'Debt Advisory',
      image: 'sander-weeteling-iGDg_f_mlWo-unsplash.jpg',
      alt: '',
      visible: "We advise energy and infrastructure clients on debt financing: what the market will lend, on what terms, and how to raise it.",
      hidden: [
        "That runs from early questions about how much leverage an asset will carry, through structuring and lender selection, to credit approval, documentation and close. Some mandates are a full raise; others are a view on what is achievable before you commit to a strategy, or a refinancing of something already built.",
        "The lender market is not one market. Commercial banks, infrastructure debt funds, private credit, development finance institutions, export credit agencies and national green banks each price the same asset differently and each want something different in return. Knowing which to approach, and in what order, is a critical part of the job. The rest of the value is in the structure: covenants and flexibility matter as much as margin, and the right structure is the one that delivers your objectives while still securing credit committee approval.",
      ],
    },
  ] satisfies ContentBlock[],
};
