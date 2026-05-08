import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import HomeStickyKicker from '../components/HomeStickyKicker';
import { selectedWorkIntro, thinkingBlocks, thinkingMapEntry } from '../data/homeContent';

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

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SelectedWork() {
  const mapRef = useRef(null);
  const nodeRefs = useRef({});
  const [geom, setGeom] = useState({ w: 0, h: 0, edges: [] });
  const [focusId, setFocusId] = useState(null);

  const setNodeRef = useCallback((id, el) => {
    if (el) nodeRefs.current[id] = el;
    else delete nodeRefs.current[id];
  }, []);

  const measure = useCallback(() => {
    const root = mapRef.current;
    if (!root) return;

    const cr = root.getBoundingClientRect();
    const w = cr.width;
    const h = cr.height;
    if (w < 1 || h < 1) return;

    const blockPairs = collectUndirectedEdges(thinkingBlocks);
    const entryPairs = thinkingBlocks.map((b) => ({
      from: thinkingMapEntry.id,
      to: b.id,
    }));
    const pairs = [...blockPairs, ...entryPairs];

    const edges = pairs
      .map(({ from, to }) => {
        const a = nodeRefs.current[from];
        const b = nodeRefs.current[to];
        if (!a || !b) return null;
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        const x1 = ar.left + ar.width / 2 - cr.left;
        const y1 = ar.top + ar.height / 2 - cr.top;
        const x2 = br.left + br.width / 2 - cr.left;
        const y2 = br.top + br.height / 2 - cr.top;
        return { from, to, d: curvedPath(x1, y1, x2, y2) };
      })
      .filter(Boolean);

    setGeom({ w, h, edges });
  }, []);

  useLayoutEffect(() => {
    measure();
    const root = mapRef.current;
    if (!root) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    const entryEl = nodeRefs.current[thinkingMapEntry.id];
    if (entryEl) ro.observe(entryEl);
    thinkingBlocks.forEach((b) => {
      const el = nodeRefs.current[b.id];
      if (el) ro.observe(el);
    });

    window.addEventListener('resize', measure);
    const t = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(measure);
    });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.cancelAnimationFrame(t);
    };
  }, [measure]);

  const activate = useCallback((id) => {
    setFocusId(id);
  }, []);

  const deactivate = useCallback(() => {
    setFocusId(null);
  }, []);

  const onNodeBlur = useCallback((e) => {
    const next = e.relatedTarget;
    if (next && e.currentTarget.contains(next)) return;
    setFocusId(null);
  }, []);

  return (
    <section
      id="selected-work"
      className="hp-section-selected-work hp-section-pad scroll-mt-24"
      aria-labelledby="selected-work-heading"
    >
      <HomeStickyKicker>{selectedWorkIntro.kicker}</HomeStickyKicker>

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl md:mb-14 lg:max-w-[42rem]">
          <h2
            id="selected-work-heading"
            className="site-section-title mt-0 text-3xl sm:mt-1 sm:text-4xl md:text-5xl lg:-translate-x-10 md:-translate-x-5 -translate-x-2"
          >
            {selectedWorkIntro.title}
          </h2>
          <p className="site-body site-prose-measure mt-5 text-ink/90">{selectedWorkIntro.description}</p>
        </div>

        <div
          ref={mapRef}
          className={`hp-thinking-map ${focusId ? 'hp-thinking-map--focus' : ''}`}
        >
          {geom.w > 0 && geom.h > 0 ? (
            <svg
              className="hp-thinking-map__svg"
              viewBox={`0 0 ${geom.w} ${geom.h}`}
              aria-hidden
              focusable="false"
            >
              {geom.edges.map((e) => {
                const touchesFocus =
                  focusId && (e.from === focusId || e.to === focusId);
                const lit = Boolean(touchesFocus);
                const dim = Boolean(focusId && !touchesFocus);
                return (
                  <path
                    key={`${e.from}-${e.to}`}
                    d={e.d}
                    fill="none"
                    className={`hp-thinking-map__edge ${lit ? 'hp-thinking-map__edge--lit' : ''} ${dim ? 'hp-thinking-map__edge--dim' : ''}`}
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
            <motion.li
              variants={item}
              className="hp-thinking-map__cell hp-thinking-map__cell--entry"
            >
              <article
                ref={(el) => setNodeRef(thinkingMapEntry.id, el)}
                className={`hp-thinking-node hp-thinking-node--entry ${focusId === thinkingMapEntry.id ? 'hp-thinking-node--active' : ''} ${focusId && focusId !== thinkingMapEntry.id ? 'hp-thinking-node--muted' : ''}`}
                aria-labelledby={`thinking-node-title-${thinkingMapEntry.id}`}
                tabIndex={0}
                // onMouseEnter={() => activate(thinkingMapEntry.id)}
                // onMouseLeave={deactivate}
                // onFocus={() => activate(thinkingMapEntry.id)}
                // onBlur={onNodeBlur}
              >
                <div className="hp-thinking-node__chrome hp-thinking-node__chrome--entry" aria-hidden />
                <p className="hp-thinking-entry__eyebrow font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Entry
                </p>
                <h3
                  id={`thinking-node-title-${thinkingMapEntry.id}`}
                  className="hp-thinking-node__title hp-thinking-entry__title font-sans text-lg font-semibold tracking-tight text-ink sm:text-xl md:text-2xl"
                >
                  {thinkingMapEntry.title}
                </h3>
                <p className="hp-thinking-entry__line site-body mt-2 text-sm text-ink/85">{thinkingMapEntry.line}</p>
              </article>
            </motion.li>

            {thinkingBlocks.map((block) => (
              <motion.li
                key={block.id}
                variants={item}
                className={`hp-thinking-map__cell hp-thinking-map__cell--${block.id}`}
              >
                <article
                  ref={(el) => setNodeRef(block.id, el)}
                  className={`hp-thinking-node ${focusId === block.id ? 'hp-thinking-node--active' : ''} ${focusId && focusId !== block.id ? 'hp-thinking-node--muted' : ''}`}
                  aria-labelledby={`thinking-node-title-${block.id}`}
                  tabIndex={0}
                  onMouseEnter={() => activate(block.id)}
                  onMouseLeave={deactivate}
                  onFocus={() => activate(block.id)}
                  onBlur={onNodeBlur}
                >
                  <div className="hp-thinking-node__chrome" aria-hidden />
                  <h3
                    id={`thinking-node-title-${block.id}`}
                    className="hp-thinking-node__title font-sans text-lg font-semibold tracking-tight text-ink sm:text-xl md:text-2xl"
                  >
                    {block.title}
                  </h3>
                  {block.tech?.length ? (
                    <ul className="hp-thinking-node__tech" aria-label="Tools & technologies">
                      {block.tech.map((t) => (
                        <li key={`${block.id}-${t}`}>
                          <span className="hp-thinking-node__tech-pill">{t}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <ul className="hp-thinking-node__items">
                    {block.fragments.map((f) => (
                      <li key={`${block.id}-${f.title}`} className="hp-thinking-node__item">
                        <span className="hp-thinking-node__prefix" aria-hidden>
                          ·
                        </span>
                        <span className="hp-thinking-node__text">{f.title}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <p className="mt-12 text-center font-sans text-sm text-muted md:mt-14 md:text-left">
          <NavLink to="/work" className="site-text-link">
            See project write-ups
          </NavLink>
        </p>
      </div>
    </section>
  );
}
