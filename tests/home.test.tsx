import { render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Home from '@/app/page';
import type { NewsPost } from '@/lib/content';

const makePost = (n: number): NewsPost => ({
  slug: `post-${n}`,
  title: `Post ${n}`,
  date: `2026-0${6 - n}-05`,
  excerpt: `Excerpt ${n}`,
  cover: `/images/cover-${n}.jpg`,
  html: `<p>Body ${n}</p>`,
});

vi.mock('@/lib/content', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/content')>()),
  getNewsPosts: () => [1, 2, 3, 4, 5].map(makePost),
}));


describe('Home page', () => {
  test('home shows exactly 3 latest news cards, newest first', () => {
    render(<Home />);
    const news = screen.getByRole('region', { name: 'News' });
    const titles = within(news)
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual(['Post 1', 'Post 2', 'Post 3']);
  });

  test('home gallery preview shows at most 6 images', () => {
    render(<Home />);
    const gallery = screen.getByRole('region', { name: 'Gallery' });
    expect(within(gallery).getAllByRole('img')).toHaveLength(6);
  });

  test('home has a single h1 and every section in spec order', () => {
    render(<Home />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('region').map((r) => r.getAttribute('aria-label'))).toEqual([
      'About',
      'What we do',
      'Officers',
      'Gallery',
      'News',
      'Contact',
    ]);
  });

  test('contact CTA links to /contact', () => {
    render(<Home />);
    const contact = screen.getByRole('region', { name: 'Contact' });
    expect(within(contact).getByRole('link', { name: /contact us/i })).toHaveAttribute(
      'href',
      '/contact',
    );
  });
});
