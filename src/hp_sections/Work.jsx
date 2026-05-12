import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import HomeStickyKicker from '../components/HomeStickyKicker';
import { useLocale } from '../i18n/LocaleProvider.jsx';
import { ArrowRight, ArrowLeft } from 'lucide-react';

function collectUndirectedEdges(blocks) {
  const seen = new Set();
  const edges = [];
  for (const b of blocks) {
    for (const targetId of b.connectsTo ?? []) {
      const lo = b.id < targetId ? b.id : targetId;
      const hi = b.id < targetId ? targetId : b.id;
      const key = `${lo}\0${hi}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ from: lo, to: hi });
    }
  }
  return edges;
}

function edgeKey(from, to) {
  return from < to ? `${from}:${to}` : `${to}:${from}`;
}

/** Soft curve between node centers — reads as a hint, not a diagram arrow. */
function curvedPath(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ox = (-dy / len) * 32;
  const oy = (dx / len) * 32;
  return `M ${x1} ${y1} Q ${mx + ox} ${my + oy} ${x2} ${y2}`;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const SKILL_TIER_ORDER = { core: 0, mid: 1, edge: 2 };

function skillTierClass(tier) {
  return tier === 'core' || tier === 'mid' || tier === 'edge' ? tier : 'edge';
}

export default function SelectedWork() {
  const { homeContent, localizedPath, ui } = useLocale();
  const { selectedWorkIntro, thinkingBlocks, thinkingMapEntry, allSkills = [] } = homeContent;

  const [skillsOpen, setSkillsOpen] = useState(false);
  const [mapHoverId, setMapHoverId] = useState(null);
  const [mapFocusId, setMapFocusId] = useState(null);
  const [mapDisclosedId, setMapDisclosedId] = useState(null);

  const sortedAllSkills = useMemo(() => {
    return [...allSkills].sort((a, b) => {
      const da = SKILL_TIER_ORDER[a.tier] ?? 99;
      const db = SKILL_TIER_ORDER[b.tier] ?? 99;
      if (da !== db) return da - db;
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });
  }, [allSkills]);

  const entryEdges = useMemo(() => {
    if (!thinkingMapEntry) return [];
    return thinkingBlocks.map((b) => ({ from: thinkingMapEntry.id, to: b.id }));
  }, [thinkingMapEntry, thinkingBlocks]);

  const thinkingEdgePairs = useMemo(() => {
    const blockPairs = collectUndirectedEdges(thinkingBlocks);
    return [...blockPairs, ...entryEdges];
  }, [thinkingBlocks, entryEdges]);

  const visualHighlight = mapFocusId ?? mapHoverId ?? mapDisclosedId;

  const mapRef = useRef(null);
  const sectionRef = useRef(null);
  const svgRef = useRef(null);
  const nodeRefs = useRef({});
  const pathRefs = useRef({});

  const [mapSize, setMapSize] = useState(null);

  const setNodeRef = useCallback((id, el) => {
    if (el) nodeRefs.current[id] = el;
    else delete nodeRefs.current[id];
  }, []);

  useEffect(() => {
    if (!mapDisclosedId) return undefined;
    const onPointerDown = (e) => {
      const t = e.target;
      if (t instanceof Node && mapRef.current?.contains(t)) return;
      setMapDisclosedId(null);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [mapDisclosedId]);

  const syncPaths = useCallback(() => {
    const root = mapRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

    const cr = root.getBoundingClientRect();
    const w = Math.round(cr.width);
    const h = Math.round(cr.height);
    if (w < 1 || h < 1) return;

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    for (const { from, to } of thinkingEdgePairs) {
      const pathEl = pathRefs.current[edgeKey(from, to)];
      if (!pathEl) continue;
      const a = nodeRefs.current[from];
      const b = nodeRefs.current[to];
      if (!a || !b) continue;
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const x1 = ar.left + ar.width / 2 - cr.left;
      const y1 = ar.top + ar.height / 2 - cr.top;
      const x2 = br.left + br.width / 2 - cr.left;
      const y2 = br.top + br.height / 2 - cr.top;
      pathEl.setAttribute('d', curvedPath(x1, y1, x2, y2));
    }
  }, [thinkingEdgePairs]);

  useLayoutEffect(() => {
    const root = mapRef.current;
    if (!root) return undefined;

    const measureSize = () => {
      const cr = root.getBoundingClientRect();
      const w = Math.round(cr.width);
      const h = Math.round(cr.height);
      if (w >= 1 && h >= 1) {
        setMapSize((prev) => (prev?.w === w && prev?.h === h ? prev : { w, h }));
      }
    };

    measureSize();
    syncPaths();

    const ro = new ResizeObserver(() => {
      measureSize();
      syncPaths();
    });
    ro.observe(root);

    const onWinResize = () => {
      measureSize();
      syncPaths();
    };
    window.addEventListener('resize', onWinResize);

    let postLayoutRaf = 0;
    postLayoutRaf = requestAnimationFrame(() => {
      measureSize();
      syncPaths();
      postLayoutRaf = requestAnimationFrame(() => {
        measureSize();
        syncPaths();
        postLayoutRaf = 0;
      });
    });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onWinResize);
      if (postLayoutRaf) cancelAnimationFrame(postLayoutRaf);
    };
  }, [syncPaths]);

  useLayoutEffect(() => {
    if (!mapSize?.w) return;
    syncPaths();
  }, [mapSize, syncPaths]);

  const handleNodeMouseLeave = useCallback((e) => {
    const next = e.relatedTarget;
    if (next instanceof Node && e.currentTarget.contains(next)) return;
    setMapHoverId(null);
  }, []);

  const handleMapFocusLeave = useCallback((e) => {
    const next = e.relatedTarget;
    if (next && mapRef.current?.contains(next)) return;
    setMapFocusId(null);
  }, []);

  const toggleDisclosure = useCallback((id) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) return;
    setMapDisclosedId((d) => (d === id ? null : id));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="selected-work"
      className="hp-section-selected-work hp-section-pad scroll-mt-24"
      aria-labelledby="selected-work-heading"
    >
      <HomeStickyKicker>{selectedWorkIntro.kicker}</HomeStickyKicker>

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl md:mb-24 lg:max-w-[42rem]">
          <h2
            id="selected-work-heading"
            className="site-section-title mt-0 text-3xl sm:mt-1 sm:text-4xl md:text-5xl lg:-translate-x-10 md:-translate-x-5 -translate-x-2"
          >
            {selectedWorkIntro.title}
          </h2>
          <p className="site-body site-prose-measure mt-5 text-ink/90">{selectedWorkIntro.description}</p>
        </div>

        {/* {sortedAllSkills.length > 0 ? (
          <div className="hp-all-skills">
            <div className="hp-all-skills__toggle-wrap">
              <button
                type="button"
                id="all-skills-toggle"
                className="hp-all-skills__toggle"
                aria-expanded={skillsOpen}
                aria-controls="all-skills-panel"
                onClick={() => setSkillsOpen((o) => !o)}
              >
                {skillsOpen ? <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden /> : <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />}
                {skillsOpen ? ui.workSection.allSkillsCollapse : ui.workSection.allSkillsExpand}
              </button>
            </div>
            <AnimatePresence initial={false}>
              {skillsOpen ? (
                <motion.div
                  key="all-skills-panel"
                  id="all-skills-panel"
                  role="region"
                  aria-labelledby="all-skills-panel-title"
                  initial={{ right: -20, opacity: 0 }}
                  animate={{ right: 0, opacity: 1 }}
                  exit={{ right: -20, opacity: 0 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-auto w-full absolute z-20 overflow-hidden"
                >
                  <div className="hp-all-skills__panel-row mx-auto max-w-6xl w-full min-w-0">
                    <div className="hp-all-skills__panel">
                      <div className="hp-all-skills__panel-chrome" aria-hidden />
                      <div className="hp-all-skills__panel-body">
                        <p id="all-skills-panel-title" className="hp-all-skills__panel-eyebrow">
                          {ui.workSection.allSkillsRegionLabel}
                        </p>
                        <ul className="hp-all-skills__cloud">
                          {sortedAllSkills.map((s) => (
                            <li key={s.name}>
                              <span className={`hp-all-skills__label hp-all-skills__label--${skillTierClass(s.tier)}`}>
                                {s.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null} */}

        <div
          ref={mapRef}
          className={`hp-thinking-map transition-all duration-200 ${skillsOpen ? 'blur-md' : ''}`}
          data-map-focus={visualHighlight || undefined}
        >
          {mapSize && mapSize.w > 0 && mapSize.h > 0 ? (
            <svg
              ref={svgRef}
              className="hp-thinking-map__svg"
              viewBox={`0 0 ${mapSize.w} ${mapSize.h}`}
              aria-hidden
              focusable="false"
            >
              {thinkingEdgePairs.map(({ from, to }) => {
                const k = edgeKey(from, to);
                const lit = Boolean(
                  visualHighlight && (from === visualHighlight || to === visualHighlight),
                );
                const dim = Boolean(visualHighlight && !lit);
                return (
                  <path
                    key={k}
                    ref={(el) => {
                      if (el) pathRefs.current[k] = el;
                      else delete pathRefs.current[k];
                    }}
                    d="M 0 0"
                    fill="none"
                    className={`hp-thinking-map__edge transition-all duration-fast ${lit ? 'hp-thinking-map__edge--lit' : ''} ${dim ? 'hp-thinking-map__edge--dim' : ''}`}
                  />
                );
              })}
            </svg>
          ) : null}

          <motion.ul
            className="hp-thinking-map__nodes"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {thinkingMapEntry ? (
              <li className="hp-thinking-map__cell hp-thinking-map__cell--entry">
                <motion.article
                  ref={(el) => setNodeRef(thinkingMapEntry.id, el)}
                  data-node-id={thinkingMapEntry.id}
                  data-map-active={visualHighlight === thinkingMapEntry.id ? 'true' : undefined}
                  className="hp-thinking-node hp-thinking-node--entry touch-none transition-all duration-fast"
                  aria-labelledby={`thinking-node-title-${thinkingMapEntry.id}`}
                  tabIndex={0}
                  onMouseEnter={() => setMapHoverId(thinkingMapEntry.id)}
                  onMouseLeave={handleNodeMouseLeave}
                  onFocus={() => setMapFocusId(thinkingMapEntry.id)}
                  onBlur={handleMapFocusLeave}
                >
                  <div className="hp-thinking-node__chrome hp-thinking-node__chrome--entry" aria-hidden />
                  <p className="hp-thinking-entry__eyebrow font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
                    {ui.workSection.entryEyebrow}
                  </p>
                  <h3
                    id={`thinking-node-title-${thinkingMapEntry.id}`}
                    className="hp-thinking-node__title hp-thinking-entry__title font-sans text-lg font-semibold tracking-tight text-ink sm:text-xl md:text-2xl"
                  >
                    {thinkingMapEntry.title}
                  </h3>
                  <p className="hp-thinking-entry__line site-body mt-2 text-sm text-ink/85">{thinkingMapEntry.line}</p>
                </motion.article>
              </li>
            ) : null}

            {thinkingBlocks.map((block, blockIndex) => {
              const detailsOpen = visualHighlight === block.id;
              return (
                <li
                  key={block.id}
                  className={`hp-thinking-map__cell hp-thinking-map__cell--${block.id}`}
                >
                  <motion.article
                    ref={(el) => setNodeRef(block.id, el)}
                    data-node-id={block.id}
                    data-map-active={detailsOpen ? 'true' : undefined}
                    className={`hp-thinking-node hp-thinking-node--topic touch-none transition-all duration-fast ${mapDisclosedId === block.id ? 'hp-thinking-node--disclosed' : ''}`}
                    aria-labelledby={`thinking-node-title-${block.id}`}
                    aria-expanded={detailsOpen}
                    tabIndex={0}
                    onMouseEnter={() => setMapHoverId(block.id)}
                    onMouseLeave={handleNodeMouseLeave}
                    onFocus={() => setMapFocusId(block.id)}
                    onBlur={handleMapFocusLeave}
                    onClick={() => toggleDisclosure(block.id)}
                  >
                    <div className="hp-thinking-node__chrome" aria-hidden />
                    <div className="hp-thinking-node__head">
                      <span className="hp-thinking-node__index" aria-hidden>
                        {String(blockIndex + 1).padStart(2, '0')}
                      </span>
                      <h3
                        id={`thinking-node-title-${block.id}`}
                        className="hp-thinking-node__title font-sans text-lg font-semibold tracking-tight text-ink sm:text-xl md:text-2xl"
                      >
                        {block.title}
                      </h3>
                    </div>
                    {block.summary ? (
                      <p className="hp-thinking-node__summary site-body text-sm text-ink/80">{block.summary}</p>
                    ) : null}
                    <div
                      className="hp-thinking-node__collapsible"
                      role="group"
                      aria-labelledby={`thinking-node-title-${block.id}`}
                      aria-hidden={!detailsOpen}
                    >
                      {block.tech?.length ? (
                        <ul className="hp-thinking-node__tech" aria-label={ui.workSection.toolsAriaLabel}>
                          {block.tech.map((t) => (
                            <li key={`${block.id}-${t}`}>
                              <span className="hp-thinking-node__tech-pill">{t}</span>
                              {/* {block.tech.indexOf(t) < block.tech.length - 1 ? <span className="px-2 text-ink/50" aria-hidden>·</span> : null} */}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {/* <ul className="hp-thinking-node__items">
                        {block.tech.map((f) => (
                          // <li key={`${block.id}-${f.title}`} className="hp-thinking-node__item">
                          //   <span className="hp-thinking-node__prefix" aria-hidden>
                          //     ·
                          //   </span>
                          //   <span className="hp-thinking-node__text">{f.title}</span>
                          // </li>
                        ))}
                      </ul> */}
                    </div>
                  </motion.article>
                </li>
              );
            })}
          </motion.ul>
        </div>

        {selectedWorkIntro.judgmentNote ? (
          <p className="hp-thinking-map__judgment site-body mx-auto mt-10 max-w-2xl text-sm text-muted md:mt-12">
            {selectedWorkIntro.judgmentNote}
          </p>
        ) : null}

        <p className="mt-12 text-center font-sans text-sm text-muted md:mt-14 md:text-left">
          <NavLink to={localizedPath('/work')} className="site-text-link">
            {ui.workSection.seeWriteups}
          </NavLink>
        </p>
      </div>
    </section>
  );
}
