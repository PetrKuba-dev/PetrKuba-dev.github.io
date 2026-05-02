import { NavLink } from 'react-router-dom';


export default function Footer() {
  return (
    <footer className="bg-paper py-6 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-muted text-sm">
        <p className="mb-4 md:mb-0">
          © {new Date().getFullYear()} Petr Kuba. All rights reserved.
        </p>
        <div className="flex gap-4">
          <NavLink to="/" className="hover:text-accent transition-colors">Homepage</NavLink>
          <NavLink to="/about-me" className="hover:text-accent transition-colors">About me</NavLink>
          <NavLink to="/work" className="hover:text-accent transition-colors">Work</NavLink>
          <NavLink to="/contact" className="hover:text-accent transition-colors">Contact</NavLink>
        </div>
      </div>
    </footer>
  );
}
