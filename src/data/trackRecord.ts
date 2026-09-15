// ---------------------------------------------------------------------------
// TRACK RECORD — the experience grid and its panels (src/pages/track-record.astro)
// ---------------------------------------------------------------------------
// Each entry renders a card in the grid plus a panel with the full write-up.
//
//   id          – unique number per entry; wires the card to its panel
//   title       – project name (shown on the card and in the panel)
//   description – the write-up; wrap paragraphs in <p>…</p>. The card shows a
//                 4-line excerpt; the panel shows all of it
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
    description: "<p>Financial advisory and development support mandate for Vanadis Energy, a Japanese technology company commercialising vanadium solid-state batteries. With our support, Vanadis Energy raised nearly SEK 120 million (EUR c.10m) from a combination of the Swedish Energy Agency and private investors. The investment will support the next phase of development, scale-up and manufacturing at the Vanadis Energy production facility in Sweden.</p>\n<p>« Maxwell Advisory was invaluable to our recent fundraising process. The team was quickly able to understand our company’s capital requirement and then worked hard to secure the investment. They combined strong technical skills, such as business plan development, with a broad investor network and highly professional approach. » Kurokawa Kazumasa, CEO.</p>",
    logo: { src: "Vanadis-Energy.jpeg" },
  },
  {
    id: 950,
    title: "Nepsis Advisory",
    description: "<p>Advisory services and market analysis for Nepsis, mapping the lenders landscape to support capital deployment in small and medium-sized solar projects in France.</p>\n<p>“Maxwell delivered a clear and insightful analysis of the lenders market, which proved valuable in supporting our strategic decision-making.” Constantin Wolfrom, CEO</p>",
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
