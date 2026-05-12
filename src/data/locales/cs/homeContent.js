/** Domovská stránka — Petr Kuba. */

export const person = {
  fullName: 'Petr Kuba',
  firstName: 'Petr',
  lastName: 'Kuba',
};

export const siteIntro = {
  roleLine: 'Vývojář, designér a ten neuspořádaný prostor, kde se potkává matematika s obrazem.',
  lead:
    'Píšu software, tvaruju rozhraní a honím nápady, které stojí mezi důkazem a intuicí — nástroje, pohyb a diagramy, díky kterým je abstraktní věci snáz vidět.',
};

export const heroAside = {
  quote: 'Vedlejší projekty, experimenty a věci, které bych klidně obhajoval u kávy.',
  sub: 'Žádná agenturní dokonalost — jen práce, která odráží, jak přemýšlím a co rád tvořím.',
};

export const shortAbout = [
  'Nejvíc mě baví problémy, kde potřebujete obojí: čistý kód a layout, který něco opravdu vysvětlí.',
  'Většina toho, co zveřejním, začala ošklivě — zápisky, hrubé prototypy a spousta vyhozených pokusů.',
  'Když vám to zní povědomě, pravděpodobně nám jde o stejný druh řemesla.',
];

export const thinkingMapEntry = {
  id: 'entry',
  title: 'Začít tady',
  line: 'Řemeslo, zvědavost a posílání malých věcí, které se nasčítají.',
};

export const thinkingBlocks = [
  {
    id: 'systems',
    title: 'Systémy',
    connectsTo: ['frontend', 'ai'],
    tech: ['Node', 'Docker', 'PHP'],
    fragments: [
      { title: 'Navrhování hranic API' },
      { title: 'Strukturování toku dat' },
      { title: 'Propojování služeb' },
    ],
  },
  {
    id: 'workflow',
    title: 'Workflow',
    connectsTo: ['systems', 'frontend'],
    tech: ['Git', 'GitHub', 'Bitbucket'],
    fragments: [
      { title: 'Iterativní vývoj' },
      { title: 'Bezpečná správa změn' },
      { title: 'Struktura spolupráce' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    connectsTo: ['systems', 'ai'],
    tech: ['React', 'TypeScript', 'Vite'],
    fragments: [
      { title: 'Stavění UI systémů' },
      { title: 'Návrh interakčního toku' },
      { title: 'Balanc struktury a pocitu' },
    ],
  },
  {
    id: 'ai',
    title: 'AI a automatizace',
    connectsTo: ['systems', 'frontend'],
    tech: ['Cursor', 'OpenAI'],
    fragments: [
      { title: 'Začleňování AI do workflow' },
      { title: 'Vývoj řízený prompty' },
      { title: 'Hodnocení výstupů a chování' },
    ],
  },
  {
    id: 'logic',
    title: 'Řešení problémů',
    connectsTo: ['systems', 'frontend', 'ai'],
    tech: ['TypeScript', 'Figma'],
    fragments: [
      { title: 'Rozkládání složitých problémů' },
      { title: 'Návrh algoritmů a pravidel' },
      { title: 'Predikovatelnost systémů' },
    ],
  },
];

export const selectedWorkIntro = {
  kicker: 'Jak pracuju',
  title: 'Mapa myšlení',
  description:
    'Volná mapa toho, kam mě hlava táhne — související oblasti, ne roadmapa. Najetím na téma uvidíte, co se obvykle propojuje.',
};

/** Úplný „mrak“ dovedností (rozbalení pod mapou). `tier`: core / mid / edge — vizuální důraz. */
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
    'Stejná nit, ať už jde o repozitář, snímek ve Figmě nebo diagram na tabuli: udělejte z nápadu něco čitelného.',
  sub: 'Zatím je tenhle web čistě front-end; delší texty k projektům jsou v přípravě.',
};

export const aboutSnippetFacts = [
  { key: 'Zaměření', value: 'Rozhraní, nástroje, vizuální vysvětlení' },
  { key: 'Stack', value: 'React, TypeScript, Node' },
];
