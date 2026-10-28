'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { navLinks } from '@/lib/nav';

export default function Header() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = [
        buttonRef.current,
        ...Array.from(navRef.current?.querySelectorAll<HTMLElement>('a') ?? []),
      ].filter((el): el is HTMLElement => el !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className="relative flex h-20 items-center justify-between text-[var(--ink)]">
      <Link href="/" aria-label="KUMASA home" className="relative z-[60] block h-11 w-11">
        <Image
          src="/images/kumasa-logo.webp"
          alt=""
          width={44}
          height={44}
          unoptimized
          className="rounded-full"
        />
      </Link>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="site-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
        className="relative z-[60] flex h-11 w-11 items-center justify-center md:hidden"
      >
        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <nav
        id="site-nav"
        ref={navRef}
        aria-label="Main"
        className={`fixed inset-0 z-50 flex flex-col justify-center bg-[var(--ground)] px-[var(--margin)] md:visible md:static md:z-auto md:flex-row md:justify-end md:bg-transparent md:p-0 ${
          open ? 'visible' : 'invisible'
        }`}
      >
        <ul className="flex flex-col gap-5 md:flex-row md:gap-8">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                aria-current={pathname === href ? 'page' : undefined}
                className="font-display text-5xl uppercase underline-offset-8 hover:underline aria-[current=page]:underline md:font-body md:text-[1rem] md:font-medium md:normal-case md:underline-offset-4"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
