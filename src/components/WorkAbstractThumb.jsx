/**
 * Decorative abstract preview for work cards — no project imagery.
 * Variants cycle for visual variety without implying real screenshots.
 * When `embedded`, parent supplies aspect, border, and chrome; this fills the frame.
 */
export default function WorkAbstractThumb({ variant = 0, embedded = false }) {
  const base = embedded
    ? 'relative h-full min-h-[5.5rem] w-full overflow-hidden bg-paper-deep'
    : 'relative aspect-[16/10] w-full overflow-hidden rounded-soft border border-border-default bg-paper-deep shadow-inner';

  if (variant % 3 === 1) {
    return (
      <div className={base} aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgb(184_92_58/0.18)_48%,transparent_56%)]" />
        <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_18%_22%,rgb(44_40_36/0.14)_0,transparent_42%),radial-gradient(circle_at_88%_78%,rgb(184_92_58/0.2)_0,transparent_38%)]" />
        <div className="absolute bottom-3 left-3 right-3 top-3 rounded-md border border-ink/10 bg-paper/25" />
      </div>
    );
  }

  if (variant % 3 === 2) {
    return (
      <div className={base} aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: `linear-gradient(rgb(44 40 36 / 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgb(44 40 36 / 0.06) 1px, transparent 1px)`,
            backgroundSize: '22px 22px',
          }}
        />
        <div className="absolute -left-6 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent/20 blur-2xl" />
        <div className="absolute -right-8 bottom-0 h-28 w-28 rounded-full border-2 border-accent/35" />
      </div>
    );
  }

  return (
    <div className={base} aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-paper-deep to-ink/12" />
      <div className="absolute -right-6 -top-10 h-32 w-32 rotate-12 rounded-3xl border border-accent/40 bg-accent/10" />
      <div className="absolute bottom-2 left-4 h-16 w-16 rounded-full bg-ink/10 blur-xl" />
    </div>
  );
}
