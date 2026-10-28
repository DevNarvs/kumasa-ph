import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import ImageSlot from '@/components/ImageSlot';

describe('ImageSlot', () => {
  test('renders an img with alt when src is provided', () => {
    render(<ImageSlot src="/images/photo.jpg" alt="Sparring at the 2026 open" />);
    const img = screen.getByRole('img', { name: 'Sparring at the 2026 open' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', expect.stringContaining('/images/photo.jpg'));
  });

  test('renders a labelled placeholder when src is missing', () => {
    render(<ImageSlot alt="Officer portrait" />);
    const placeholder = screen.getByRole('img', { name: 'Officer portrait' });
    expect(placeholder.tagName).not.toBe('IMG');
  });

  test('applies aspect class', () => {
    const { container, rerender } = render(<ImageSlot alt="Portrait slot" aspect="portrait" />);
    expect(container.firstElementChild).toHaveClass('aspect-[3/4]');
    rerender(<ImageSlot src="/images/photo.jpg" alt="Square photo" aspect="square" />);
    expect(container.firstElementChild).toHaveClass('aspect-square');
  });
});
