import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function Layout() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/*
        Sticky positioning is relative to the scrollport until any ancestor gets
        `transform` / `filter` / `perspective`. Framer Motion implements `x` with
        `transform`, which breaks `position: sticky` site-wide (homepage kickers).
        Keep route transitions opacity-only.
      */}
      <motion.div
        key={location.pathname}
        className="site-shell min-h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
