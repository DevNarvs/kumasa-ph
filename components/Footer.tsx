import Image from 'next/image';
import Link from 'next/link';
import { navLinks } from '@/lib/nav';
import type { SiteInfo } from '@/lib/content';

export default function Footer({ site }: { site: SiteInfo }) {
  return (
    <footer className="mt-24 border-t border-white/10 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="flex items-center gap-4">
          <Image
            src="/images/kumasa-logo.webp"
            alt=""
            width={56}
            height={56}
            unoptimized
            className="rounded-full"
          />
          <div>
            <p className="font-display text-xl uppercase tracking-wide">{site.name}</p>
            <p className="text-sm text-muted">{site.fullName}</p>
          </div>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-muted hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
