import Link from 'next/link';
import Button from '@/components/Button';
import ImageSlot from '@/components/ImageSlot';
import Reveal from '@/components/Reveal';
import type { Album } from '@/lib/content';

const STRIP_SIZE = 5;

export default function GalleryStrip({ albums }: { albums: Album[] }) {
  const photos = albums
    .flatMap((album) => album.images.map((image) => ({ ...image, album: album.title })))
    .slice(0, STRIP_SIZE);

  return (
    <section id="gallery" className="gallery wrap" aria-labelledby="gallery-title">
      <Reveal stagger className="section-head section-head--action">
        <h2 id="gallery-title" className="d-1">
          From the mat
        </h2>
        <Button href="/gallery" variant="ink">
          Open the gallery
        </Button>
      </Reveal>
      <Reveal as="ul" stagger className="strip">
        {photos.map((photo, i) => (
          <li key={`${i}-${photo.src}`}>
            <Link href="/gallery" className="strip-link">
              <ImageSlot src={photo.src} alt={photo.alt} shape="round" className="strip-photo" />
              <span className="strip-name">{photo.album}</span>
            </Link>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
