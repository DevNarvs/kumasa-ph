import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import GalleryGrid from '@/components/GalleryGrid';
import type { Album } from '@/lib/content';

const albums: Album[] = [
  {
    slug: 'events',
    title: 'Events',
    description: 'Events album',
    images: [
      { src: '/e1.jpg', alt: 'Event one' },
      { src: '/e2.jpg', alt: 'Event two' },
    ],
  },
  {
    slug: 'training',
    title: 'Training',
    description: 'Training album',
    images: [
      { src: '/t1.jpg', alt: 'Training one' },
      { src: '/t2.jpg', alt: 'Training two' },
      { src: '/t3.jpg', alt: 'Training three' },
    ],
  },
  { slug: 'seminars', title: 'Seminars', description: 'Seminars album', images: [] },
];

const thumbs = () => screen.queryAllByRole('button', { name: /^View larger/ });
const shown = () => within(screen.getByRole('dialog')).getByRole('img');

describe('GalleryGrid', () => {
  test('clicking a thumbnail opens the lightbox on that image', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid albums={albums} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'View larger: Event two' }));
    expect(shown()).toHaveAccessibleName('Event two');
  });

  test('closing the lightbox returns focus to the thumbnail that opened it', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid albums={albums} />);
    const thumb = screen.getByRole('button', { name: 'View larger: Event two' });
    await user.click(thumb);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(thumb).toHaveFocus();
  });

  test('selecting an album filters thumbnails and the lightbox navigates only within that album', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid albums={albums} />);
    expect(thumbs()).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: 'Training' }));
    expect(screen.getByRole('button', { name: 'Training' })).toHaveAttribute('aria-pressed', 'true');
    expect(thumbs()).toHaveLength(3);
    await user.click(thumbs()[0]);
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(shown()).toHaveAccessibleName('Training three');
    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    expect(shown()).toHaveAccessibleName('Training one');
  });

  test('an album with no images shows "No photos yet" instead of a grid', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid albums={albums} />);
    await user.click(screen.getByRole('button', { name: 'Seminars' }));
    expect(screen.getByText('No photos yet')).toBeInTheDocument();
    expect(thumbs()).toHaveLength(0);
  });

  test('album filters are flat square buttons; the pressed one is ink-filled', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid albums={albums} />);
    const training = screen.getByRole('button', { name: 'Training' });
    expect(training.className).not.toMatch(/\bborder\b/);
    expect(training).toHaveClass('bg-[var(--surface)]');
    await user.click(training);
    expect(training).toHaveClass('bg-[var(--ink)]', 'text-[var(--bg)]');
  });

  test('the lightbox sits on the page ground', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid albums={albums} />);
    await user.click(screen.getByRole('button', { name: 'View larger: Event one' }));
    expect(screen.getByRole('dialog')).toHaveClass('bg-[var(--bg)]');
  });

  test('with no albums at all the page shows the empty state', () => {
    render(<GalleryGrid albums={[]} />);
    expect(screen.getByText('No photos yet')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'All' })).not.toBeInTheDocument();
  });
});
