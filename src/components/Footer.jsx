import { NavLink } from 'react-router-dom';

import { useLocale } from '../i18n/LocaleProvider.jsx';

export default function Footer() {
  const { localizedPath, ui, homeContent } = useLocale();
  const { person } = homeContent;

  return (
    <footer className="bg-paper py-6 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-muted text-sm">
        <p className="mb-4 md:mb-0">
          © {new Date().getFullYear()} {person.fullName}. {ui.footer.rightsSuffix}
        </p>
        <div className="flex gap-4">
          <NavLink to={localizedPath('/')} className="hover:text-accent transition-colors">
            {ui.footer.homepage}
          </NavLink>
          <NavLink to={localizedPath('/about-me')} className="hover:text-accent transition-colors">
            {ui.footer.aboutMe}
          </NavLink>
          <NavLink to={localizedPath('/work')} className="hover:text-accent transition-colors">
            {ui.footer.work}
          </NavLink>
          <NavLink to={localizedPath('/contact')} className="hover:text-accent transition-colors">
            {ui.footer.contact}
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
