// ---------------------------------------------------------------------------
// TEAM MEMBERS
// ---------------------------------------------------------------------------
// To add or edit a team member, change the `team` array below. Nothing else
// needs editing — the /team page carousel is generated from this list.
//
//   name   – full name (shown as the heading)
//   role   – title under the name
//   bio    – one paragraph of biography
//   image  – path to the photo (put the file in
//            public/wp-content/uploads/... and reference it as
//            "__BASE__/wp-content/uploads/.../file.jpeg")
//   srcset – (optional) responsive image set; safe to omit for new members,
//            a single `image` works fine.
// ---------------------------------------------------------------------------

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  srcset?: string;
  width?: number;
  height?: number;
  /** Cosmetic id kept for parity with the original markup; optional for new members. */
  postId?: number;
  wpImage?: number;
}

export const team: TeamMember[] = [
  {
    name: 'Adrien d’Ormesson',
    role: 'Co-Founder and Director',
    bio: 'Adrien brings extensive investment and transaction experience across the energy transition and industrial decarbonisation sectors. Before co-founding Maxwell, he was a Senior Investment Manager at Foresight Group, where he helped expand the firm’s infrastructure mandate into renewables, carbon management, and industrial efficiency. He began his career in investment banking in London before moving into real assets, where he developed a focus on complex, high-impact projects.',
    image: '__BASE__/wp-content/uploads/2025/12/Photo-couleur-Adrien-843x1024.jpeg',
    srcset:
      '__BASE__/wp-content/uploads/2025/12/Photo-couleur-Adrien-843x1024.jpeg 843w, __BASE__/wp-content/uploads/2025/12/Photo-couleur-Adrien-247x300.jpeg 247w, __BASE__/wp-content/uploads/2025/12/Photo-couleur-Adrien-768x933.jpeg 768w, __BASE__/wp-content/uploads/2025/12/Photo-couleur-Adrien.jpeg 896w',
    width: 800,
    height: 972,
    postId: 865,
    wpImage: 1401,
  },
  {
    name: 'Joe Davis',
    role: 'Co-Founder and Director',
    bio: 'Joe has more than a decade of experience across infrastructure investment and advisory. Before founding Maxwell, he held senior roles at Foresight Group and the Pensions Infrastructure Platform (PiP), leading investments across energy, storage, hydrogen, and social infrastructure sectors. His blend of advisory and buy-side experience has shaped a pragmatic and hands-on investment approach focused on capital-intensive climate businesses.',
    image: '__BASE__/wp-content/uploads/2025/12/Photo-couleur-Joe-843x1024.jpeg',
    srcset:
      '__BASE__/wp-content/uploads/2025/12/Photo-couleur-Joe-843x1024.jpeg 843w, __BASE__/wp-content/uploads/2025/12/Photo-couleur-Joe-247x300.jpeg 247w, __BASE__/wp-content/uploads/2025/12/Photo-couleur-Joe-768x933.jpeg 768w, __BASE__/wp-content/uploads/2025/12/Photo-couleur-Joe.jpeg 896w',
    width: 800,
    height: 972,
    postId: 869,
    wpImage: 1400,
  },
];

/** Renders one team member as a Swiper slide, matching the original Elementor markup. */
export function renderMember(m: TeamMember, i: number): string {
  const postId = m.postId ?? 900 + i;
  const imgClass = 'attachment-large size-large' + (m.wpImage ? ` wp-image-${m.wpImage}` : '');
  const srcset = m.srcset ? ` srcset="${m.srcset}"` : '';
  return `<div aria-roledescription="slide" class="elementor elementor-856 swiper-slide e-loop-item e-loop-item-${postId} post-${postId} team type-team status-publish has-post-thumbnail hentry" data-custom-edit-handle="1" data-elementor-id="856" data-elementor-post-type="elementor_library" data-elementor-type="loop-item" role="group">
<div class="elementor-element elementor-element-49ecff7 e-flex e-con-boxed e-con e-parent" data-e-type="container" data-element_type="container" data-id="49ecff7">
<div class="e-con-inner">
<div class="elementor-element elementor-element-65b65e5 elementor-widget elementor-widget-theme-post-featured-image elementor-widget-image" data-e-type="widget" data-element_type="widget" data-id="65b65e5" data-widget_type="theme-post-featured-image.default">
<div class="elementor-widget-container">
<img alt="" class="${imgClass}" decoding="async" height="${m.height ?? 972}" loading="lazy" sizes="(max-width: 800px) 100vw, 800px" src="${m.image}"${srcset} width="${m.width ?? 800}"/> </div>
</div>
<div class="elementor-element elementor-element-5a1a986 elementor-widget elementor-widget-heading" data-e-type="widget" data-element_type="widget" data-id="5a1a986" data-widget_type="heading.default">
<div class="elementor-widget-container">
<h2 class="elementor-heading-title elementor-size-default">${m.name}</h2> </div>
</div>
<div class="elementor-element elementor-element-b93be48 elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="b93be48" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
${m.role} </div>
</div>
<div class="elementor-element elementor-element-1652220 elementor-widget__width-initial elementor-widget elementor-widget-text-editor" data-e-type="widget" data-element_type="widget" data-id="1652220" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
<p>${m.bio}</p>
</div>
</div>
</div>
</div>
</div>
`;
}
