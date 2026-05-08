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
    <div className="site-page-pad">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl border-b border-border pb-12"
        >
          <p className="site-kicker mb-0 max-w-none py-0.5 text-muted">{workPageIntro.kicker}</p>
          <h1 className="site-section-title mt-3 text-4xl md:text-5xl lg:-translate-x-10 md:-translate-x-5 -translate-x-2">{workPageIntro.title}</h1>
          <p className="site-body site-prose-measure mt-5">{workPageIntro.description}</p>
        </motion.header>

        <motion.ul
          className="mt-14 flex flex-col gap-5 md:gap-6"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {workProjects.map((project, index) => (
            <motion.li key={project.id} variants={row} className={index % 2 === 0 ? 'md:mr-4 lg:mr-10' : 'md:ml-4 lg:ml-8'}>
              <article className="group site-work-card relative">
                <div className="flex min-w-0 flex-1 flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4 md:block">
                      <h2 className="site-section-title text-2xl md:text-3xl">{project.title}</h2>
                      <span
                        className="font-sans text-xs font-medium uppercase tracking-wider text-muted md:hidden"
                        aria-hidden
                      >
                        {project.slug}
                      </span>
                    </div>
                    <p className="site-body site-prose-measure mt-3 max-w-2xl">{project.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <li key={tag}>
                          <span className="site-work-tag">{tag}</span>
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
          className="site-body mt-14 text-sm"
        >
          Want the short list first?{' '}
          <NavLink to="/#selected-work" className="site-text-link">
            Back to homepage highlights
          </NavLink>
        </motion.p>
      </div>
    </div>
  );
}
