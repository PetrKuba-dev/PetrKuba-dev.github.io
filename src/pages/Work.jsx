import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import { workPageIntro, workProjects } from '../data/workProjects';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const row = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Work() {
  return (
    <div className="bg-paper">
      <div className="px-4 sm:px-6 md:px-10 pb-20 pt-16 md:pb-28 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl border-b border-border pb-12"
          >
            <p className="font-sans text-sm font-medium uppercase tracking-[0.14em] text-muted">
              {workPageIntro.kicker}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink md:text-5xl">
              {workPageIntro.title}
            </h1>
            <p className="mt-5 font-sans text-lg leading-relaxed text-muted">{workPageIntro.description}</p>
          </motion.header>

          <motion.ul
            className="mt-14 flex flex-col gap-5 md:gap-6"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {workProjects.map((project) => (
              <motion.li key={project.id} variants={row}>
                <article className="group relative rounded-soft border border-border bg-paper-deep/35 p-6 transition-[border-color,box-shadow] hover:border-accent/40 hover:shadow-[0_12px_40px_-12px_rgb(42_38_36_/_0.1)] md:p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4 md:block">
                        <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
                          {project.title}
                        </h2>
                        <span
                          className="font-sans text-xs font-medium uppercase tracking-wider text-muted md:hidden"
                          aria-hidden
                        >
                          {project.slug}
                        </span>
                      </div>
                      <p className="mt-3 max-w-2xl font-sans leading-relaxed text-muted">{project.description}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <li key={tag}>
                            <span className="inline-block rounded-full border border-border bg-paper px-3 py-1 font-sans text-xs text-ink">
                              {tag}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-end">
                      <span className="hidden font-sans text-[11px] tracking-wide text-muted md:block">
                        /{project.slug}
                      </span>
                      <span className="inline-flex items-center gap-1 font-sans text-sm font-medium text-muted transition-colors group-hover:text-accent">
                        Case study soon
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                  </div>
                </article>
              </motion.li>
            ))}
          </motion.ul>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-14 font-sans text-sm text-muted"
          >
            Want the short list first?{' '}
            <NavLink to="/#selected-work" className="font-medium text-ink underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent">
              Back to homepage highlights
            </NavLink>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
