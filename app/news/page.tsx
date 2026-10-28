import type { Metadata } from 'next';
import NewsCard from '@/components/NewsCard';
import PageHeading from '@/components/PageHeading';
import { getNewsPosts } from '@/lib/content';

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
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
