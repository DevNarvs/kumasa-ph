'use client';

import { useEffect, useRef } from 'react';

type SpinBadgeProps = { src: string; alt: string; size: number };

/** The badge, turning up to ±12° as it crosses the screen. */
export default function SpinBadge({ src, alt, size }: SpinBadgeProps) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const box = img.getBoundingClientRect();
      const p = (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
      img.style.transform = `rotate(${(p * -24).toFixed(2)}deg)`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- a plain img keeps the per-frame transform cheap
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="h-auto w-full rounded-full"
    />
  );
}
