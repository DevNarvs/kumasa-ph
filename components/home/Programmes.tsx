import Link from 'next/link';
import ImageSlot from '@/components/ImageSlot';
import Reveal from '@/components/Reveal';
import type { About } from '@/lib/content';

export default function Programmes({ about }: { about: About }) {
  return (
    <section id="programmes" className="programmes wrap" aria-labelledby="programmes-title">
      <Reveal stagger className="section-head">
        <h2 id="programmes-title" className="d-1">
          Programmes
        </h2>
        <p>{about.programmesIntro}</p>
      </Reveal>
      <Reveal className="mosaic">
        {about.activities.map((activity, i) => (
          <Link key={activity.title} href={activity.href} className={`panel p-${i + 1}`}>
            <div className="panel-frame">
              <ImageSlot src={activity.image} alt="" shape="fill" />
            </div>
            <span className="round-go" aria-hidden="true">
              →
            </span>
            <div className="panel-body">
              <h3 className="d-2">{activity.title}</h3>
              <p className="max-w-[42ch]">{activity.description}</p>
            </div>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
