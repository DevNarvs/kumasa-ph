import Link from 'next/link';
import ImageSlot from '@/components/ImageSlot';
import { formatDate } from '@/lib/format';
import type { NewsPost } from '@/lib/content';

export default function NewsCard({ post }: { post: NewsPost }) {
  return (
    <article className="group">
      <Link href={`/news/${post.slug}`} className="block">
        <ImageSlot src={post.cover} alt={`Cover image for ${post.title}`} aspect="video" />
        <time dateTime={post.date} className="mt-4 block text-sm text-gold">
          {formatDate(post.date)}
        </time>
        <h3 className="mt-1 font-display text-xl uppercase tracking-wide group-hover:text-gold">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
      </Link>
    </article>
  );
}
