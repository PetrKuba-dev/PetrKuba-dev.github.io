import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { aboutPage } from '../data/aboutPage';

const sectionMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AboutMe() {
  return (
    <div className="bg-paper">
      <div className="px-4 sm:px-6 md:px-10 pb-20 pt-16 md:pb-28 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <motion.header
            custom={0}
            variants={sectionMotion}
            initial="hidden"
            animate="visible"
            className="max-w-3xl border-b border-border pb-12"
          >
            <p className="font-sans text-sm font-medium uppercase tracking-[0.14em] text-muted">
              {aboutPage.kicker}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink md:text-5xl">
              {aboutPage.title}
            </h1>
            <p className="mt-6 font-sans text-xl leading-relaxed text-ink md:text-2xl">{aboutPage.lead}</p>
          </motion.header>

          <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
            <div className="space-y-14">
              {aboutPage.sections.map((section, index) => (
                <motion.section
                  key={section.id}
                  custom={index + 1}
                  variants={sectionMotion}
                  initial="hidden"
                  animate="visible"
                  aria-labelledby={`about-${section.id}`}
                >
                  <h2
                    id={`about-${section.id}`}
                    className="font-serif text-2xl font-medium text-ink md:text-3xl"
                  >
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-4 font-sans text-lg leading-relaxed text-muted">
                    {section.paragraphs.map((p, j) => (
                      <p key={`${section.id}-${j}`}>{p}</p>
                    ))}
                  </div>
                </motion.section>
              ))}

              <motion.p
                custom={aboutPage.sections.length + 1}
                variants={sectionMotion}
                initial="hidden"
                animate="visible"
                className="font-sans text-lg leading-relaxed text-ink"
              >
                {aboutPage.closing}
              </motion.p>

              <motion.div
                custom={aboutPage.sections.length + 2}
                variants={sectionMotion}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-soft bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Get in touch
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </NavLink>
              </motion.div>
            </div>

            <motion.aside
              custom={2}
              variants={sectionMotion}
              initial="hidden"
              animate="visible"
              className="h-fit rounded-soft border border-border bg-paper-deep/50 p-6 lg:sticky lg:top-28"
            >
              <p className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Colophon
              </p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
                Built with React, Vite, Tailwind, and Framer Motion — front-end only for now, content in
                plain JS modules so it stays easy to edit.
              </p>
            </motion.aside>
          </div>
        </div>
      </div>
    </div>
  );
}
