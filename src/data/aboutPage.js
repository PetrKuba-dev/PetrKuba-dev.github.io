/** Long-form about copy for /about-me — Petr Kuba. */

import { person } from './homeContent';

export const aboutPage = {
  kicker: 'About',
  title: `A bit more about ${person.firstName}`,
  lead:
    'I’m a developer and designer who keeps one foot in code and the other in how things look and read — including the math-flavoured bits that don’t fit in a ticket.',
  sections: [
    {
      id: 'story',
      heading: 'How I work',
      paragraphs: [
        'I like problems where the interface and the implementation argue with each other until something honest appears. That usually means sketching in Figma or on paper, breaking things in a repo, and rewriting until the mental model matches what’s on screen.',
        'I’m allergic to “we’ll fix it later” polish that never ships, but I’m also wary of pixel-perfect decks that never touch a user. The sweet spot is small, shippable slices with room to learn.',
      ],
    },
    {
      id: 'math-art',
      heading: 'Math, diagrams, and side quests',
      paragraphs: [
        'A lot of what I enjoy sits between explanation and play: a diagram that makes a lemma obvious, a tiny animation that shows why a trick works, or a script that draws something I’d otherwise scribble in the margin.',
        'That doesn’t mean every project is academic — it means I reach for clarity and structure even when the medium is a web app or a poster.',
      ],
    },
  ],
  closing:
    'If you’re building something that needs careful UI, honest technical trade-offs, or a visual pass that respects the underlying idea, I’d like to hear about it.',
};
