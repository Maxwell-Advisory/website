// ---------------------------------------------------------------------------
// TEAM — the /team carousel (src/pages/team.astro)
// ---------------------------------------------------------------------------
// Add a member by adding an entry; nothing else needs editing.
//
//   name  – full name (shown as the heading)
//   role  – title under the name
//   bio   – a paragraph of biography, or an array of paragraphs
//   image – filename in src/assets/images/; omit it and the card renders a
//           neutral placeholder block instead of a photograph (all three
//           members currently have one)
// ---------------------------------------------------------------------------

export interface TeamMember {
  name: string;
  role: string;
  /** one paragraph, or several. */
  bio: string | string[];
  /** filename in src/assets/images/. Omit to render a neutral placeholder. */
  image?: string;
}

export const team: TeamMember[] = [
  {
    name: 'Adrien d’Ormesson',
    role: 'Co-Founder and Director',
    bio: [
      'Adrien brings extensive investment and transaction experience across the energy transition and industrial decarbonisation sectors.',
      'Before co-founding Maxwell, he was a Senior Investment Manager at Foresight Group, where he helped expand the firm’s infrastructure mandate into renewables, carbon management, and industrial efficiency.',
      'He began his career in investment banking in London before moving into real assets, where he developed a focus on complex, high-impact projects.',
    ],
    image: 'headshot-Adrien.jpg',
  },
  {
    name: 'Joe Davis',
    role: 'Co-Founder and Director',
    bio: [
      'Joe has 15 years of experience across infrastructure investment and advisory.',
      'Before founding Maxwell, he held senior roles at Foresight Group and the Pensions Infrastructure Platform, leading investments across energy generation, energy storage and flexibility, transport and social infrastructure sectors.',
      'His blend of advisory and buy-side experience has shaped a pragmatic and hands-on investment approach focused on capital-intensive climate businesses.',
    ],
    image: 'headshot-Joe.jpg',
  },
  {
    name: 'Grégoire Schimpff',
    role: 'Head of Debt Advisory',
    bio: [
      'Grégoire is a structured finance specialist with experience across the energy and climate infrastructure sectors. He has advised companies ranging from scale-ups to major energy groups on capital structure solutions, financing strategy and access to institutional capital.',
      'Before joining Maxwell, he held roles at Jefferies, Kepler Cheuvreux, HSBC and Société Générale where he developed a broad network of lenders and investors. His experience includes designing and implementing tailored capital structures and financing platforms, as well as structuring complex financing solutions to support capital-intensive businesses through growth and strategic development.',
    ],
    image: 'headshot-Gregoire.jpg',
  },
];
