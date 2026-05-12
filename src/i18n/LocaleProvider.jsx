import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { bundles, LOCALE_STORAGE_KEY } from '../data/locales/index.js';
import { buildPathForLocale, getLocaleFromPathname, withLocalePrefix } from './pathUtils.js';

/** @typedef {import('../data/locales/index.js').Locale} Locale */

/** @type {import('react').Context<null | ReturnType<typeof buildLocaleValue>>} */
const LocaleContext = createContext(null);

function buildLocaleValue(locale) {
  const bundle = bundles[locale];
  return {
    locale,
    bundle,
    ui: bundle.ui,
    homeContent: bundle.homeContent,
    workProjects: bundle.workProjects,
    aboutPage: bundle.aboutPage,
    contactPage: bundle.contactPage,
    localizedPath: (pathWithHash) => withLocalePrefix(locale, pathWithHash),
  };
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}

export function LocaleProvider({ children }) {
  const { pathname } = useLocation();
  const locale = getLocaleFromPathname(pathname);
  const value = useMemo(() => buildLocaleValue(locale), [locale]);

  useEffect(() => {
    document.documentElement.lang = locale === 'cs' ? 'cs' : 'en';
    document.title = value.ui.siteTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', value.ui.siteDescription);
    }
  }, [locale, value.ui.siteTitle, value.ui.siteDescription]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** Syncs URL with stored language preference (localStorage). */
export function LocalePreferenceRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw !== 'en' && raw !== 'cs') return;

    const urlLocale = getLocaleFromPathname(location.pathname);
    if (raw === urlLocale) return;

    const target = buildPathForLocale(raw, location.pathname, location.search, location.hash);

    const current = `${location.pathname}${location.search}${location.hash}`;
    if (target !== current) {
      navigate(target, { replace: true });
    }
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
}
