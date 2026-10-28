import Link from 'next/link';
import { navLinks } from '@/lib/nav';
import type { SiteInfo } from '@/lib/content';

const linkClass = 'underline-offset-4 hover:underline';

export default function Footer({ site }: { site: SiteInfo }) {
  const [home, about, gallery, news, contact] = navLinks;
  const columns = [
    [home, about],
    [gallery, news],
    [contact],
  ];

  return (
    <footer className="wrap pb-8 pt-24">
      <p aria-hidden="true" className="d-hero">
        {site.name}
      </p>

      <div className="mt-14 grid gap-10 md:grid-cols-12">
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-6 md:col-span-8 md:grid-cols-4">
          {columns.map((column, i) => (
            <ul key={i} className="space-y-3 text-[1rem]">
              {column.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
          <ul className="space-y-3 text-[1rem]">
            {site.socials.map((social) => (
              <li key={social.url}>
                <a href={social.url} className={linkClass}>
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-3 text-[1rem] md:col-span-4">
          <p>
            <a href={`mailto:${site.email}`} className={linkClass}>
              {site.email}
            </a>
          </p>
          <p>{site.phone}</p>
          <p className="text-[var(--ink)]/80">{site.address}</p>
        </div>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[1rem]">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <a
          href="#main"
          className="inline-flex min-h-11 items-center bg-[var(--surface)] px-5 text-[1rem] font-medium"
        >
          Back to top
        </a>
      </div>
    </footer>
  );
}
