import type { ReactNode } from 'react';
import Button from '@/components/Button';
import NameWriter from '@/components/NameWriter';
import Reveal from '@/components/Reveal';
import type { SiteInfo } from '@/lib/content';

type JoinFieldProps = {
  site: SiteInfo;
  heading?: string;
  /** 'header-page' makes the field the page itself: an h1, with room for the site header above. */
  as?: 'section' | 'header-page';
  children?: ReactNode;
};

const STATEMENT =
  'Find a club near you, or start one. Write to us and the nearest KUMASA coach will reply.';

export default function JoinField({ site, heading = 'Train with us', as = 'section', children }: JoinFieldProps) {
  const Heading = as === 'header-page' ? 'h1' : 'h2';
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent('Joining KUMASA')}`;

  return (
    <section
      id="join"
      aria-labelledby="join-title"
      className={`join ${as === 'header-page' ? 'join--page' : ''}`.trim()}
    >
      <Reveal stagger className="join-text">
        <Heading id="join-title" className="d-1">
          {heading}
        </Heading>
        <p className="statement">{STATEMENT}</p>
        <Button href={mailto} variant="ink">
          Write to us
        </Button>
        <div className="grid gap-1">
          <a href={`mailto:${site.email}`} className="underline decoration-2 underline-offset-4">
            {site.email}
          </a>
          <span>{site.phone}</span>
          <span>{site.address}</span>
          {site.socials.map((social) => (
            <a key={social.url} href={social.url} className="underline decoration-2 underline-offset-4">
              {social.label}
            </a>
          ))}
        </div>
      </Reveal>
      <div className="join-side">{children ?? <NameWriter />}</div>
    </section>
  );
}
