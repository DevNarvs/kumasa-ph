import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Button from '@/components/Button';

describe('Button', () => {
  test('an internal path renders a link with that href and an arrow', () => {
    render(<Button href="/contact">Join a club</Button>);
    const link = screen.getByRole('link', { name: /join a club/i });
    expect(link).toHaveAttribute('href', '/contact');
    expect(link).toHaveTextContent('→');
  });

  test('a mailto href renders a plain anchor', () => {
    render(<Button href="mailto:info@kumasa.ph">Write to us</Button>);
    expect(screen.getByRole('link', { name: /write to us/i })).toHaveAttribute(
      'href',
      'mailto:info@kumasa.ph',
    );
  });

  test('variant ink uses the ground fill; accent is the default', () => {
    const { rerender } = render(<Button href="/a">A</Button>);
    expect(screen.getByRole('link')).toHaveClass('bg-[var(--accent)]');
    rerender(
      <Button href="/a" variant="ink">
        A
      </Button>,
    );
    expect(screen.getByRole('link')).toHaveClass('bg-[var(--bg)]');
  });

  test('arrow={false} renders no arrow', () => {
    render(
      <Button href="/a" arrow={false}>
        A
      </Button>,
    );
    expect(screen.getByRole('link')).not.toHaveTextContent('→');
  });
});
