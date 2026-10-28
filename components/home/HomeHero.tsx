import type { CSSProperties } from 'react';
import Button from '@/components/Button';
import ImageSlot from '@/components/ImageSlot';
import type { SiteInfo } from '@/lib/content';

/** Full-screen opener: the photo opens out of a circle, the name rises letter by letter. */
export default function HomeHero({ site }: { site: SiteInfo }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-photo">
        <div className="hero-disc">
          <div className="hero-disc-photo">
            <ImageSlot src={site.heroImage} alt={site.heroAlt} shape="fill" />
          </div>
        </div>
      </div>
      <div className="hero-copy">
        <h1 id="hero-title" className="d-hero" aria-label={site.name}>
          {Array.from(site.name).map((letter, i) => (
            <span key={i} aria-hidden="true" style={{ '--i': i } as CSSProperties}>
              {letter}
            </span>
          ))}
        </h1>
        <p className="hero-lede statement">
          {site.fullName}. {site.description}
        </p>
        <Button href="/contact" className="hero-act">
          Join a club
        </Button>
      </div>
    </section>
  );
}
