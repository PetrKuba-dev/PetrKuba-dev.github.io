import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import HomeStickyKicker from '../components/HomeStickyKicker';
import WorkCardPreview from '../components/WorkCardPreview';
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
      className="hp-section-selected-work hp-section-pad scroll-mt-24"
      aria-labelledby="selected-work-heading"
    >
      <HomeStickyKicker>{selectedWorkIntro.kicker}</HomeStickyKicker>

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl md:mb-14 lg:max-w-[42rem]">
          <h2
            id="selected-work-heading"
            className="site-section-title mt-0 text-3xl sm:mt-1 sm:text-4xl md:text-5xl"
          >
            {selectedWorkIntro.title}
          </h2>
          <p className="site-body site-prose-measure mt-5 text-ink/90">{selectedWorkIntro.description}</p>
        </div>

        <motion.ul
          className="flex flex-col gap-8 md:gap-10"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {featuredWork.map((project, index) => (
            <motion.li
              key={project.id}
              variants={item}
              className={index % 2 === 0 ? 'md:mr-4 lg:mr-10' : 'md:ml-4 lg:ml-8'}
            >
              <NavLink
                to={project.href}
                className={`group site-work-card ${index === 0 ? 'md:min-h-[11rem]' : ''}`}
              >
                <div className="w-full shrink-0 md:w-[min(280px,34%)] md:max-w-[280px]">
                  <WorkCardPreview variant={index} title={project.title} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4 md:block">
                      <h3 className="font-sans text-xl font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent sm:text-2xl md:text-3xl">
                        {project.title}
                      </h3>
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-muted transition-colors duration-200 group-hover:text-accent md:hidden"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </div>
                    <p className="site-body site-prose-measure mt-2 md:mt-3">{project.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-2 md:mt-6">
                      {project.tags.map((tag) => (
                        <li key={tag}>
                          <span className="site-work-tag group-hover:bg-accent">
                            {tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ArrowUpRight
                    className="hidden h-6 w-6 shrink-0 self-start text-muted transition-colors duration-200 group-hover:text-accent md:mt-1 md:block"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>

        <p className="mt-12 text-center font-sans text-sm text-muted md:mt-14 md:text-left">
          <NavLink to="/work" className="site-text-link">
            Full list on the work page
          </NavLink>
        </p>
      </div>
    </section>
  );
}
