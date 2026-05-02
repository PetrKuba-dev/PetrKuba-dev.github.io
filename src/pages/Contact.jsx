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
    <div className="bg-paper">
      <div className="px-4 sm:px-6 md:px-10 pb-20 pt-16 md:pb-28 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="font-sans text-sm font-medium uppercase tracking-[0.14em] text-muted">
              {contactPage.kicker}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink md:text-5xl">
              {contactPage.title}
            </h1>
            <p className="mt-6 font-sans text-lg leading-relaxed text-muted md:text-xl">{contactPage.lead}</p>
          </motion.header>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5">
            <motion.a
              custom={0}
              variants={cardMotion}
              initial="hidden"
              animate="visible"
              href={mailto}
              className="group flex flex-col justify-between gap-6 rounded-soft border border-border bg-paper p-6 transition-[border-color,box-shadow] hover:border-accent/50 hover:shadow-[0_12px_40px_-12px_rgb(42_38_36_/_0.1)] md:p-8"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-soft bg-paper-deep text-ink transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                <Mail className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-muted">Email</p>
                <p className="mt-2 break-all font-sans text-lg font-medium text-ink transition-colors group-hover:text-accent">
                  {contactPage.email}
                </p>
                <p className="mt-3 font-sans text-sm text-muted">Prefer long threads and links over calendar gymnastics.</p>
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
              className="group flex flex-col justify-between gap-6 rounded-soft border border-border bg-paper p-6 transition-[border-color,box-shadow] hover:border-accent/50 hover:shadow-[0_12px_40px_-12px_rgb(42_38_36_/_0.1)] md:p-8"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-soft bg-paper-deep text-ink transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                <Github className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-muted">
                  {contactPage.githubLabel}
                </p>
                <p className="mt-2 font-sans text-lg font-medium text-ink transition-colors group-hover:text-accent">
                  {contactPage.githubUrl.replace('https://', '')}
                </p>
                <p className="mt-3 font-sans text-sm text-muted">Code, experiments, and things worth diffing.</p>
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
}
