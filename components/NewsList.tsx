import Link from 'next/link';
import ImageSlot from '@/components/ImageSlot';
import type { NewsPost } from '@/lib/content';
import { formatDate } from '@/lib/format';

function PostDate({ date }: { date: string }) {
  return (
    <time dateTime={date} className="mt-3 block text-[15px] text-[var(--muted)]">
      {formatDate(date)}
    </time>
  );
}

/** The newest post as the lead with its round cover, the rest as text rows. */
export default function NewsList({ posts }: { posts: NewsPost[] }) {
  if (posts.length === 0) {
    return <p className="statement">No news yet</p>;
  }
  const [lead, ...rest] = posts;

  return (
    <div className="news-grid">
      <article className="news-lead">
        <ImageSlot src={lead.cover} alt={`Cover image for ${lead.title}`} shape="round" className="news-lead-photo" />
        <div>
          <h3 className="d-2">
            <Link href={`/news/${lead.slug}`} className="no-underline hover:underline">
              {lead.title}
            </Link>
          </h3>
          <PostDate date={lead.date} />
          <p className="mt-5">{lead.excerpt}</p>
        </div>
      </article>
      {rest.length > 0 && (
        <ul className="news-rows">
          {rest.map((post) => (
            <li key={post.slug}>
              <article className="news-row">
                <h3 className="news-row-title">
                  <Link href={`/news/${post.slug}`} className="no-underline after:absolute after:inset-0">
                    {post.title}
                  </Link>
                </h3>
                <PostDate date={post.date} />
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
