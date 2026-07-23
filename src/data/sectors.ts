// ---------------------------------------------------------------------------
// SECTORS (homepage strip carousel)
// ---------------------------------------------------------------------------
// To add, remove, reorder, or re-caption a sector card on the homepage strip,
// edit the `sectors` array below.
//
//   title   – text shown on the card
//   image   – background image ("__BASE__/wp-content/uploads/.../file.jpg")
//   id      – a unique number per card (any unused number is fine; it only
//             wires the card to its own background-image rule)
//
// Note: there are 7 sector *pages* under /sectors/, but the homepage strip
// historically shows these 6. Add an entry here to surface another one.
// ---------------------------------------------------------------------------

export interface Sector {
  title: string;
  image: string;
  id: number;
}

export const sectors: Sector[] = [
  { title: 'Renewables',       image: '__BASE__/wp-content/uploads/2025/12/biel-morro-HCha-UHkIg8-unsplash-scaled.jpg',       id: 523 },
  { title: 'Storage',          image: '__BASE__/wp-content/uploads/2025/12/patrik-maki-RKRvSeX2sPs-unsplash-scaled.jpg',       id: 522 },
  { title: 'Clean Transport',  image: '__BASE__/wp-content/uploads/2025/12/charles-forerunner-gapYVvUg1M8-unsplash-scaled.jpg', id: 517 },
  { title: 'Grids',            image: '__BASE__/wp-content/uploads/2025/12/Grid-2.png',                                        id: 1460 },
  { title: 'Green Gases',      image: '__BASE__/wp-content/uploads/2025/12/julia-koblitz-QqJkvgyTbUE-unsplash-scaled.jpg',      id: 524 },
  { title: 'Circular Economy', image: '__BASE__/wp-content/uploads/2025/12/usgs-1_IV9CRLnd8-unsplash.jpg',                     id: 571 },
];

/** Renders one sector as its background-image style + Swiper slide (matches original Elementor markup). */
export function renderSector(s: Sector): string {
  const bgStyle = `<style id="loop-dynamic-355">.e-loop-item-${s.id} .elementor-element.elementor-element-2c3b4c1:not(.elementor-motion-effects-element-type-background), .e-loop-item-${s.id} .elementor-element.elementor-element-2c3b4c1 > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-image:url("${s.image}");}</style> `;
  const slide = `<div aria-roledescription="slide" class="elementor elementor-355 swiper-slide e-loop-item e-loop-item-${s.id} post-${s.id} sectors type-sectors status-publish has-post-thumbnail hentry" data-custom-edit-handle="1" data-elementor-id="355" data-elementor-post-type="elementor_library" data-elementor-type="loop-item" role="group">
<div class="elementor-element elementor-element-2c3b4c1 e-flex e-con-boxed e-con e-parent" data-e-type="container" data-element_type="container" data-id="2c3b4c1" data-settings='{"background_background":"classic"}'>
<div class="e-con-inner">
<div class="elementor-element elementor-element-727bde1 elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="727bde1" data-widget_type="theme-post-title.default">
<div class="elementor-widget-container">
<h1 class="elementor-heading-title elementor-size-default">${s.title}</h1> </div>
</div>
</div>
</div>
</div>
`;
  return bgStyle + slide;
}
