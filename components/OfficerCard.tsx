import ImageSlot from '@/components/ImageSlot';
import type { Officer } from '@/lib/content';

export default function OfficerCard({ officer }: { officer: Officer }) {
  return (
    <article>
      <ImageSlot src={officer.photo} alt={`Portrait of ${officer.name}`} aspect="portrait" />
      <h3 className="mt-4 font-display text-xl uppercase tracking-wide">{officer.name}</h3>
      <p className="text-sm uppercase tracking-widest text-gold">{officer.role}</p>
      <p className="mt-2 text-sm text-muted">{officer.bio}</p>
    </article>
  );
}
