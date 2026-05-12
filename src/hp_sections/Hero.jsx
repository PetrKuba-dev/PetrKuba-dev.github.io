import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowDownRight } from 'lucide-react';
// import ElasticFieldGridBackground from '../components/ElasticFieldGridBackground';


import HomeStickyKicker from '../components/HomeStickyKicker';
import { useLocale } from '../i18n/LocaleProvider.jsx';
import { useTheme } from '../theme/ThemeProvider.jsx';

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
    transition: { delay: 0.1 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ElasticFieldGridBackground = lazy(() =>
  import('../components/ElasticFieldGridBackground'),
);

/** Wait until hero stagger motion settles before fetching the field chunk (approx. max delay + duration). */
const FIELD_DEFER_MS = 1150;
/** If the main thread never goes idle, still load within this window after `FIELD_DEFER_MS`. */
const FIELD_IDLE_TIMEOUT_MS = 3500;

/** Below Tailwind `md` (768px): static grid only; at `md` and up: animated elastic field. */
const HERO_FIELD_STATIC_MQ = '(max-width: 767px)';

function useHeroElasticFieldIsStatic() {
  const [isStatic, setIsStatic] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(HERO_FIELD_STATIC_MQ).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(HERO_FIELD_STATIC_MQ);
    const sync = () => setIsStatic(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return isStatic;
}

export default function Hero() {
  const { isDark } = useTheme();
  const { homeContent, localizedPath, ui } = useLocale();
  const { person, siteIntro, heroAside } = homeContent;
  const [fieldReady, setFieldReady] = useState(false);
  /** RAF canvas loop starts after opacity fade-in completes — saves main-thread work during intro. */
  const [fieldLoopEnabled, setFieldLoopEnabled] = useState(false);
  const fieldIsStatic = useHeroElasticFieldIsStatic();

  useEffect(() => {
    let cancelled = false;
    let idleId = null;

    const delayTimer = window.setTimeout(() => {
      const schedule = () => {
        if (!cancelled) setFieldReady(true);
      };
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(schedule, {
          timeout: FIELD_IDLE_TIMEOUT_MS,
        });
      } else {
        window.setTimeout(schedule, 0);
      }
    }, FIELD_DEFER_MS);

    return () => {
      cancelled = true;
      clearTimeout(delayTimer);
      if (idleId != null && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <section id="hero" className="hp-hero-pad relative" aria-labelledby="hero-heading">
      {fieldReady && (
        <Suspense>
          {/* Outer shell fills the hero; inner motion stays `relative` + `h-full` for stable field sizing. */}
          <div className="pointer-events-none   absolute inset-0 z-[1] min-h-0 w-full overflow-visible">
            <motion.div
              className="relative z-[1] h-full min-h-0 w-full overflow-visible"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              onAnimationStart={() => setFieldLoopEnabled(true)}
            >
              {fieldIsStatic ? (
                <ElasticFieldGridBackground
                  className="z-[1]"
                  cellSize={50}
                  maxLinkDistance={150}
                  maxNeighbors={6}
                  mouseInfluence={false}
                  isStatic={false}
                  runLoop={fieldLoopEnabled}
                  maxDpr={3}
                  isDark={isDark}
                />
              ) : (
                <ElasticFieldGridBackground
                  className="z-[1]"
                  isStatic={false}
                  runLoop={fieldLoopEnabled}
                  maxDpr={1.25}
                  isDark={isDark}
                />
              )}
            </motion.div>
          </div>
        </Suspense>
      )}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
        <div className="absolute -left-28 top-8 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -right-12 top-24 h-56 w-56 rounded-full bg-paper-deep/50 blur-2xl" />
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
        {person.fullName}
        {ui.hero.stickyKickerEmDash}
        {ui.hero.stickyKickerTail}
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
              className="font-sans text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:leading-[1.04] md:text-7xl md:leading-[1.03] lg:text-8xl lg:leading-[1.02]"
            >
              <span className="block">{person.firstName}</span>
              <span className="mt-1 block sm:mt-2">{person.lastName}</span>
            </motion.h1>
            {/* <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="hp-hero-role-shell relative z-10 mt-8 sm:mt-9 md:ml-6 ml-3"
            >
              <span className="hp-hero-prompt" aria-hidden>
                ~
              </span>
              <TypewriterLine text={siteIntro.roleLine} className="hp-hero-role-line relative" />
            </motion.div> */}
            <motion.p
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="site-body site-prose-measure mt-[2rem] sm:mt-[10rem]"
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
              <NavLink to={localizedPath('/work')} className="site-btn-primary">
                {ui.hero.selectedWorkCta}
                <ArrowDownRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              </NavLink>
              <a href="#selected-work" className="site-text-link-subtle">
                {ui.hero.jumpToHighlights}
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
