import type { Metadata } from 'next';
import FightCard from '@/components/FightCard';
import ImageSlot from '@/components/ImageSlot';
import JoinField from '@/components/JoinField';
import PageHeading from '@/components/PageHeading';
import Reveal from '@/components/Reveal';
import { getAbout, getOfficers, getSite, getTimeline } from '@/lib/content';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  const about = getAbout();

  return (
    <>
      <PageHeading title={about.title} />

      <section className="story wrap" aria-labelledby="story-title">
        <Reveal stagger className="story-lead">
          <h2 id="story-title" className="d-1">
            {about.statement}
          </h2>
          <p className="statement">{about.excerpt}</p>
        </Reveal>
        <div className="story-body post-body" dangerouslySetInnerHTML={{ __html: about.html }} />
      </section>

      <section className="history wrap" aria-labelledby="history-title">
        <h2 id="history-title" className="d-1 mb-12">
          Our history
        </h2>
        <Reveal>
          <FightCard
            items={getTimeline().map((entry) => ({
              key: String(entry.year),
              big: String(entry.year),
              title: entry.title,
              where: entry.description,
            }))}
          />
        </Reveal>
      </section>

      <section className="officers wrap" aria-labelledby="officers-title">
        <h2 id="officers-title" className="d-1 mb-12">
          Our officers
        </h2>
        <Reveal as="ul" stagger className="strip strip--people">
          {getOfficers().map((officer, i) => (
            <li key={`${officer.role}-${i}`}>
              <figure className="grid gap-3.5">
                <ImageSlot src={officer.photo} alt={`Portrait of ${officer.name}`} shape="round" />
                <figcaption>
                  <h3 className="strip-name">{officer.name}</h3>
                  <span className="block text-[15px] text-[var(--muted)]">{officer.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </Reveal>
      </section>

      <JoinField site={getSite()} />
    </>
  );
}
