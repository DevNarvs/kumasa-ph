'use client';

import { useState } from 'react';
import { toBaybayin } from '@/lib/baybayin';

const DEFAULT_NAME = 'KUMASA';

/** Type a name, see it in Baybayin on a black disc, as on the badge's Baybayin line. */
export default function NameWriter({ id = 'baybayin-name' }: { id?: string }) {
  const [value, setValue] = useState('');
  const name = value.trim() || DEFAULT_NAME;

  return (
    <div className="grid w-full max-w-[440px] justify-items-center gap-5">
      <div
        aria-live="polite"
        className="grid aspect-square w-full max-w-[440px] place-items-center content-center gap-3.5 rounded-full bg-[var(--bg)] p-[12%] text-center text-[var(--ink)]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" className="text-[var(--yellow)]">
          <path
            fill="currentColor"
            d="M12 1.5l3.1 6.9 7.4.8-5.5 5 1.6 7.3L12 17.8l-6.6 3.7L7 14.2l-5.5-5 7.4-.8z"
          />
        </svg>
        <span
          lang="tl-Tglg"
          className="font-[family-name:var(--font-noto-tagalog)] text-[clamp(52px,5vw,76px)] leading-[1.2] break-all"
        >
          {toBaybayin(name)}
        </span>
        <span className="text-[15px] text-[var(--muted)]">{name}</span>
      </div>
      <label htmlFor={id} className="text-[18px] font-bold [font-stretch:85%]">
        Your name in Baybayin, as on our badge
      </label>
      <input
        id={id}
        name="name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={18}
        autoComplete="given-name"
        placeholder="Type your name"
        className="min-h-14 w-full max-w-[440px] bg-[var(--bg)] px-5 text-center text-[18px] text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[var(--accent-ink)]"
      />
    </div>
  );
}
