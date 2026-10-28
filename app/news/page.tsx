import type { Metadata } from 'next';
import Link from 'next/link';
import ImageSlot from '@/components/ImageSlot';
import PageHeading from '@/components/PageHeading';
import { getNewsPosts, type NewsPost } from '@/lib/content';
import { formatDate } from '@/lib/format';

function NewsItem({ post }: { post: NewsPost }) {
  return (
    <article>
      <ImageSlot src={post.cover} alt={`Cover image for ${post.title}`} shape="video" />
      <time dateTime={post.date} className="mt-4 block text-[15px] text-[var(--muted)]">
        {formatDate(post.date)}
      </time>
      <h3 className="mt-2 text-xl font-bold">
        <Link href={`/news/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="mt-2">{post.excerpt}</p>
    </article>
  );
}

export const metadata: Metadata = { title: 'News' };

export default function NewsIndexPage() {
  const posts = getNewsPosts();

  return (
    <>
      <PageHeading
        title="News"
        intro="[Placeholder] Announcements, results and stories from KUMASA."
      />
      <section aria-label="All news" className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        {posts.length === 0 ? (
          <p className="border border-dashed border-white/20 p-12 text-center text-muted">
            No news yet
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <NewsItem key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
