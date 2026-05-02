/** Full work index for /work — edit slugs when case-study routes exist. */

export const workPageIntro = {
  kicker: 'Work',
  title: 'Things I’ve built or dug into',
  description:
    'A wider list than the homepage teaser — same tags and blurbs; deeper write-ups will show up here when they’re ready.',
};

export const workProjects = [
  {
    id: 'fw-1',
    slug: 'motion-sketches',
    title: 'Motion & generative sketches',
    description:
      'Interactive pieces — parameters you can feel, motion that stays calm instead of loud.',
    tags: ['Framer Motion', 'React', 'Design'],
  },
  {
    id: 'fw-2',
    slug: 'notebook-tools',
    title: 'Tools from real workflows',
    description:
      'Small apps and scripts that came from scratching my own itch — fewer clicks, clearer output.',
    tags: ['JavaScript', 'UI', 'Product'],
  },
  {
    id: 'fw-3',
    slug: 'figures-proofs',
    title: 'Figures, proofs, teaching notes',
    description:
      'Visuals for concepts that are easier to draw than to say — for talks, posts, or my own notes.',
    tags: ['Math', 'Illustration', 'SVG'],
  },
  {
    id: 'fw-4',
    slug: 'data-stories',
    title: 'Data & dashboards',
    description:
      'Turning noisy inputs into views you can scan — charts that explain a decision, not decorate a slide.',
    tags: ['React', 'Data viz', 'UX'],
  },
  {
    id: 'fw-5',
    slug: 'cli-experiments',
    title: 'CLI & small libraries',
    description:
      'Sharp-edged tools for repetitive jobs — mostly TypeScript, mostly for my own repos.',
    tags: ['TypeScript', 'Node', 'OSS'],
  },
];
