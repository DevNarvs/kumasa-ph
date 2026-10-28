'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ImageSlot from '@/components/ImageSlot';
import Lightbox from '@/components/Lightbox';
import type { Album } from '@/lib/content';

const filterClass = (active: boolean) =>
  `border px-4 py-2 font-display text-sm uppercase tracking-wide ${
    active
      ? 'border-gold bg-gold text-(--color-base)'
      : 'border-white/20 hover:border-gold hover:text-gold'
  }`;

export default function GalleryGrid({ albums }: { albums: Album[] }) {
  const [filter, setFilter] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const images = useMemo(
    () =>
      filter === 'all'
        ? albums.flatMap((album) => album.images)
        : (albums.find((album) => album.slug === filter)?.images ?? []),
    [albums, filter],
  );

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) triggerRef.current?.focus();
  }, [openIndex]);

  return (
    <>
      <div inert={openIndex !== null}>
        {albums.length > 0 && (
          <div role="group" aria-label="Filter by album" className="mb-8 flex flex-wrap gap-3">
            <button
              type="button"
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
              className={filterClass(filter === 'all')}
            >
              All
            </button>
            {albums.map((album) => (
              <button
                key={album.slug}
                type="button"
                aria-pressed={filter === album.slug}
                onClick={() => setFilter(album.slug)}
                className={filterClass(filter === album.slug)}
              >
                {album.title}
              </button>
            ))}
          </div>
        )}

        {images.length === 0 ? (
          <p className="border border-dashed border-white/20 p-12 text-center text-muted">
            No photos yet
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image, i) => (
              <button
                key={`${i}-${image.src}`}
                type="button"
                aria-label={`View larger: ${image.alt}`}
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setOpenIndex(i);
                }}
                className="group block overflow-hidden"
              >
                <ImageSlot
                  src={image.src}
                  alt={image.alt}
                  aspect="square"
                  className="transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {openIndex !== null && (
        <Lightbox images={images} index={openIndex} onClose={close} onIndexChange={setOpenIndex} />
      )}
    </>
  );
}
