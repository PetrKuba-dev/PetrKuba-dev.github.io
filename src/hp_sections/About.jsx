import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import HomeStickyKicker from '../components/HomeStickyKicker';
import { aboutSnippetAside, aboutSnippetFacts, shortAbout } from '../data/homeContent';

export default function About() {
  return (
    <section
      id="about-snippet"
      className="hp-section-about hp-section-pad scroll-mt-24"
      aria-labelledby="about-snippet-heading"
    >
      <HomeStickyKicker>About</HomeStickyKicker>

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(260px,300px)] lg:items-start lg:gap-x-14 lg:gap-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            id="about-snippet-heading"
            className="site-section-title mt-0 text-3xl sm:mt-1 sm:text-4xl md:text-5xl"
          >
            In a nutshell
          </h2>
          <div className="site-prose-measure mt-8 space-y-6 font-sans text-lg font-normal leading-relaxed text-ink md:text-[1.125rem] md:leading-[1.7]">
            {shortAbout.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <NavLink
            to="/about-me"
            className="site-text-link mt-10 inline-flex items-center gap-2"
          >
            Full about page
            <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          </NavLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-card border border-border-default bg-paper-deep/55 p-6 shadow-card transition-[border-color,box-shadow] duration-200 ease-out hover:border-accent/25 hover:shadow-card-hover lg:-translate-y-1 lg:sticky lg:top-[calc(var(--header-sticky-offset)+0.75rem)] lg:p-7"
        >
          <p className="font-sans text-xl leading-snug text-ink">{aboutSnippetAside.quote}</p>
          {aboutSnippetFacts.length > 0 && (
            <dl className="site-about-facts">
              {aboutSnippetFacts.map(({ key, value }) => (
                <div key={key} className="site-about-fact-row">
                  <dt className="site-about-fact-key">{key}</dt>
                  <dd className="site-about-fact-val">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-4 font-sans text-sm leading-relaxed text-muted">{aboutSnippetAside.sub}</p>
        </motion.div>
      </div>
    </section>
  );
}
