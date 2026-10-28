import type { Metadata } from 'next';
import GalleryGrid from '@/components/GalleryGrid';
import PageHeading from '@/components/PageHeading';
import { getAlbums } from '@/lib/content';

export const metadata: Metadata = { title: 'Gallery' };

export default function GalleryPage() {
  return (
    <>
      <PageHeading
        title="Gallery"
        intro="[Placeholder] Moments from KUMASA's events, training sessions and seminars."
      />
      <section aria-label="Photo gallery" className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <GalleryGrid albums={getAlbums()} />
      </section>
    </>
  );
}
