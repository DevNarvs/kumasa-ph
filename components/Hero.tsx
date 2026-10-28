import Image from 'next/image';
import Link from 'next/link';
import type { SiteInfo } from '@/lib/content';

export default function Hero({ site }: { site: SiteInfo }) {
  return (
    <section className="hero-splatter relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <Image
          src="/images/kumasa-logo.webp"
          alt="KUMASA logo"
          width={220}
          height={220}
          unoptimized
          priority
          className="rounded-full"
        />
        <h1 className="mt-8 font-display text-6xl uppercase tracking-wide md:text-8xl">
          {site.name}
        </h1>
        <p className="mt-3 text-lg text-muted md:text-xl">{site.fullName}</p>
        <p className="mt-6 font-display text-xl uppercase tracking-[0.3em] text-gold">
          <span aria-hidden="true">★ </span>
          {site.tagline}
          <span aria-hidden="true"> ★</span>
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/about"
            className="bg-gold px-6 py-3 font-display uppercase tracking-wide text-(--color-base) hover:brightness-110"
          >
            About us
          </Link>
          <Link
            href="/gallery"
            className="border border-white/30 px-6 py-3 font-display uppercase tracking-wide hover:border-gold hover:text-gold"
          >
            View gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
