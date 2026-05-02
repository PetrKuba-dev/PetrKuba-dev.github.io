import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section
      className="border-t border-border px-4 py-20 sm:px-6 md:px-10 md:py-24"
      aria-labelledby="contact-cta-heading"
    >
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative overflow-hidden rounded-soft bg-ink px-8 py-12 text-paper sm:px-12 sm:py-14 md:px-16 md:py-16">
          <div className="pointer-events-none absolute -right-12 top-0 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-soft/10 blur-2xl" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
            <div>
              <h2 id="contact-cta-heading" className="font-serif text-3xl leading-tight sm:text-4xl">
                Get in touch
              </h2>
              <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-paper/85">
                Collaboration, a technical question, or swapping references — the contact page lists how to
                reach me. No marketing funnel, just the basics.
              </p>
            </div>
            <NavLink
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-soft bg-paper px-6 py-3.5 font-sans text-sm font-semibold text-ink transition-colors hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper md:self-center"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Contact details
            </NavLink>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
