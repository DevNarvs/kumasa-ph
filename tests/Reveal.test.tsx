import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Reveal from '@/components/Reveal';

let fire: (() => void) | undefined;

class FakeObserver {
  constructor(callback: IntersectionObserverCallback) {
    fire = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
  }
  observe() {}
  disconnect() {}
}

function setReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query.includes('reduce') }));
}

beforeEach(() => {
  fire = undefined;
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  setReducedMotion(false);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top: 2000 } as DOMRect);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const group = (
  <Reveal stagger>
    <h2>Heading</h2>
    <p>Text</p>
    <p>Picture</p>
  </Reveal>
);

describe('Reveal stagger', () => {
  test('children below the fold wait, 80ms apart', () => {
    render(group);
    const parts = [screen.getByText('Heading'), screen.getByText('Text'), screen.getByText('Picture')];
    parts.forEach((part) => expect(part).toHaveAttribute('data-pending'));
    expect(parts.map((part) => part.style.transitionDelay)).toEqual(['0ms', '80ms', '160ms']);
  });

  test('entering the screen releases every child', () => {
    render(group);
    act(() => fire?.());
    expect(screen.getByText('Heading')).not.toHaveAttribute('data-pending');
    expect(screen.getByText('Picture')).not.toHaveAttribute('data-pending');
  });

  test('with reduced motion no child ever waits', () => {
    setReducedMotion(true);
    render(group);
    expect(screen.getByText('Heading')).not.toHaveAttribute('data-pending');
    expect(fire).toBeUndefined();
  });

  test('a group already on screen at mount never waits', () => {
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValue({ top: 10 } as DOMRect);
    render(group);
    expect(screen.getByText('Heading')).not.toHaveAttribute('data-pending');
  });

  test('renders as the element given in as, with its class', () => {
    const { container } = render(
      <Reveal as="ul" className="strip">
        <li>One</li>
      </Reveal>,
    );
    expect(container.firstElementChild?.tagName).toBe('UL');
    expect(container.firstElementChild).toHaveClass('strip');
  });
});
