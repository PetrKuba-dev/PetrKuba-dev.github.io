import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';

import { useLocale } from '../i18n/LocaleProvider.jsx';
import { useTheme } from '../theme/ThemeProvider.jsx';
import { persistLocalePreference } from '../data/locales/index.js';
import { buildPathForLocale } from '../i18n/pathUtils.js';

function navLinkClass(isActive) {
  return [
    'group relative inline-flex whitespace-nowrap rounded-soft px-2.5 py-1.5 font-sans text-sm font-medium tracking-wide transition-colors duration-200',
    isActive ? 'text-accent' : 'text-ink hover:text-accent',
  ].join(' ');
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { locale, localizedPath, ui, homeContent } = useLocale();
  const { person } = homeContent;
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: ui.nav.home, end: true },
    { path: '/work', label: ui.nav.work },
    { path: '/about-me', label: ui.nav.about },
    { path: '/contact', label: ui.nav.contact },
  ];

  const switchLanguage = (target) => {
    if (target === locale) return;
    persistLocalePreference(target);
    navigate(
      buildPathForLocale(target, location.pathname, location.search, location.hash),
    );
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky md:relative top-0 z-50 border-b border-border-subtle bg-paper/90 backdrop-blur-md"
    >
      <div className="px-4 py-4 sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <NavLink
            to={localizedPath('/')}
            className="group flex min-w-0 flex-shrink-0 flex-col gap-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-soft"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              {ui.portfolioLabel}
            </span>
            <span className="font-sans text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
              {person.fullName}
            </span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 sm:flex">
            <nav className="flex items-center gap-1" aria-label={ui.header.primaryNavAria}>
              {navItems.map(({ path, label, end }) => (
                <NavLink
                  key={path}
                  to={localizedPath(path)}
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

            <div
              className="ml-1 flex items-center rounded-soft border border-border-subtle bg-paper-deep/40 p-0.5"
              role="group"
              aria-label={ui.header.themeSwitchAria}
            >
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={isDark}
                className="rounded-soft p-1.5 text-ink transition-colors hover:bg-paper hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                title={isDark ? ui.header.switchToLight : ui.header.switchToDark}
              >
                {isDark ? (
                  <Sun strokeWidth={1.75} className="h-4 w-4" aria-hidden />
                ) : (
                  <Moon strokeWidth={1.75} className="h-4 w-4" aria-hidden />
                )}
                <span className="sr-only">
                  {isDark ? ui.header.switchToLight : ui.header.switchToDark}
                </span>
              </button>
            </div>

            <div
              className="ml-2 flex items-center gap-0.5 rounded-soft border border-border-subtle bg-paper-deep/40 p-0.5"
              role="group"
              aria-label={ui.header.languageSwitchAria}
            >
              {(['en', 'cs']).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => switchLanguage(code)}
                  className={[
                    'rounded-soft px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors',
                    locale === code
                      ? 'bg-paper text-accent shadow-sm'
                      : 'text-muted hover:text-ink',
                  ].join(' ')}
                >
                  {ui.language[code]}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: language + menu toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            <div
              className="flex items-center rounded-soft border border-border-subtle bg-paper-deep/40 p-0.5"
              role="group"
              aria-label={ui.header.themeSwitchAria}
            >
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={isDark}
                className="rounded-soft p-1.5 text-ink transition-colors hover:bg-paper hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                title={isDark ? ui.header.switchToLight : ui.header.switchToDark}
              >
                {isDark ? (
                  <Sun strokeWidth={1.75} className="h-4 w-4" aria-hidden />
                ) : (
                  <Moon strokeWidth={1.75} className="h-4 w-4" aria-hidden />
                )}
                <span className="sr-only">
                  {isDark ? ui.header.switchToLight : ui.header.switchToDark}
                </span>
              </button>
            </div>

            <div
              className="flex items-center gap-0.5 rounded-soft border border-border-subtle bg-paper-deep/40 p-0.5"
              role="group"
              aria-label={ui.header.languageSwitchAria}
            >
              {(['en', 'cs']).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => switchLanguage(code)}
                  className={[
                    'rounded-soft px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors',
                    locale === code
                      ? 'bg-paper text-accent shadow-sm'
                      : 'text-muted hover:text-ink',
                  ].join(' ')}
                >
                  {ui.language[code]}
                </button>
              ))}
            </div>
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
              <span className="sr-only">
                {mobileOpen ? ui.header.closeMenu : ui.header.openMenu}
              </span>
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
            className="overflow-hidden border-t border-border-subtle bg-paper-deep/60 sm:hidden"
          >
            <nav
              className="flex flex-col px-4 pb-5 pt-2"
              aria-label={ui.header.mobileNavAria}
            >
              {navItems.map(({ path, label, end }) => (
                <NavLink
                  key={path}
                  to={localizedPath(path)}
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
