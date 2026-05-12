import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { useLocale } from '../i18n/LocaleProvider.jsx';

const sectionMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AboutMe() {
  const { aboutPage, localizedPath, ui } = useLocale();

  return (
    <div className="site-page-pad">
      <div className="mx-auto max-w-6xl">
        <motion.header
          custom={0}
          variants={sectionMotion}
          initial="hidden"
          animate="visible"
          className="max-w-3xl border-b border-border pb-12"
        >
          <p className="site-kicker mb-0 max-w-none py-0.5 text-muted">{aboutPage.kicker}</p>
          <h1 className="site-section-title mt-3 text-4xl md:text-5xl lg:-translate-x-10 md:-translate-x-5 -translate-x-2">{aboutPage.title}</h1>
          <p className="site-body-strong site-prose-measure mt-6">{aboutPage.lead}</p>
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
                  className="site-section-title text-2xl md:text-3xl"
                >
                  {section.heading}
                </h2>
                <div className="site-body site-prose-measure mt-5 space-y-4">
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
              className="site-body-strong site-prose-measure"
            >
              {aboutPage.closing}
            </motion.p>

            <motion.div
              custom={aboutPage.sections.length + 2}
              variants={sectionMotion}
              initial="hidden"
              animate="visible"
            >
              <NavLink to={localizedPath('/contact')} className="site-btn-primary">
                {ui.aboutPage.cta}
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
            <p className="site-kicker mb-0 max-w-none py-0.5 text-muted">{ui.aboutPage.colophonKicker}</p>
            <p className="site-body mt-3 text-sm">
              {ui.aboutPage.colophonBody}
            </p>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
