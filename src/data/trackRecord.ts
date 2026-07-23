// ---------------------------------------------------------------------------
// TRACK RECORD (experience grid + off-canvas popups)
// ---------------------------------------------------------------------------
// Each entry renders a card in the grid plus a slide-in popup with the full
// write-up. To add or edit one, change the `trackRecord` array below.
//
//   id          – unique number per entry (wires the card to its popup)
//   title       – project name (shown on the card and in the popup)
//   description – the write-up; wrap paragraphs in <p>…</p>
//   logo        – optional company logo shown in the popup and on the card
//
// NOTE: these popups are slated for a UX redesign; this keeps the current
// design but sources every entry from data.
// ---------------------------------------------------------------------------

export interface TrackImage {
  src: string;
  srcset?: string;
  width: number;
  height: number;
  sizes?: string;
  wpImage?: number;
}

export interface TrackEntry {
  id: number;
  title: string;
  description: string;
  logo?: TrackImage;
}

export const trackRecord: TrackEntry[] = [
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
  {
    id: 949,
    title: "Vanadis Energy",
    description: "<p>Financial advisory and development support mandate for Vanadis Energy, a Japanese technology company commercialising vanadium solid-state batteries. With our support, Vanadis Energy raised nearly SEK 120 million (EUR c.10m) from a combination of the Swedish Energy Agency and private investors. The investment will support the next phase of development, scale-up and manufacturing at the Vanadis Energy production facility in Sweden.</p>\n<p>« Maxwell Advisory was invaluable to our recent fundraising process. The team was quickly able to understand our company’s capital requirement and then worked hard to secure the investment. They combined strong technical skills, such as business plan development, with a broad investor network and highly professional approach. » Kurokawa Kazumasa, CEO.</p>",
    logo: {
      src: "__BASE__/wp-content/uploads/2025/12/Vanadis-Energy.jpeg",
      srcset: "__BASE__/wp-content/uploads/2025/12/Vanadis-Energy.jpeg 439w, __BASE__/wp-content/uploads/2025/12/Vanadis-Energy-300x44.jpeg 300w",
      width: 439,
      height: 64,
      sizes: "(max-width: 439px) 100vw, 439px",
      wpImage: 1482,
    },
  },
  {
    id: 950,
    title: "Nepsis Advisory",
    description: "<p>Advisory services and market analysis for Nepsis, mapping the lenders landscape to support capital deployment in small and medium-sized solar projects in France.</p>\n<p>“Maxwell delivered a clear and insightful analysis of the lenders market, which proved valuable in supporting our strategic decision-making.” Constantin Wolfrom, CEO</p>",
    logo: {
      src: "__BASE__/wp-content/uploads/2025/12/logo-nepsis.png",
      srcset: "__BASE__/wp-content/uploads/2025/12/logo-nepsis.png 601w, __BASE__/wp-content/uploads/2025/12/logo-nepsis-300x97.png 300w",
      width: 601,
      height: 194,
      sizes: "(max-width: 601px) 100vw, 601px",
      wpImage: 1478,
    },
  },
];

const ITEM_TMPL = "<div class=\"elementor elementor-930 e-loop-item e-loop-item-__ID__ post-__ID__ samples type-samples status-publish hentry\" data-custom-edit-handle=\"1\" data-elementor-id=\"930\" data-elementor-post-type=\"elementor_library\" data-elementor-type=\"loop-item\">\n<div class=\"elementor-element elementor-element-d8d2c64 e-flex e-con-boxed e-con e-parent\" data-e-type=\"container\" data-element_type=\"container\" data-id=\"d8d2c64\">\n<div class=\"e-con-inner\">\n<div class=\"elementor-element elementor-element-d340635 e-con-full e-flex e-con e-child\" data-e-type=\"container\" data-element_type=\"container\" data-id=\"d340635\">\n<div class=\"elementor-element elementor-element-5a4a34a elementor-widget__width-initial elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading\" data-e-type=\"widget\" data-element_type=\"widget\" data-id=\"5a4a34a\" data-widget_type=\"theme-post-title.default\">\n<div class=\"elementor-widget-container\">\n<h1 class=\"elementor-heading-title elementor-size-default\">__TITLE__</h1> </div>\n</div>\n<div class=\"elementor-element elementor-element-c70766b elementor-widget elementor-widget-off-canvas\" data-e-type=\"widget\" data-element_type=\"widget\" data-id=\"c70766b\" data-settings='{\"entrance_animation\":\"fadeInLeft\",\"exit_animation\":\"fadeInLeft\",\"prevent_scroll\":\"yes\"}' data-widget_type=\"off-canvas.default\">\n<div class=\"elementor-widget-container\">\n<div aria-hidden=\"true\" aria-label=\"Off-Canvas\" aria-modal=\"true\" class=\"e-off-canvas\" data-delay-child-handlers=\"true\" id=\"off-canvas-274e162-__ID__-c70766b\" inert=\"\" role=\"dialog\">\n<div class=\"e-off-canvas__overlay\"></div>\n<div class=\"e-off-canvas__main\">\n<div class=\"e-off-canvas__content\">\n<div class=\"elementor-element elementor-element-9b79547 e-con-full e-flex e-con e-child\" data-e-type=\"container\" data-element_type=\"container\" data-id=\"9b79547\">\n<div class=\"elementor-element elementor-element-5415585 elementor-widget__width-initial elementor-widget elementor-widget-theme-post-title elementor-page-title elementor-widget-heading\" data-e-type=\"widget\" data-element_type=\"widget\" data-id=\"5415585\" data-widget_type=\"theme-post-title.default\">\n<div class=\"elementor-widget-container\">\n<h1 class=\"elementor-heading-title elementor-size-default\">__TITLE__</h1> </div>\n</div>\n<div class=\"elementor-element elementor-element-f48c654 elementor-widget elementor-widget-text-editor\" data-e-type=\"widget\" data-element_type=\"widget\" data-id=\"f48c654\" data-widget_type=\"text-editor.default\">\n<div class=\"elementor-widget-container\">\n__DESC__\n</div>\n</div>__POPUPIMG__\n</div>\n</div>\n</div>\n</div>\n</div>\n</div>\n<div class=\"elementor-element elementor-element-b2cd014 elementor-widget__width-initial sample-toggle-icon elementor-view-default elementor-widget elementor-widget-icon\" data-e-type=\"widget\" data-element_type=\"widget\" data-id=\"b2cd014\" data-widget_type=\"icon.default\">\n<div class=\"elementor-widget-container\">\n<div class=\"elementor-icon-wrapper\">\n<a class=\"elementor-icon\" href=\"#elementor-action%3Aaction%3Doff_canvas%3Aopen%26settings%3D__SETTINGS__\">\n<svg fill=\"none\" height=\"49\" viewbox=\"0 0 49 49\" width=\"49\" xmlns=\"http://www.w3.org/2000/svg\"><line stroke=\"#787575\" stroke-opacity=\"0.7\" stroke-width=\"2\" x2=\"49\" y1=\"23\" y2=\"23\"></line><line stroke=\"#787575\" stroke-opacity=\"0.7\" stroke-width=\"2\" x1=\"24\" x2=\"24\" y1=\"4.37114e-08\" y2=\"49\"></line></svg> </a>\n</div>\n</div>\n</div>\n<div class=\"elementor-element elementor-element-77ba206 sample-text elementor-widget__width-initial elementor-widget elementor-widget-text-editor\" data-e-type=\"widget\" data-element_type=\"widget\" data-id=\"77ba206\" data-widget_type=\"text-editor.default\">\n<div class=\"elementor-widget-container\">\n__DESC__\n</div>\n</div>\n</div>\n<div class=\"elementor-element elementor-element-25a0ec0 elementor-widget elementor-widget-html\" data-e-type=\"widget\" data-element_type=\"widget\" data-id=\"25a0ec0\" data-widget_type=\"html.default\">\n<div class=\"elementor-widget-container\">\n<script>\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n    \n    const LIMIT_TOTAL = 250;   // total affiché\n    const LIMIT_NORMAL = 190;  // partie normale\n    const LIMIT_GREY = 60;    // partie grisée\n\n    document.querySelectorAll(\".sample-text\").forEach(el => {\n\n        // Récupérer texte brut mais conserver les retours à la ligne\n        let raw = el.innerHTML\n            .replace(/<br\\s*\\/?>/gi, \"\\n\")  // convertir <br> en vrais retours\n            .replace(/\\s+/g, \" \")           // nettoyer espaces multiples\n            .trim();\n\n        // Nettoyer les HTML éventuels (important si ACF contient <p>)\n        raw = raw.replace(/<\\/?[^>]+(>|$)/g, \"\");\n\n        // Si le texte est trop court → pas de découpe\n        if (raw.length <= LIMIT_NORMAL) {\n            el.textContent = raw;\n            return;\n        }\n\n        // Découpe robuste\n        const p1 = raw.slice(0, LIMIT_NORMAL);\n        const p2 = raw.slice(LIMIT_NORMAL, LIMIT_NORMAL + LIMIT_GREY);\n\n        // Construction du rendu final\n        el.innerHTML = `\n            <span class=\"t1\">${p1}</span>\n            <span class=\"t2\">${p2}</span>\n            <span class=\"dots\">…</span>\n        `;\n    });\n\n});\n</script>\n</div>\n</div>__CARDIMG__\n</div>\n</div>\n</div>";
const POPUP_IMG_TMPL = "<div class=\"elementor-element elementor-element-78fa197 elementor-widget elementor-widget-image\" data-e-type=\"widget\" data-element_type=\"widget\" data-id=\"78fa197\" data-widget_type=\"image.default\">\n<div class=\"elementor-widget-container\">\n<img alt=\"\" class=\"attachment-large size-large wp-image-__IMGWP__\" decoding=\"async\" height=\"__IMGH__\" sizes=\"__IMGSIZES__\" src=\"__IMGSRC__\" srcset=\"__IMGSRCSET__\" width=\"__IMGW__\"/> </div>\n</div>";
const CARD_IMG_TMPL = "<div class=\"elementor-element elementor-element-6cc6e58 elementor-widget elementor-widget-image\" data-e-type=\"widget\" data-element_type=\"widget\" data-id=\"6cc6e58\" data-widget_type=\"image.default\">\n<div class=\"elementor-widget-container\">\n<img alt=\"\" class=\"attachment-large size-large wp-image-__IMGWP__\" decoding=\"async\" height=\"__IMGH__\" sizes=\"__IMGSIZES__\" src=\"__IMGSRC__\" srcset=\"__IMGSRCSET__\" width=\"__IMGW__\"/> </div>\n</div>";

function encodeSettings(id: number): string {
  const raw = `{"id":"274e162-${id}-c70766b","displayMode":"open"}`;
  return Buffer.from(raw).toString('base64').replace(/=/g, '%3D');
}

function renderImg(tmpl: string, logo: TrackImage): string {
  return tmpl
    .replaceAll('__IMGWP__', String(logo.wpImage ?? ''))
    .replaceAll('__IMGH__', String(logo.height))
    .replaceAll('__IMGW__', String(logo.width))
    .replaceAll('__IMGSIZES__', logo.sizes ?? '')
    .replaceAll('__IMGSRCSET__', logo.srcset ?? '')
    .replaceAll('__IMGSRC__', logo.src);
}

export function renderTrackItem(e: TrackEntry): string {
  const popupImg = e.logo ? '\n' + renderImg(POPUP_IMG_TMPL, e.logo) : '';
  const cardImg = e.logo ? '\n' + renderImg(CARD_IMG_TMPL, e.logo) : '';
  return ITEM_TMPL
    .replaceAll('__POPUPIMG__', popupImg)
    .replaceAll('__CARDIMG__', cardImg)
    .replaceAll('__DESC__', e.description)
    .replaceAll('__SETTINGS__', encodeSettings(e.id))
    .replaceAll('__TITLE__', e.title)
    .replaceAll('__ID__', String(e.id));
}
