'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealState = 'visible' | 'pending' | 'shown';

export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>('visible');

  useEffect(() => {
    const el = ref.current;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState('pending');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown');
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        state === 'pending'
          ? 'translate-y-4 opacity-0'
          : 'translate-y-0 opacity-100 transition duration-700 ease-out'
      }
    >
      {children}
    </div>
  );
}
