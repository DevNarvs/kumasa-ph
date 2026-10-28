import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'accent' | 'ink';
  arrow?: boolean;
  className?: string;
};

const fills = {
  accent: 'bg-[var(--accent)] text-[var(--accent-ink)]',
  ink: 'bg-[var(--bg)] text-[var(--ink)]',
};

export default function Button({
  href,
  children,
  variant = 'accent',
  arrow = true,
  className = '',
}: ButtonProps) {
  const classes = `btn group inline-flex min-h-14 items-center gap-3 px-7 text-[18px] font-bold [font-stretch:85%] no-underline ${fills[variant]} ${className}`.trim();
  const content = (
    <>
      {children}
      {arrow && (
        <span aria-hidden="true" className="btn-arrow">
          →
        </span>
      )}
    </>
  );

  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}
