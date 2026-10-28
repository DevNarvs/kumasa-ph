import Link from 'next/link';
import { footerLinks } from '@/lib/nav';
import type { SiteInfo } from '@/lib/content';

const linkClass = 'no-underline underline-offset-4 hover:underline';

export default function Footer({ site }: { site: SiteInfo }) {
  return (
    <footer className="wrap grid gap-12 pb-8 pt-[clamp(56px,6vw,96px)]">
      <p aria-hidden="true" className="d-hero -ml-[0.04em]">
        {site.name}
      </p>

      <div className="flex flex-wrap items-end justify-between gap-8">
        <div className="grid gap-1 text-[15px] text-[var(--muted)]">
          <p>
            {site.fullName}. Filipino martial art, since {site.founded}.
          </p>
          <p>
            <a href={`mailto:${site.email}`} className={`${linkClass} text-[var(--ink)]`}>
              {site.email}
            </a>
          </p>
          <p>{site.phone}</p>
          <p>{site.address}</p>
          {site.socials.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-5">
              {site.socials.map((social) => (
                <li key={social.url}>
                  <a href={social.url} className={`${linkClass} text-[var(--ink)]`}>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-7">
            {footerLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a href="#main" className={linkClass}>
                Back to top
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
