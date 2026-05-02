import WorkAbstractThumb from './WorkAbstractThumb';

/**
 * Browser-style frame over abstract art — reads as “app preview” until real screenshots exist.
 */
export default function WorkCardPreview({ variant = 0, title }) {
  const label = title.length > 38 ? `${title.slice(0, 36)}…` : title;

  return (
    <div className="flex aspect-[16/10] w-full flex-col overflow-hidden rounded-soft border border-border-default bg-paper-deep shadow-inner">
      <div
        className="flex h-8 shrink-0 items-center gap-2 border-b border-border-default bg-paper/92 px-2.5 sm:h-9 sm:px-3"
        aria-hidden
      >
        <span className="flex shrink-0 gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#c4bbb0]" />
          <span className="h-2 w-2 rounded-full bg-[#d8d0c8]" />
          <span className="h-2 w-2 rounded-full bg-[#e8e2da]" />
        </span>
        <span className="min-w-0 truncate font-mono text-[10px] font-medium tracking-tight text-muted sm:text-[11px]">
          {label}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">
        {/* <WorkAbstractThumb variant={variant} embedded /> */}
        <img src="/img/cursor_portfolio.png" alt={title} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
