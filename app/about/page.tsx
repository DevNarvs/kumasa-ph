import type { Metadata } from 'next';
import OfficerCard from '@/components/OfficerCard';
import PageHeading from '@/components/PageHeading';
import SectionHeading from '@/components/SectionHeading';
import TimelineList from '@/components/TimelineList';
import { getAbout, getOfficers, getTimeline } from '@/lib/content';

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
        <SectionHeading eyebrow="Since 2015" title="Our history" />
        <TimelineList entries={getTimeline()} />
      </section>

      <section aria-label="Officers" className={sectionClass}>
        <SectionHeading eyebrow="Leadership" title="Our officers" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {getOfficers().map((officer, i) => (
            <OfficerCard key={`${officer.role}-${i}`} officer={officer} />
          ))}
        </div>
      </section>
    </>
  );
}
