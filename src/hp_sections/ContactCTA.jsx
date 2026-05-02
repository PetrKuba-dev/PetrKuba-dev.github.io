import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Mail } from 'lucide-react';

import HomeStickyKicker from '../components/HomeStickyKicker';

export default function ContactCTA() {
  return (
    <section
      className="hp-section-contact hp-section-pad-tight-bottom"
      aria-labelledby="contact-cta-heading"
    >
      <HomeStickyKicker>Contact</HomeStickyKicker>

      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative overflow-hidden rounded-card border border-border-strong bg-ink px-8 py-12 text-paper shadow-card sm:px-11 sm:py-14 md:px-14 md:py-16">
          <div className="pointer-events-none absolute -right-12 top-0 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-soft/10 blur-2xl" />
          <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 lg:gap-14">
            <div className="md:pr-4">
              <h2
                id="contact-cta-heading"
                className="site-section-title-on-dark mt-0 text-3xl leading-[1.12] sm:text-4xl sm:leading-[1.1]"
              >
                Get in touch
              </h2>
              <p className="site-prose-measure mt-5 font-sans text-base font-normal leading-relaxed text-paper/88">
                Collaboration, a technical question, or swapping references — the contact page lists how to
                reach me. No marketing funnel, just the basics.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 self-start md:items-end md:self-center">
              <NavLink to="/contact" className="site-btn-ghost-on-dark">
                <Mail className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                Contact details
              </NavLink>
              <p className="site-cta-mono-hint text-center md:text-right">Route · /contact</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
