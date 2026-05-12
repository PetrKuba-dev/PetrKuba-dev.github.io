/** @typedef {'en' | 'cs'} Locale */

/**
 * @param {string} pathname
 * @returns {Locale}
 */
export function getLocaleFromPathname(pathname) {
  if (pathname === '/cs' || pathname.startsWith('/cs/')) return 'cs';
  return 'en';
}

/**
 * @param {string} pathname
 * @returns {string} logical path starting with / (e.g. /work), never /cs prefix
 */
export function stripLocalePrefix(pathname) {
  if (pathname === '/cs') return '/';
  if (pathname.startsWith('/cs/')) {
    const rest = pathname.slice(3);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return pathname;
}

/**
 * @param {Locale} locale
 * @param {string} pathWithHash e.g. `/work` or `/#selected-work`
 */
export function withLocalePrefix(locale, pathWithHash) {
  const hashIndex = pathWithHash.indexOf('#');
  const pathPart = hashIndex >= 0 ? pathWithHash.slice(0, hashIndex) : pathWithHash;
  const hash = hashIndex >= 0 ? pathWithHash.slice(hashIndex) : '';

  let path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  if (path === '//') path = '/';

  let result;
  if (locale === 'en') {
    result = path === '/' ? '/' : path;
  } else {
    result = path === '/' ? '/cs' : `/cs${path}`;
  }
  return result + hash;
}

/**
 * @param {Locale} targetLocale
 * @param {string} pathname
 * @param {string} [search]
 * @param {string} [hash]
 */
export function buildPathForLocale(targetLocale, pathname, search = '', hash = '') {
  const logical = stripLocalePrefix(pathname);
  const pathOnly = logical === '' ? '/' : logical;
  return withLocalePrefix(targetLocale, pathOnly) + search + hash;
}
