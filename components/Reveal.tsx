'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Release the direct children one after another instead of the group as one block. */
  stagger?: boolean;
  as?: ElementType;
  className?: string;
};

const STEP_MS = 80;

/**
 * Lets a group rise into place the first time it enters the screen.
 * Content is visible by default: only groups that start below the fold, with motion allowed
 * and IntersectionObserver available, are held back.
 */
export default function Reveal({ children, stagger = false, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const parts = stagger ? (Array.from(el.children) as HTMLElement[]) : [el];
    parts.forEach((part, i) => {
      part.setAttribute('data-pending', '');
      part.style.transitionDelay = `${i * STEP_MS}ms`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        parts.forEach((part) => part.removeAttribute('data-pending'));
        observer.disconnect();
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  return (
    <Tag ref={ref} className={`reveal ${stagger ? 'reveal-stagger' : ''} ${className ?? ''}`.trim()}>
      {children}
    </Tag>
  );
}
