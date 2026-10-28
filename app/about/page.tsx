import type { Metadata } from 'next';
import ImageSlot from '@/components/ImageSlot';
import PageHeading from '@/components/PageHeading';
import { getAbout, getOfficers, getTimeline, type Officer as OfficerType } from '@/lib/content';

function Officer({ officer }: { officer: OfficerType }) {
  return (
    <figure>
      <ImageSlot src={officer.photo} alt={`Portrait of ${officer.name}`} shape="round" />
      <figcaption className="mt-3">
        <h3 className="font-bold">{officer.name}</h3>
        <span className="block text-[15px] text-[var(--muted)]">{officer.role}</span>
      </figcaption>
    </figure>
  );
}

export const metadata: Metadata = { title: 'About' };

const sectionClass = 'mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16';

export default function AboutPage() {
  const about = getAbout();

  return (
    <>
      <PageHeading title={about.title} />

      <section aria-label="Story" className={sectionClass}>
        <div
          className="post-body max-w-3xl text-lg text-muted"
          dangerouslySetInnerHTML={{ __html: about.html }}
        />
      </section>

      <section aria-label="History" className={sectionClass}>
        <h2 className="d-1 mb-10">Our history</h2>
        <ol>
          {getTimeline().map((entry) => (
            <li key={entry.year}>
              <span className="d-2">{entry.year}</span> {entry.title}: {entry.description}
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Officers" className={sectionClass}>
        <h2 className="d-1 mb-10">Our officers</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {getOfficers().map((officer, i) => (
            <Officer key={`${officer.role}-${i}`} officer={officer} />
          ))}
        </div>
      </section>
    </>
  );
}
