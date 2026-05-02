import { workProjects } from './workProjects';

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

/** First three entries from `workProjects` — homepage “Selected work” strip */
export const featuredWork = workProjects.slice(0, 3).map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  tags: p.tags,
  href: '/work',
}));

export const shortAbout = [
  'I’m most alive when a problem needs both sides: tight code and a layout that actually explains something.',
  'Most things I publish started ugly — notebooks, rough prototypes, and a lot of throwing things away.',
  'If that sounds familiar, we probably care about the same kind of craft.',
];

export const selectedWorkIntro = {
  kicker: 'Selected work',
  title: 'Worth opening first',
  description:
    'A short list — not everything I’ve built, just the pieces that show how I work.',
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
