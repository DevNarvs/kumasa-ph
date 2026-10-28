import type { Metadata } from 'next';
import GalleryGrid from '@/components/GalleryGrid';
import JoinField from '@/components/JoinField';
import PageHeading from '@/components/PageHeading';
import { getAlbums, getSite } from '@/lib/content';

export const metadata: Metadata = { title: 'Gallery' };

export default function GalleryPage() {
  return (
    <>
      <PageHeading title="Gallery" intro="Moments from KUMASA's events, training sessions and seminars." />
      <section aria-label="Photo gallery" className="wrap pt-16">
        <GalleryGrid albums={getAlbums()} />
      </section>
      <JoinField site={getSite()} />
    </>
  );
}
