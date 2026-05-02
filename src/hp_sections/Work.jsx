import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import { featuredWork, selectedWorkIntro } from '../data/homeContent';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SelectedWork() {
  return (
    <section
      id="selected-work"
      className="scroll-mt-24 border-t border-border bg-paper-deep/40 px-4 py-20 sm:px-6 md:px-10 md:py-28"
      aria-labelledby="selected-work-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl md:mb-16">
          <p className="font-sans text-sm tracking-[0.14em] text-muted uppercase">
            {selectedWorkIntro.kicker}
          </p>
          <h2 id="selected-work-heading" className="mt-3 font-serif text-4xl text-ink md:text-5xl">
            {selectedWorkIntro.title}
          </h2>
          <p className="mt-4 max-w-xl font-sans text-muted">{selectedWorkIntro.description}</p>
        </div>

        <motion.ul
          className="flex flex-col gap-6 md:gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {featuredWork.map((project, index) => (
            <motion.li key={project.id} variants={item}>
              <NavLink
                to={project.href}
                className={`group flex flex-col gap-4 rounded-soft border border-border bg-paper p-6 transition-[border-color,box-shadow] hover:border-accent/45 hover:shadow-[0_12px_40px_-12px_rgb(42_38_36_/_0.12)] md:flex-row md:items-start md:justify-between md:gap-10 md:p-8 ${
                  index === 0 ? 'md:min-h-[11rem]' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4 md:block">
                    <h3 className="font-serif text-2xl text-ink transition-colors group-hover:text-accent md:text-3xl">
                      {project.title}
                    </h3>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-accent md:hidden"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-3 font-sans text-base leading-relaxed text-muted md:max-w-xl">
                    {project.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-block rounded-full border border-border bg-paper-deep/90 px-3 py-1 font-sans text-xs text-ink">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <ArrowUpRight
                  className="hidden h-6 w-6 shrink-0 text-muted transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent md:block"
                  aria-hidden
                />
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>

        <p className="mt-10 text-center font-sans text-sm text-muted md:text-left">
          <NavLink
            to="/work"
            className="border-b border-accent/40 font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Full list on the work page
          </NavLink>
        </p>
      </div>
    </section>
  );
}
