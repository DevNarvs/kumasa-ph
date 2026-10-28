import type { Metadata } from 'next';
import JoinField from '@/components/JoinField';
import NewsList from '@/components/NewsList';
import PageHeading from '@/components/PageHeading';
import { getNewsPosts, getSite } from '@/lib/content';

export const metadata: Metadata = { title: 'News' };

export default function NewsIndexPage() {
  return (
    <>
      <PageHeading title="News" intro="Announcements, results and stories from KUMASA." />
      <section aria-label="All news" className="wrap pt-16">
        <NewsList posts={getNewsPosts()} />
      </section>
      <JoinField site={getSite()} />
    </>
  );
}
