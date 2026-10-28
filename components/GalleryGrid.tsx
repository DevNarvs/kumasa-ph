'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import ImageSlot from '@/components/ImageSlot';
import Lightbox from '@/components/Lightbox';
import type { Album } from '@/lib/content';

const filterClass = (active: boolean) =>
  `min-h-12 px-5 text-[18px] font-bold [font-stretch:85%] transition-colors ${
    active
      ? 'bg-[var(--ink)] text-[var(--bg)]'
      : 'bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-2)]'
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
          <p className="statement">
            No photos yet
          </p>
        ) : (
          <div className="gallery-grid grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image, i) => (
              <button
                key={`${i}-${image.src}`}
                type="button"
                aria-label={`View larger: ${image.alt}`}
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setOpenIndex(i);
                }}
                style={{ '--i': i } as CSSProperties}
                className="group block overflow-hidden"
              >
                <ImageSlot
                  src={image.src}
                  alt={image.alt}
                  shape="square"
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
