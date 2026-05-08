import { motion } from 'framer-motion';
import { Github, Mail } from 'lucide-react';

import { contactPage } from '../data/contactPage';

const cardMotion = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Contact() {
  const mailto = `mailto:${contactPage.email}`;

  return (
    <div className="site-page-pad">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="site-kicker mb-0 max-w-none py-0.5 text-muted">{contactPage.kicker}</p>
          <h1 className="site-section-title mt-3 text-4xl md:text-5xl lg:-translate-x-10 md:-translate-x-5 -translate-x-2">{contactPage.title}</h1>
          <p className="site-body site-prose-measure mt-6 md:text-xl">{contactPage.lead}</p>
        </motion.header>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5">
          <motion.a
            custom={0}
            variants={cardMotion}
            initial="hidden"
            animate="visible"
            href={mailto}
            className="group flex flex-col justify-between gap-6 rounded-soft border border-border bg-paper p-6 transition-[border-color,box-shadow] hover:border-accent/50 hover:shadow-card-hover md:p-8"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-soft bg-paper-deep text-ink transition-colors group-hover:bg-accent-soft group-hover:text-accent">
              <Mail className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="site-kicker mb-0 max-w-none py-0 text-muted">Email</p>
              <p className="mt-2 break-all font-sans text-lg font-medium text-ink transition-colors group-hover:text-accent">
                {contactPage.email}
              </p>
              <p className="site-body mt-3 text-sm">Prefer long threads and links over calendar gymnastics.</p>
            </div>
          </motion.a>

          <motion.a
            custom={1}
            variants={cardMotion}
            initial="hidden"
            animate="visible"
            href={contactPage.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between gap-6 rounded-soft border border-border bg-paper p-6 transition-[border-color,box-shadow] hover:border-accent/50 hover:shadow-card-hover md:p-8"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-soft bg-paper-deep text-ink transition-colors group-hover:bg-accent-soft group-hover:text-accent">
              <Github className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="site-kicker mb-0 max-w-none py-0 text-muted">{contactPage.githubLabel}</p>
              <p className="mt-2 font-sans text-lg font-medium text-ink transition-colors group-hover:text-accent">
                {contactPage.githubUrl.replace('https://', '')}
              </p>
              <p className="site-body mt-3 text-sm">Code, experiments, and things worth diffing.</p>
            </div>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
