import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { aboutSnippetAside, shortAbout } from '../data/homeContent';

export default function About() {
  return (
    <section
      id="about-snippet"
      className="scroll-mt-24 px-4 py-20 sm:px-6 md:px-10 md:py-28"
      aria-labelledby="about-snippet-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-sm tracking-[0.14em] text-muted uppercase">
            About
          </p>
          <h2 id="about-snippet-heading" className="mt-3 font-serif text-4xl text-ink md:text-5xl">
            In a nutshell
          </h2>
          <div className="mt-8 space-y-5 font-sans text-lg leading-relaxed text-ink">
            {shortAbout.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <NavLink
            to="/about-me"
            className="mt-10 inline-flex items-center gap-2 font-sans text-sm font-medium text-accent transition-colors hover:text-ink"
          >
            Full about page
            <ArrowRight className="h-4 w-4" aria-hidden />
          </NavLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-soft border border-border bg-paper-deep/50 p-6 lg:sticky lg:top-28"
        >
          <p className="font-serif text-xl leading-snug text-ink">{aboutSnippetAside.quote}</p>
          <p className="mt-4 font-sans text-sm leading-relaxed text-muted">{aboutSnippetAside.sub}</p>
        </motion.div>
      </div>
    </section>
  );
}
