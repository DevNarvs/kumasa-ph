import type { CSSProperties, ReactNode } from 'react';
import { TONES, type Tone } from '@/lib/tones';

type FieldProps = {
  tone: Tone;
  as?: 'section' | 'div' | 'header' | 'footer';
  label?: string;
  tall?: boolean;
  className?: string;
  children: ReactNode;
};

export default function Field({
  tone,
  as: Tag = 'section',
  label,
  tall = true,
  className = '',
  children,
}: FieldProps) {
  const { ground, ink, displayInk } = TONES[tone];
  const style = {
    '--ground': ground,
    '--ink': ink,
    '--display-ink': displayInk,
  } as CSSProperties;

  return (
    <Tag
      data-tone={tone}
      aria-label={label}
      style={style}
      className={`bg-[var(--ground)] px-[var(--margin)] text-[var(--ink)] ${
        tall ? 'min-h-[90svh] ' : ''
      }${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
