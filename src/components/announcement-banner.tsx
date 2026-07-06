export function AnnouncementBanner() {
  return (
    <aside className="relative z-30 bg-[var(--brutalist-accent-light)] text-[var(--brutalist-accent-foreground)] border-b-2 border-[var(--ink)]" role="status">
      <div className="mx-auto max-w-7xl px-6 py-2 flex items-center gap-2.5">
        <span className="brutalist-pulse-dot sm" />
        <span className="text-[10px] font-mono tracking-widest uppercase">
          Now accepting Q4 engagements
        </span>
      </div>
    </aside>
  );
}