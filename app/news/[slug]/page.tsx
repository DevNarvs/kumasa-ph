import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ImageSlot from '@/components/ImageSlot';
import JoinField from '@/components/JoinField';
import { getNewsPost, getNewsPosts, getSite } from '@/lib/content';
import { formatDate } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getNewsPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: getNewsPost(slug)?.title ?? 'News' };
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getNewsPost(slug);
  if (!post) notFound();

  return (
    <>
      <article className="article wrap">
        <Link href="/news" className="text-[18px] font-bold [font-stretch:85%] no-underline hover:underline">
          <span aria-hidden="true">← </span>All news
        </Link>
        <h1 className="d-2 mt-10 max-w-[24ch]">{post.title}</h1>
        <time dateTime={post.date} className="mt-4 block text-[15px] text-[var(--muted)]">
          {formatDate(post.date)}
        </time>
        <ImageSlot src={post.cover} alt={`Cover image for ${post.title}`} shape="video" className="mt-10" />
        <div className="post-body mt-10 max-w-[68ch]" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <JoinField site={getSite()} />
    </>
  );
}
