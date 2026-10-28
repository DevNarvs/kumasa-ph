import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import SpinBadge from '@/components/SpinBadge';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function setReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query.includes('reduce') }));
}

describe('SpinBadge', () => {
  test('turns with the scroll', () => {
    setReducedMotion(false);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 1000,
      height: 400,
    } as DOMRect);
    render(<SpinBadge src="/images/kumasa-logo.webp" alt="The KUMASA badge" size={480} />);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByRole('img', { name: 'The KUMASA badge' }).style.transform).toMatch(/^rotate\(-?\d/);
  });

  test('stays still with reduced motion', () => {
    setReducedMotion(true);
    render(<SpinBadge src="/images/kumasa-logo.webp" alt="The KUMASA badge" size={480} />);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByRole('img', { name: 'The KUMASA badge' }).style.transform).toBe('');
  });
});
