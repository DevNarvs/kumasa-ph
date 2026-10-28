import { render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Home from '@/app/page';
import { getAlbums, getNewsPosts, type Album, type NewsPost } from '@/lib/content';

const makePost = (n: number): NewsPost => ({
  slug: `post-${n}`,
  title: `Post ${n}`,
  date: `2026-0${6 - n}-05`,
  excerpt: `Excerpt ${n}`,
  cover: n === 1 ? '/images/cover-1.jpg' : undefined,
  html: `<p>Body ${n}</p>`,
});

const albums: Album[] = [
  {
    slug: 'events',
    title: 'Events',
    description: 'Events',
    images: [1, 2, 3, 4].map((n) => ({ src: `/images/e-${n}.jpg`, alt: `Event ${n}` })),
  },
  {
    slug: 'training',
    title: 'Training',
    description: 'Training',
    images: [1, 2].map((n) => ({ src: `/images/t-${n}.jpg`, alt: `Training ${n}` })),
  },
];

vi.mock('@/lib/content', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/content')>()),
  getNewsPosts: vi.fn(() => [1, 2, 3, 4, 5].map(makePost)),
  getAlbums: vi.fn(() => albums),
  getEvents: () => [
    { date: '2026-11-15', title: 'National Open', venue: 'Cebu', detail: 'All', main: true },
  ],
}));

describe('Home page', () => {
  test('has one h1 and its sections in order', () => {
    render(<Home />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'One home for Kuntaw',
      'Programmes',
      'Coming up',
      'From the mat',
      'News',
      'Train with us',
    ]);
  });

  test('the gallery strip shows the first five photos, labelled by album', () => {
    render(<Home />);
    const strip = screen.getByRole('region', { name: 'From the mat' });
    const items = within(within(strip).getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items.map((item) => item.textContent)).toEqual([
      'Events',
      'Events',
      'Events',
      'Events',
      'Training',
    ]);
    expect(within(strip).getByRole('link', { name: /open the gallery/i })).toHaveAttribute('href', '/gallery');
  });

  test('the gallery strip is empty, not broken, when there are no photos', () => {
    vi.mocked(getAlbums).mockReturnValueOnce([{ ...albums[0], images: [] }]);
    render(<Home />);
    const strip = screen.getByRole('region', { name: 'From the mat' });
    expect(within(strip).queryAllByRole('listitem')).toHaveLength(0);
  });

  test('news leads with the newest post and lists the next two', () => {
    render(<Home />);
    const news = screen.getByRole('region', { name: 'News' });
    expect(within(news).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Post 1',
      'Post 2',
      'Post 3',
    ]);
    expect(within(news).getByRole('link', { name: 'Post 1' })).toHaveAttribute('href', '/news/post-1');
    expect(within(news).getByText('May 5, 2026')).toHaveAttribute('datetime', '2026-05-05');
    expect(within(news).getByRole('link', { name: /all news/i })).toHaveAttribute('href', '/news');
  });

  test('news says so when there are no posts', () => {
    vi.mocked(getNewsPosts).mockReturnValueOnce([]);
    render(<Home />);
    expect(screen.getByText('No news yet')).toBeInTheDocument();
  });

  test('the Join field writes an email and holds the name writer', () => {
    render(<Home />);
    const join = screen.getByRole('region', { name: 'Train with us' });
    expect(within(join).getByRole('link', { name: /write to us/i }).getAttribute('href')).toContain(
      'subject=Joining%20KUMASA',
    );
    expect(within(join).getByLabelText('Your name in Baybayin, as on our badge')).toBeInTheDocument();
    expect(within(join).getByText('info@kumasa.ph')).toBeInTheDocument();
  });
});
