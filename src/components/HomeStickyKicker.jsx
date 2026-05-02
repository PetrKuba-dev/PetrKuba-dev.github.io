import { motion } from 'framer-motion';

/**
 * Pins the section kicker under the site header while its parent section is in view.
 * Each homepage section wraps its kicker in this once (first row of the section).
 */
export default function HomeStickyKicker({ children, motionProps }) {
  const inner = motionProps ? (
    <motion.p
      {...motionProps}
      className={`site-kicker mb-0 max-w-none py-2.5 ${motionProps.className ?? ''}`.trim()}
    >
      {children}
    </motion.p>
  ) : (
    <p className="site-kicker mb-0 max-w-none py-2.5">{children}</p>
  );

  return (
    <div className="site-kicker-strip z-30 mb-5 text-ink backdrop-blur-md">
      <div className="mx-auto max-w-6xl">{inner}</div>
    </div>
  );
}
