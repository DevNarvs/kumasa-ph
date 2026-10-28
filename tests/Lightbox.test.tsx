import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import Lightbox from '@/components/Lightbox';

const images = [
  { src: '/a.jpg', alt: 'Image A' },
  { src: '/b.jpg', alt: 'Image B' },
  { src: '/c.jpg', alt: 'Image C' },
];

function Harness({ start, list = images, onClose = () => {} }: {
  start: number;
  list?: typeof images;
  onClose?: () => void;
}) {
  const [index, setIndex] = useState(start);
  return <Lightbox images={list} index={index} onClose={onClose} onIndexChange={setIndex} />;
}

const shown = () => within(screen.getByRole('dialog')).getByRole('img');

describe('Lightbox', () => {
  test('ArrowRight advances and ArrowLeft goes back', async () => {
    const user = userEvent.setup();
    render(<Harness start={1} />);
    expect(shown()).toHaveAccessibleName('Image B');
    await user.keyboard('{ArrowRight}');
    expect(shown()).toHaveAccessibleName('Image C');
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(shown()).toHaveAccessibleName('Image A');
  });

  test('ArrowRight on the last image stays on the last image', async () => {
    const user = userEvent.setup();
    render(<Harness start={2} />);
    await user.keyboard('{ArrowRight}');
    expect(shown()).toHaveAccessibleName('Image C');
    expect(screen.getByRole('button', { name: 'Next image' })).toBeDisabled();
  });

  test('ArrowLeft on the first image stays on the first', async () => {
    const user = userEvent.setup();
    render(<Harness start={0} />);
    await user.keyboard('{ArrowLeft}');
    expect(shown()).toHaveAccessibleName('Image A');
    expect(screen.getByRole('button', { name: 'Previous image' })).toBeDisabled();
  });

  test('Escape calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness start={0} onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('focus is trapped inside the dialog', async () => {
    const user = userEvent.setup();
    render(<Harness start={1} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    const next = screen.getByRole('button', { name: 'Next image' });
    const close = screen.getByRole('button', { name: 'Close' });
    next.focus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(next).toHaveFocus();
  });

  test('with a single image both arrows are disabled and Tab stays on Close', async () => {
    const user = userEvent.setup();
    render(<Harness start={0} list={[images[0]]} />);
    expect(screen.getByRole('button', { name: 'Previous image' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next image' })).toBeDisabled();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });
});
