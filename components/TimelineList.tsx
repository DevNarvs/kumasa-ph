import type { TimelineEntry } from '@/lib/content';

export default function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="space-y-8 border-l border-white/15 pl-6">
      {entries.map((entry) => (
        <li key={`${entry.year}-${entry.title}`} className="relative">
          <span aria-hidden="true" className="absolute -left-[2.15rem] top-1 text-gold">
            ★
          </span>
          <p className="font-display text-2xl text-gold">{entry.year}</p>
          <h3 className="font-display text-lg uppercase tracking-wide">{entry.title}</h3>
          <p className="mt-1 text-muted">{entry.description}</p>
        </li>
      ))}
    </ol>
  );
}
