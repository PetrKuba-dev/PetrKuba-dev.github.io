import * as enHomeContent from './en/homeContent.js';
import * as enWorkProjects from './en/workProjects.js';
import { aboutPage as enAboutPage } from './en/aboutPage.js';
import { contactPage as enContactPage } from './en/contactPage.js';
import { ui as enUi } from './en/ui.js';

import * as csHomeContent from './cs/homeContent.js';
import * as csWorkProjects from './cs/workProjects.js';
import { aboutPage as csAboutPage } from './cs/aboutPage.js';
import { contactPage as csContactPage } from './cs/contactPage.js';
import { ui as csUi } from './cs/ui.js';

/** @typedef {'en' | 'cs'} Locale */

/** @type {Record<Locale, { homeContent: typeof enHomeContent; workProjects: typeof enWorkProjects; aboutPage: typeof enAboutPage; contactPage: typeof enContactPage; ui: typeof enUi }>} */
export const bundles = {
  en: {
    homeContent: enHomeContent,
    workProjects: enWorkProjects,
    aboutPage: enAboutPage,
    contactPage: enContactPage,
    ui: enUi,
  },
  cs: {
    homeContent: csHomeContent,
    workProjects: csWorkProjects,
    aboutPage: csAboutPage,
    contactPage: csContactPage,
    ui: csUi,
  },
};

export const LOCALES = /** @type {const} */ (['en', 'cs']);

export const LOCALE_STORAGE_KEY = 'portfolio-locale-pref';

/**
 * @param {Locale} locale
 */
export function persistLocalePreference(locale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
