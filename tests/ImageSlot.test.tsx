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

  test('without src renders a plain labelled frame with no star and no img', () => {
    const { container } = render(<ImageSlot alt="Officer portrait" />);
    const frame = screen.getByRole('img', { name: 'Officer portrait' });
    expect(frame.tagName).not.toBe('IMG');
    expect(container.querySelector('img')).toBeNull();
    expect(container).not.toHaveTextContent('★');
    expect(frame).toHaveClass('bg-[var(--surface)]');
  });

  test('applies the shape class', () => {
    const { container, rerender } = render(<ImageSlot alt="Round slot" shape="round" />);
    expect(container.firstElementChild).toHaveClass('rounded-full', 'aspect-square');
    rerender(<ImageSlot src="/images/photo.jpg" alt="Square photo" shape="square" />);
    expect(container.firstElementChild).toHaveClass('aspect-square');
    rerender(<ImageSlot src="/images/photo.jpg" alt="Fill photo" shape="fill" />);
    expect(container.firstElementChild).toHaveClass('absolute', 'inset-0');
  });
});
