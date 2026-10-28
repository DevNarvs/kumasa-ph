'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/Button';
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
    <header className="relative flex items-center justify-between gap-6 text-[var(--ink)]">
      <Link
        href="/"
        aria-label="KUMASA home"
        className="relative z-[60] flex items-center gap-3.5 text-[clamp(22px,2.3vw,34px)] font-extrabold [font-stretch:70%] no-underline"
      >
        <Image
          src="/images/kumasa-logo.webp"
          alt=""
          width={52}
          height={52}
          unoptimized
          className="h-11 w-11 rounded-full md:h-[52px] md:w-[52px]"
        />
        KUMASA
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
        className={`fixed inset-0 z-50 flex flex-col justify-center bg-[var(--bg)] px-[var(--m)] md:visible md:static md:z-auto md:flex-row md:items-center md:bg-transparent md:p-0 ${
          open ? 'visible' : 'invisible'
        }`}
      >
        <ul className="flex flex-col gap-5 md:flex-row md:items-center md:gap-[clamp(18px,2.4vw,36px)]">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                aria-current={pathname === href ? 'page' : undefined}
                className="nav-link d-1 no-underline md:text-[18px] md:font-medium md:[font-stretch:100%] md:leading-normal md:tracking-normal"
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="mt-4 md:mt-0" onClick={() => setOpen(false)}>
            <Button
              href="/contact"
              variant={pathname === '/contact' ? 'ink' : 'accent'}
              className="md:min-h-[46px] md:px-5"
            >
              Join a club
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
