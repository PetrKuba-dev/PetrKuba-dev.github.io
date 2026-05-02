import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { person } from '../data/homeContent';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/work', label: 'Work' },
  { to: '/about-me', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function navLinkClass(isActive) {
  return [
    'group relative inline-flex whitespace-nowrap rounded-soft px-2.5 py-1.5 font-sans text-sm font-medium tracking-wide transition-colors duration-200',
    isActive ? 'text-accent' : 'text-ink hover:text-accent',
  ].join(' ');
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-border bg-paper/90 backdrop-blur-md"
    >
      <div className="px-4 py-4 sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <NavLink
            to="/"
            className="group flex min-w-0 flex-shrink-0 flex-col gap-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-soft"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Portfolio
            </span>
            <span className="font-sans text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
              {person.fullName}
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 sm:flex"
            aria-label="Primary"
          >
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <span className="relative inline-block">
                    {label}
                    <span
                      className={[
                        'absolute -bottom-1 left-0 right-0 h-[2px] origin-left rounded-full transition-transform duration-200',
                        isActive
                          ? 'scale-x-100 bg-accent'
                          : 'scale-x-0 bg-accent/70 group-hover:scale-x-100',
                      ].join(' ')}
                      aria-hidden
                    />
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <div className="flex sm:hidden">
            <motion.button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((o) => !o)}
              whileTap={{ scale: 0.96 }}
              className="rounded-soft p-2 text-ink transition-colors hover:bg-paper-deep hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {mobileOpen ? (
                <X strokeWidth={1.75} className="h-6 w-6" aria-hidden />
              ) : (
                <Menu strokeWidth={1.75} className="h-6 w-6" aria-hidden />
              )}
              <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-paper-deep/60 sm:hidden"
          >
            <nav
              className="flex flex-col px-4 pb-5 pt-2"
              aria-label="Mobile primary"
            >
              {navItems.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    [
                      'border-b border-border/70 py-3.5 font-sans text-base font-medium transition-colors last:border-b-0',
                      isActive ? 'text-accent' : 'text-ink hover:text-accent',
                    ].join(' ')
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
