import Reveal from '@/components/Reveal';
import SpinBadge from '@/components/SpinBadge';
import type { About } from '@/lib/content';

const BADGE_ALT =
  'The KUMASA badge: blue, red and yellow panels on a black disc, a line of Baybayin, the KUMASA name and a Since 2015 ribbon';

export default function HomeIntro({ about, logoSrc }: { about: About; logoSrc: string }) {
  return (
    <section className="intro wrap" aria-labelledby="intro-title">
      <Reveal stagger className="intro-text">
        <h2 id="intro-title" className="d-1">
          {about.statement}
        </h2>
        <p className="statement">{about.excerpt}</p>
        <ul className="facts">
          {about.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </Reveal>
      <div className="intro-badge">
        <SpinBadge src={logoSrc} alt={BADGE_ALT} size={1254} />
      </div>
    </section>
  );
}
