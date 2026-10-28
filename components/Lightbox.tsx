'use client';

import Image from 'next/image';
import { useEffect, useRef, type MouseEvent } from 'react';

type LightboxProps = {
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

const navButtonClass =
  'absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-[var(--surface)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:hover:bg-[var(--surface)]';

export default function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = images[index];
  const atStart = index <= 0;
  const atEnd = index >= images.length - 1;

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight' && !atEnd) {
        onIndexChange(index + 1);
      } else if (event.key === 'ArrowLeft' && !atStart) {
        onIndexChange(index - 1);
      } else if (event.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const items = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled)'));
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (!dialog.contains(active)) {
          event.preventDefault();
          first.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [index, atStart, atEnd, onClose, onIndexChange]);

  if (!image) return null;

  const closeOnBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={closeOnBackdrop}
      className="fixed inset-0 z-50 flex animate-[lightbox-in_150ms_ease-out] flex-col bg-[var(--bg)] motion-reduce:animate-none"
    >
      <div className="flex items-center justify-between p-4">
        <p aria-live="polite" className="text-[15px] text-[var(--muted)]">
          {index + 1} / {images.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center bg-[var(--surface)] hover:bg-[var(--surface-2)]"
        >
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>

      <div className="relative mx-4 min-h-0 flex-1" onClick={closeOnBackdrop}>
        <Image src={image.src} alt={image.alt} fill unoptimized sizes="100vw" className="object-contain" />
        <button
          type="button"
          aria-label="Previous image"
          disabled={atStart}
          onClick={() => onIndexChange(index - 1)}
          className={`${navButtonClass} left-2`}
        >
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next image"
          disabled={atEnd}
          onClick={() => onIndexChange(index + 1)}
          className={`${navButtonClass} right-2`}
        >
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="p-4 text-center text-[15px]">{image.alt}</p>
    </div>
  );
}
