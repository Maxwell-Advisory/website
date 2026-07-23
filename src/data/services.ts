// ---------------------------------------------------------------------------
// SERVICE CARDS (homepage accordion)
// ---------------------------------------------------------------------------
// Edit the title, body text, or image of each service below. The first card
// is open by default. To add a new card, copy an entry and give it fresh ids
// (itemId / containerId / textId / imageId) — any unused values work; the ids
// only hook the card to its styling.
//
//   title – heading text (keep the leading number if you want the numbering)
//   body  – the description; wrap each paragraph in <p>…</p>
//   image – path under "__BASE__/wp-content/uploads/..."
// ---------------------------------------------------------------------------

export interface ServiceCard {
  title: string;
  body: string;
  image: string;
  srcset?: string;
  width: number;
  height: number;
  sizes: string;
  wpImage?: number;
  itemId: number;
  containerId: string;
  textId: string;
  imageId: string;
}

export const services: ServiceCard[] = [
  {
    title: '1. Development Support',
    body: '<p>We help companies and project developers build investible business models that meet the requirements of infrastructure and institutional investors.</p><p>This includes structuring projects, supporting commercial negotiations, and developing business plans that align with investor expectations.</p><p>Our team ensures projects are bankable before entering the fundraising stage.</p>',
    image: '__BASE__/wp-content/uploads/2025/12/nagy-arnold-jc5ZUZ_rfZk-unsplash-683x1024.jpg',
    srcset: '__BASE__/wp-content/uploads/2025/12/nagy-arnold-jc5ZUZ_rfZk-unsplash-683x1024.jpg 683w, __BASE__/wp-content/uploads/2025/12/nagy-arnold-jc5ZUZ_rfZk-unsplash-200x300.jpg 200w, __BASE__/wp-content/uploads/2025/12/nagy-arnold-jc5ZUZ_rfZk-unsplash-768x1152.jpg 768w, __BASE__/wp-content/uploads/2025/12/nagy-arnold-jc5ZUZ_rfZk-unsplash-1024x1536.jpg 1024w, __BASE__/wp-content/uploads/2025/12/nagy-arnold-jc5ZUZ_rfZk-unsplash-1365x2048.jpg 1365w, __BASE__/wp-content/uploads/2025/12/nagy-arnold-jc5ZUZ_rfZk-unsplash-scaled.jpg 1707w',
    width: 683, height: 1024, sizes: '(max-width: 683px) 100vw, 683px', wpImage: 390,
    itemId: 5050, containerId: 'd5018b2', textId: '6501fe3', imageId: 'e95dfba',
  },
  {
    title: '2.Capital Raising and M&amp;A',
    body: '<p>We run fundraising and M&amp;A processes for companies that require capital.</p><p>A typical process will involve Maxwell supporting on pre-transaction preparation and strategic planning, investor marketing, due diligence, documentation and negotiation, and closing.</p><p>Our investor network covers European mid-market infrastructure funds, global climate PE funds, and corporate investors active in the energy transition.</p>',
    image: '__BASE__/wp-content/uploads/2025/12/image2.png',
    srcset: '__BASE__/wp-content/uploads/2025/12/image2.png 532w, __BASE__/wp-content/uploads/2025/12/image2-200x300.png 200w',
    width: 532, height: 800, sizes: '(max-width: 532px) 100vw, 532px', wpImage: 1427,
    itemId: 5051, containerId: '237567f', textId: '3141f8e', imageId: 'b9f0182',
  },
  {
    title: '3.Value Creation Partner',
    body: '<p>We support investors’ existing portfolio companies with value creation activities. This service provides investors with interim resources that bring a disciplined infrastructure approach to value creation.</p><p>Example mandates include delivering a specific transaction, institutionalising internal processes within a portfolio company, or analysing possible value enhancements across a business.</p>',
    image: '__BASE__/wp-content/uploads/2025/12/image11.png',
    srcset: '__BASE__/wp-content/uploads/2025/12/image11.png 735w, __BASE__/wp-content/uploads/2025/12/image11-225x300.png 225w',
    width: 735, height: 981, sizes: '(max-width: 735px) 100vw, 735px', wpImage: 1426,
    itemId: 5052, containerId: '70471a4', textId: 'bdfdb59', imageId: 'c1775e2',
  },
];

const ICON_OPEN =
  '<svg fill="none" height="2" viewbox="0 0 49 2" width="49" xmlns="http://www.w3.org/2000/svg"><g style="mix-blend-mode:difference"><line stroke="#787575" stroke-opacity="0.7" stroke-width="2" x2="49" y1="1" y2="1"></line></g></svg>';
const ICON_CLOSED =
  '<svg fill="none" height="49" viewbox="0 0 49 49" width="49" xmlns="http://www.w3.org/2000/svg"><line stroke="#787575" stroke-opacity="0.7" stroke-width="2" x2="49" y1="23" y2="23"></line><line stroke="#787575" stroke-opacity="0.7" stroke-width="2" x1="24" x2="24" y1="4.37114e-08" y2="49"></line></svg>';

export function renderService(c: ServiceCard, i: number): string {
  const tabindex = i === 0 ? '0' : '-1';
  const imgClass = 'attachment-large size-large' + (c.wpImage ? ` wp-image-${c.wpImage}` : '');
  const srcset = c.srcset ? ` srcset="${c.srcset}"` : '';
  return `<details class="e-n-accordion-item" id="e-n-accordion-item-${c.itemId}">
<summary aria-controls="e-n-accordion-item-${c.itemId}" aria-expanded="false" class="e-n-accordion-item-title" data-accordion-index="${i + 1}" tabindex="${tabindex}">
<span class="e-n-accordion-item-title-header"><h2 class="e-n-accordion-item-title-text"> ${c.title} </h2></span>
<span class="e-n-accordion-item-title-icon">
<span class="e-opened">${ICON_OPEN}</span>
<span class="e-closed">${ICON_CLOSED}</span>
</span>
</summary>
<div aria-labelledby="e-n-accordion-item-${c.itemId}" class="elementor-element elementor-element-${c.containerId} e-con-full e-flex e-con e-child" data-e-type="container" data-element_type="container" data-id="${c.containerId}" role="region">
<div class="elementor-element elementor-element-${c.textId} elementor-widget__width-initial elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="${c.textId}" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
${c.body} </div>
</div>
<div class="elementor-element elementor-element-${c.imageId} elementor-widget__width-initial elementor-widget elementor-widget-image" data-e-type="widget" data-element_type="widget" data-id="${c.imageId}" data-widget_type="image.default">
<div class="elementor-widget-container">
<img alt="" class="${imgClass}" decoding="async" height="${c.height}" loading="lazy" sizes="${c.sizes}" src="${c.image}"${srcset} width="${c.width}"/> </div>
</div>
</div>
</details>
`;
}
