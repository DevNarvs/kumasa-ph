import Link from 'next/link';
import ImageSlot from '@/components/ImageSlot';
import Reveal from '@/components/Reveal';
import { getAbout, getAlbums, getNewsPosts, getOfficers, getSite } from '@/lib/content';
import { formatDate } from '@/lib/format';

const sectionClass = 'mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24';
const linkClass =
  'mt-8 inline-block font-display uppercase tracking-wide text-gold hover:underline';

export default function Home() {
  const site = getSite();
  const about = getAbout();
  const officers = getOfficers();
  const galleryPreview = getAlbums()
    .flatMap((album) => album.images)
    .slice(0, 6);
  const latestNews = getNewsPosts().slice(0, 3);

  return (
    <>
      <div className={sectionClass}>
        <h1 className="d-hero">{site.name}</h1>
        <p className="statement">{site.fullName}</p>
      </div>

      <section aria-label="About" className={sectionClass}>
        <Reveal>
          <h2 className="d-1 mb-10">About {site.name}</h2>
          <p className="max-w-3xl text-lg text-muted">{about.excerpt}</p>
          <Link href="/about" className={linkClass}>
            Read our story →
          </Link>
        </Reveal>
      </section>

      <section aria-label="What we do" className={sectionClass}>
        <Reveal>
          <h2 className="d-1 mb-10">What we do</h2>
          <ul className="grid gap-8 md:grid-cols-3">
            {about.activities.map((activity) => (
              <li key={activity.title} className="border border-white/10 bg-surface p-6">
                <h3 className="font-display text-xl uppercase tracking-wide">
                  <span aria-hidden="true" className="mr-2 text-gold">
                    ★
                  </span>
                  {activity.title}
                </h3>
                <p className="mt-3 text-muted">{activity.description}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section aria-label="Officers" className={sectionClass}>
        <Reveal>
          <h2 className="d-1 mb-10">Our officers</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {officers.map((officer, i) => (
              <figure key={`${officer.role}-${i}`}>
                <ImageSlot src={officer.photo} alt={`Portrait of ${officer.name}`} shape="round" />
                <figcaption className="mt-3">{officer.name}, {officer.role}</figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </section>

      <section aria-label="Gallery" className={sectionClass}>
        <Reveal>
          <h2 className="d-1 mb-10">Gallery</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {galleryPreview.map((image) => (
              <ImageSlot key={image.src} src={image.src} alt={image.alt} shape="square" />
            ))}
          </div>
          <Link href="/gallery" className={linkClass}>
            See the full gallery →
          </Link>
        </Reveal>
      </section>

      <section aria-label="News" className={sectionClass}>
        <Reveal>
          <h2 className="d-1 mb-10">News</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {latestNews.map((post) => (
              <article key={post.slug}>
                <time dateTime={post.date} className="block text-[15px] text-[var(--muted)]">
                  {formatDate(post.date)}
                </time>
                <h3 className="mt-2 text-xl font-bold">
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </h3>
              </article>
            ))}
          </div>
          <Link href="/news" className={linkClass}>
            All news →
          </Link>
        </Reveal>
      </section>

      <section aria-label="Contact" className={`${sectionClass} text-center`}>
        <Reveal>
          <h2 className="d-1 mb-10">Get in touch</h2>
          <p className="mx-auto max-w-xl text-muted">
            Questions about {site.name}? We would love to hear from you.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block bg-gold px-8 py-3 font-display uppercase tracking-wide text-(--color-base) hover:brightness-110"
          >
            Contact us
          </Link>
        </Reveal>
      </section>
    </>
  );
}
