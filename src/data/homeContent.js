/** Homepage — Petr Kuba. Edit projects and links as you ship real case studies. */

export const person = {
  fullName: 'Petr Kuba',
  firstName: 'Petr',
  lastName: 'Kuba',
};

export const siteIntro = {
  /** One line under the name */
  roleLine: 'Developer, designer, and the messy middle where math meets visuals.',
  lead:
    'I write software, shape interfaces, and chase ideas that sit between proof and intuition — tools, motion, and diagrams that make abstract things easier to see.',
};

/** Pull-quote panel beside the hero */
export const heroAside = {
  quote: 'Side projects, experiments, and builds I’d happily defend over coffee.',
  sub: 'No agency polish — just work that reflects how I think and what I like to make.',
};

export const shortAbout = [
  'I’m most alive when a problem needs both sides: tight code and a layout that actually explains something.',
  'Most things I publish started ugly — notebooks, rough prototypes, and a lot of throwing things away.',
  'If that sounds familiar, we probably care about the same kind of craft.',
];

/** Hub node: visual entry — spokes run from here to each topic block. */
export const thinkingMapEntry = {
  id: 'entry',
  title: 'Start here',
  line: 'Craft, curiosity, and shipping small things that add up.',
};

/**
 * Homepage — thinking map nodes (cluster layout on the section).
 * `connectsTo`: related nodes for subtle link hints (undirected edges, deduped when rendering).
 * `tech`: tools / stack hints for that area.
 */
export const thinkingBlocks = [
  {
    id: 'systems',
    title: 'Systems',
    connectsTo: ['frontend', 'ai'],
    tech: ['Node', 'Docker', 'PHP'],
    fragments: [
      { title: 'Designing API boundaries' },
      { title: 'Structuring data flow' },
      { title: 'Connecting services' },
    ],
  },
  {
    id: 'workflow',
    title: 'Workflow',
    connectsTo: ['systems', 'frontend'],
    tech: ['Git', 'GitHub', 'Bitbucket'],
    fragments: [
      { title: 'Iterative development process' },
      { title: 'Safe change management' },
      { title: 'Collaboration structure' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    connectsTo: ['systems', 'ai'],
    tech: ['React', 'TypeScript', 'Vite'],
    fragments: [
      { title: 'Building UI systems' },
      { title: 'Designing interaction flow' },
      { title: 'Balancing structure & feel' },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Automation',
    connectsTo: ['systems', 'frontend'],
    tech: ['Cursor', 'OpenAI'],
    fragments: [
      { title: 'Integrating AI into workflows' },
      { title: 'Prompt-driven development' },
      { title: 'Evaluating outputs & behavior' },
    ],
  },
  {
    id: 'logic',
    title: 'Problem Solving',
    connectsTo: ['systems', 'frontend', 'ai'],
    tech: ['TypeScript', 'Figma'],
    fragments: [
      { title: 'Breaking down complex problems' },
      { title: 'Designing algorithms & rules' },
      { title: 'Making systems predictable' },
    ],
  },
];

export const selectedWorkIntro = {
  kicker: 'How I work',
  title: 'Thinking map',
  description:
    'A loose map of where my head goes — related areas, not a roadmap. Hover a topic to see what tends to connect.',
};

export const aboutSnippetAside = {
  quote:
    'Same thread whether it’s a repo, a frame in Figma, or a diagram on a whiteboard: make the idea legible.',
  sub: 'This site is front-end only for now; deeper write-ups per project are on the way.',
};

/** Short mono key/value rows in the about aside — reads as a “spec strip” */
export const aboutSnippetFacts = [
  { key: 'Focus', value: 'Interfaces, tooling, visual explanations' },
  { key: 'Stack', value: 'React, TypeScript, Node' },
];
