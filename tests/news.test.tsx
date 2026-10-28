import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import NewsIndexPage from '@/app/news/page';
import NewsPostPage, { generateStaticParams } from '@/app/news/[slug]/page';
import { getNewsPosts } from '@/lib/content';
import { notFound } from 'next/navigation';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('@/lib/content', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/content')>();
  return { ...actual, getNewsPosts: vi.fn(actual.getNewsPosts) };
});

beforeEach(() => {
  vi.mocked(notFound).mockClear();
});

describe('news pages', () => {
  test('generateStaticParams returns one entry per post', () => {
    const slugs = generateStaticParams().map((p) => p.slug);
    expect(slugs).toEqual(getNewsPosts().map((p) => p.slug));
    expect(slugs.length).toBeGreaterThan(0);
  });

  test('slug page calls notFound for an unknown slug', async () => {
    await expect(
      NewsPostPage({ params: Promise.resolve({ slug: 'does-not-exist' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  test('slug page renders the post title as h1, its date, its body and a link back', async () => {
    render(
      await NewsPostPage({ params: Promise.resolve({ slug: '2026-10-12-team-named-for-the-national-open' }) }),
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Team named for the National Open');
    expect(screen.getByText('October 12, 2026')).toBeInTheDocument();
    expect(screen.getByText(/selection panel has named thirty fighters/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /all news/i })).toHaveAttribute('href', '/news');
  });

  test('news index lists all posts newest first', () => {
    render(<NewsIndexPage />);
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual([
      'Team named for the National Open',
      'New club opens in Bacolod',
      'Referee course dates announced',
    ]);
  });

  test('news index shows an empty state when there are no posts', () => {
    vi.mocked(getNewsPosts).mockReturnValueOnce([]);
    render(<NewsIndexPage />);
    expect(screen.getByText('No news yet')).toBeInTheDocument();
  });

});
