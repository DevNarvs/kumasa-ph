import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import BlockMark from '@/components/BlockMark';

describe('BlockMark', () => {
  test('labels the whole word and draws one block per letter', () => {
    const { container } = render(<BlockMark text="KUMASA" />);
    expect(screen.getByRole('img', { name: 'KUMASA' })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-block]')).toHaveLength(6);
  });

  test('is deterministic for the same text', () => {
    const first = render(<BlockMark text="KUMASA" />).container.innerHTML;
    const second = render(<BlockMark text="KUMASA" />).container.innerHTML;
    expect(second).toBe(first);
  });

  test('block heights stay between 60% and 100%', () => {
    const { container } = render(<BlockMark text="KUMASA" />);
    const heights = Array.from(container.querySelectorAll<HTMLElement>('[data-block]')).map((b) =>
      parseFloat(b.style.height),
    );
    expect(Math.min(...heights)).toBeGreaterThanOrEqual(60);
    expect(Math.max(...heights)).toBeLessThanOrEqual(100);
  });
});
