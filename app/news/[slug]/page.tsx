import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ImageSlot from '@/components/ImageSlot';
import { getNewsPost, getNewsPosts } from '@/lib/content';
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
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <Link href="/news" className="text-sm uppercase tracking-widest text-gold hover:underline">
        ← All news
      </Link>
      <time dateTime={post.date} className="mt-8 block text-sm text-gold">
        {formatDate(post.date)}
      </time>
      <h1 className="mt-2 font-display text-4xl uppercase tracking-wide md:text-6xl">
        {post.title}
      </h1>
      <ImageSlot
        src={post.cover}
        alt={`Cover image for ${post.title}`}
        aspect="video"
        className="mt-8"
      />
      <div
        className="post-body mt-8 text-lg text-muted"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
