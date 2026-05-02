import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowDownRight } from 'lucide-react';

import HomeStickyKicker from '../components/HomeStickyKicker';
import { heroAside, person, siteIntro } from '../data/homeContent';

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Types `text` one character at a time after `startDelayMs`.
 * Each keystroke waits a random duration in [minCharDelayMs, maxCharDelayMs],
 * with slight extra pause after punctuation and spaces so it feels hand-typed.
 */
function TypewriterLine({
  text,
  className,
  startDelayMs = 450,
  minCharDelayMs = 52,
  maxCharDelayMs = 130,
}) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId;

    const step = (count) => {
      if (cancelled) return;
      setShown(text.slice(0, count));
      if (count >= text.length) {
        setDone(true);
        return;
      }
      const lastChar = count > 0 ? text[count - 1] : '';
      let extra = 0;
      if (lastChar && ',.;:—'.includes(lastChar)) {
        extra = randomBetween(90, 260);
      } else if (lastChar === ' ') {
        extra = randomBetween(18, 65);
      }
      const delay = randomBetween(minCharDelayMs, maxCharDelayMs) + extra;
      timeoutId = setTimeout(() => step(count + 1), delay);
    };

    timeoutId = setTimeout(() => step(1), startDelayMs);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [text, startDelayMs, minCharDelayMs, maxCharDelayMs]);

  return (
    <p className={`relative ${className}`}>
      <span className="sr-only">{text}</span>
      <span className="invisible block select-none" aria-hidden>
        {text}
      </span>
      <span className="absolute left-0 top-0 w-full text-left" aria-hidden="true">
        {shown}
        {!done && (
          <span
            className="ml-px inline-block h-[1.15em] w-px translate-y-px bg-current opacity-80 motion-safe:animate-pulse"
            aria-hidden
          />
        )}
      </span>
    </p>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="hp-hero-pad relative" aria-labelledby="hero-heading">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-28 top-8 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -right-12 top-24 h-56 w-56 rounded-full bg-paper-deep blur-2xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-accent-soft/30 blur-2xl" />
      </div>

      <HomeStickyKicker
        motionProps={{
          custom: 0,
          variants: fadeUp,
          initial: 'hidden',
          animate: 'visible',
        }}
      >
        {person.fullName} — portfolio
      </HomeStickyKicker>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,280px)] lg:items-end lg:gap-16">
          <div className="relative z-10">
            <motion.h1
              id="hero-heading"
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-sans text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl sm:leading-[1.04] md:text-6xl md:leading-[1.03] lg:text-7xl lg:leading-[1.02]"
            >
              <span className="block">{person.firstName}</span>
              <span className="mt-1 block sm:mt-2">{person.lastName}</span>
            </motion.h1>
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="hp-hero-role-shell relative z-10 mt-8 sm:mt-9"
            >
              <span className="hp-hero-prompt" aria-hidden>
                ~
              </span>
              <TypewriterLine text={siteIntro.roleLine} className="hp-hero-role-line relative" />
            </motion.div>
            <motion.p
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="site-body site-prose-measure mt-6 sm:mt-7"
            >
              {siteIntro.lead}
            </motion.p>

            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <NavLink to="/work" className="site-btn-primary">
                Selected work
                <ArrowDownRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              </NavLink>
              <a href="#selected-work" className="site-text-link-subtle">
                Jump to highlights
              </a>
            </motion.div>
          </div>

          <motion.aside
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative z-10 border-l border-border-default pl-6 lg:ml-2 lg:pb-1 lg:pl-8"
          >
            <p className="font-sans text-lg font-normal leading-snug text-ink">{heroAside.quote}</p>
            <p className="mt-4 font-sans text-sm leading-relaxed text-muted">{heroAside.sub}</p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
