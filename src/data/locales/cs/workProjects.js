/** Přehled práce pro /work */

export const workPageIntro = {
  kicker: 'Práce',
  title: 'Věci, které jsem stavěl nebo do kterých jsem šťoural',
  description:
    'Delší seznam než na úvodní stránce — stejné tagy a popisy; hlubší články přibudou, až budou hotové.',
};

export const workProjects = [
  {
    id: 'fw-1',
    slug: 'motion-sketches',
    title: 'Pohyb a generativní skici',
    description:
      'Interaktivní kousky — parametry, které „cítíte“, pohyb, který zůstane klidný místo křiku.',
    tags: ['Framer Motion', 'React', 'Design'],
  },
  {
    id: 'fw-2',
    slug: 'notebook-tools',
    title: 'Nástroje z reálného workflow',
    description:
      'Malé aplikace a skripty ze škrábání vlastního svědění — méně kliků, srozumitelnější výstup.',
    tags: ['JavaScript', 'UI', 'Produkt'],
  },
  {
    id: 'fw-3',
    slug: 'figures-proofs',
    title: 'Obrázky, důkazy, poznámky k výuce',
    description:
      'Vizuály pro věci, které je snáz nakreslit než říct — pro přednášky, články nebo vlastní poznámky.',
    tags: ['Matematika', 'Ilustrace', 'SVG'],
  },
  {
    id: 'fw-4',
    slug: 'data-stories',
    title: 'Data a přehledy',
    description:
      'Z hlučných vstupů do pohledu, který stihnete přečíst — grafy, které vysvětlí rozhodnutí, ne ozdobí slid.',
    tags: ['React', 'Data viz', 'UX'],
  },
  {
    id: 'fw-5',
    slug: 'cli-experiments',
    title: 'CLI a malé knihovny',
    description:
      'Ostré nástroje na opakující se práci — většinou TypeScript, většinou pro vlastní repa.',
    tags: ['TypeScript', 'Node', 'OSS'],
  },
];
