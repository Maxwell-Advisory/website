// ---------------------------------------------------------------------------
// TEAM — the /team carousel (src/pages/team.astro)
// ---------------------------------------------------------------------------
// Add a member by adding an entry; nothing else needs editing.
//
//   name  – full name (shown as the heading)
//   role  – title under the name
//   bio   – one paragraph of biography
//   image – filename in src/assets/images/; omit it and the card renders a
//           neutral placeholder block instead of a photograph
// ---------------------------------------------------------------------------

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  /** filename in src/assets/images/. Omit to render a neutral placeholder. */
  image?: string;
}

export const team: TeamMember[] = [
  {
    name: 'Adrien d’Ormesson',
    role: 'Co-Founder and Director',
    bio: 'Adrien brings extensive investment and transaction experience across the energy transition and industrial decarbonisation sectors. Before co-founding Maxwell, he was a Senior Investment Manager at Foresight Group, where he helped expand the firm’s infrastructure mandate into renewables, carbon management, and industrial efficiency. He began his career in investment banking in London before moving into real assets, where he developed a focus on complex, high-impact projects.',
    image: 'Photo-couleur-Adrien.jpeg',
  },
  {
    name: 'Joe Davis',
    role: 'Co-Founder and Director',
    bio: 'Joe has more than a decade of experience across infrastructure investment and advisory. Before founding Maxwell, he held senior roles at Foresight Group and the Pensions Infrastructure Platform (PiP), leading investments across energy, storage, hydrogen, and social infrastructure sectors. His blend of advisory and buy-side experience has shaped a pragmatic and hands-on investment approach focused on capital-intensive climate businesses.',
    image: 'Photo-couleur-Joe.jpeg',
  },
  {
    name: 'Grégoire Schimpff',
    role: 'Head of Debt Advisory',
    bio: 'PLACEHOLDER — biography to follow. Replace this paragraph, and add a portrait to src/assets/images/ and name it in the `image` field, when they are ready.',
  },
];
