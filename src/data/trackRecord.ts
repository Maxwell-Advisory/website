// ---------------------------------------------------------------------------
// TRACK RECORD — the experience grid and its panels (src/pages/track-record.astro)
// ---------------------------------------------------------------------------
// Each entry renders a card in the grid. Clicking one expands it in place;
// there is no separate panel any more.
//
//   id          – unique number per entry. Nothing reads it now that the modal
//                 has gone; kept only so the entries stay identifiable
//   title       – the client’s name where the mandate is public, otherwise a
//                 descriptor of the project
//   description – the write-up; wrap paragraphs in <p>…</p>. The card shows a
//                 4-line excerpt and the expanded card shows all of it.
//                 Quotations: curly doubles, italicised, attribution after a
//                 <br /> and outside the <em> so it is not part of the quote
//   logo        – optional client logo, a filename in src/assets/images/
// ---------------------------------------------------------------------------

export interface TrackLogo {
  src: string;
}

export interface TrackEntry {
  id: number;
  title: string;
  description: string;
  logo?: TrackLogo;
}

export const trackRecord: TrackEntry[] = [
  {
    id: 949,
    title: "Vanadis Energy",
    description: "<p>Financial advisory and development support for Vanadis Energy on a raise of close to SEK 120 million, around EUR 10 million, from the Swedish Energy Agency and private investors.</p><p>The company is a Japanese business commercialising vanadium solid-state batteries, and the investment funds the next phase of development, scale-up and manufacturing at its production facility in Sweden.</p><p><em>“Maxwell Advisory was invaluable to our recent fundraising process. The team was quickly able to understand our company’s capital requirement and then worked hard to secure the investment. They combined strong technical skills, such as business plan development, with a broad investor network and highly professional approach.”</em><br />Kurokawa Kazumasa, CEO</p>",
    logo: { src: "Vanadis-Energy.jpeg" },
  },
  {
    id: 950,
    title: "Nepsis",
    description: "<p>A market sounding for Nepsis, testing lender appetite for small and medium-sized solar projects in France.</p><p>We approached lenders directly and came back with their feedback on what they would finance, at what scale and on what terms. That told Nepsis where the appetite actually sat, and where it did not.</p><p><em>“Maxwell delivered a clear and insightful analysis of the lenders market, which proved valuable in supporting our strategic decision-making.”</em><br />Constantin Wolfrom, CEO</p>",
    logo: { src: "logo-nepsis.png" },
  },
  {
    id: 940,
    title: "Spanish Solar and BESS",
    description: "<p>An advisory mandate with a client raising capital for a solar and BESS hybridisation strategy in Spain. </p>\n<p>The mandate is ongoing.</p>",
  },
  {
    id: 945,
    title: "Polish Development Platform",
    description: "<p>An advisory mandate with a client targeting the Polish renewables and storage markets. </p>\n<p>The mandate is ongoing.</p>",
  },
];
