// ---------------------------------------------------------------------------
// SECTORS — the homepage strip carousel (src/components/home/SectorStrip.astro)
// ---------------------------------------------------------------------------
// Add, remove, reorder or re-caption a card by editing the array below.
//
//   title – text shown on the card
//   image – filename in src/assets/images/
// ---------------------------------------------------------------------------

export interface Sector {
  title: string;
  image: string;
}

export const sectors: Sector[] = [
  { title: 'Renewables',       image: 'biel-morro-HCha-UHkIg8-unsplash-scaled.jpg' },
  { title: 'Storage',          image: 'patrik-maki-RKRvSeX2sPs-unsplash-scaled.jpg' },
  { title: 'Clean Transport',  image: 'charles-forerunner-gapYVvUg1M8-unsplash-scaled.jpg' },
  { title: 'Grids',           image: 'Grid-2.png' },
  { title: 'Green Gases',      image: 'julia-koblitz-QqJkvgyTbUE-unsplash-scaled.jpg' },
  { title: 'Circular Economy', image: 'usgs-1_IV9CRLnd8-unsplash.jpg' },
];
