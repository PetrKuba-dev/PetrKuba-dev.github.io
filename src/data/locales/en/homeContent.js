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

/** Hub node: thesis — SVG spokes connect this to each topic block. */
export const thinkingMapEntry = {
  id: 'entry',
  title: 'How I steer',
  line:
    'I reach for the smallest thing that makes the next decision obvious — then tighten loops until the system explains itself. Polish last; legibility first.',
};

/**
 * Homepage — thinking map nodes (cluster layout on the section).
 * `connectsTo`: related nodes for subtle link hints (undirected edges, deduped when rendering).
 * `summary`: one line always visible on the card; `fragments` show on hover, focus, or tap.
 * `tech`: optional tools / stack hints (shown with fragments).
 */
export const thinkingBlocks = [
  {
    id: 'clarity',
    title: 'Clarity',
    summary: 'Name the real constraint before the implementation detail.',
    connectsTo: ['systems'],
    tech: ['Thinking', 'Product Sense'],
  },

  {
    id: 'systems',
    title: 'Systems',
    summary: 'Seams, flows, and failure modes you can actually run.',
    connectsTo: ['foundations', 'automation'],
    tech: ['Node', 'Docker', 'PHP'],
  },

  {
    id: 'foundations',
    title: 'Foundations',
    summary: 'Defaults and invariants the rest of the stack can lean on.',
    connectsTo: ['performance'],
    tech: ['PHP', 'MySQL', 'Redis'],
  },

  {
    id: 'automation',
    title: 'Automation',
    summary: 'Remove repetition — including in how I think about the work.',
    connectsTo: ['performance', 'refinement'],
    tech: ['OpenAI', 'Node', 'Scripts'],
  },

  {
    id: 'performance',
    title: 'Performance',
    summary: 'Speed is a feature — measured, not guessed.',
    connectsTo: ['refinement'],
    tech: ['Profiling', 'Caching', 'Optimization'],
  },

  {
    id: 'refinement',
    title: 'Refinement',
    summary: 'Iterate where feedback is real — not where vanity is loud.',
    connectsTo: ['clarity'],
    tech: ['Iteration', 'UX', 'Analytics'],
  },
];

export const selectedWorkIntro = {
  kicker: 'How I work',
  title: 'Thinking map',
  description:
    'Six lenses I keep coming back to — not a process diagram. Hover or focus a topic for detail; on touch, tap a card to expand.',
  judgmentNote:
    'What I rarely optimize for first: raw feature count, hype-driven rewrites, or “perfect” abstractions nobody can change under pressure.',
};

/**
 * Full skills cloud (disclosure under the thinking map).
 * `tier`: visual weight — core (strong), mid, edge (subtle). Names are usually English across locales.
 */
export const allSkills = [
  { name: 'JavaScript', tier: 'core'},
  { name: 'jQuery', tier: 'core'},
  { name: 'React', tier: 'core'},
  { name: 'TypeScript', tier: 'core'},
  { name: 'Git', tier: 'core'},
  { name: 'PHP', tier: 'core'},
  { name: 'Nette', tier: 'core'},
  { name: 'WordPress', tier: 'core'},
  { name: 'MySQL', tier: 'core'},
  { name: 'HTML', tier: 'core'},
  { name: 'CSS', tier: 'core'},
  { name: 'Cursor', tier: 'core'},
  { name: 'Framer Motion', tier: 'mid'},
  { name: 'Tailwind', tier: 'mid'},
  { name: 'Docker', tier: 'mid'},
  { name: 'Vite', tier: 'mid'},
  { name: 'Figma', tier: 'mid'},
  { name: 'OpenAI', tier: 'mid'},
  { name: 'REST APIs', tier: 'mid'},
  { name: 'Powershell', tier: 'edge'},
];

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
