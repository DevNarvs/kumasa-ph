import { render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Hero from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import OfficerCard from '@/components/OfficerCard';
import TimelineList from '@/components/TimelineList';
import Home from '@/app/page';
import type { NewsPost, SiteInfo } from '@/lib/content';

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

const site: SiteInfo = {
  name: 'KUMASA',
  fullName: 'Kuntaw Unified Martial Sports Advocates',
  tagline: 'Filipino Martial Art',
  founded: 2015,
  description: 'We train in Kuntaw.',
  heroImage: '/images/hero.jpg',
  heroAlt: 'Hero',
  email: 'info@kumasa.example',
  phone: '000',
  address: 'Somewhere',
  socials: [],
};

describe('Hero', () => {
  test('hero shows KUMASA as the h1 with the full name and tagline', () => {
    render(<Hero site={site} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('KUMASA');
    expect(screen.getByText('Kuntaw Unified Martial Sports Advocates')).toBeInTheDocument();
    expect(screen.getByText('Filipino Martial Art')).toBeInTheDocument();
  });
});

describe('OfficerCard', () => {
  test('OfficerCard shows a placeholder when photo is missing', () => {
    render(<OfficerCard officer={{ name: 'Juan Dela Cruz', role: 'President', bio: 'Bio' }} />);
    expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    expect(screen.getByText('President')).toBeInTheDocument();
    const portrait = screen.getByRole('img', { name: 'Portrait of Juan Dela Cruz' });
    expect(portrait.tagName).not.toBe('IMG');
  });

  test('OfficerCard shows the photo when one is given', () => {
    render(
      <OfficerCard
        officer={{ name: 'Juan Dela Cruz', role: 'President', bio: 'Bio', photo: '/images/j.jpg' }}
      />,
    );
    expect(screen.getByRole('img', { name: 'Portrait of Juan Dela Cruz' }).tagName).toBe('IMG');
  });
});

describe('NewsCard', () => {
  test('NewsCard shows a placeholder when cover is missing', () => {
    render(<NewsCard post={{ ...makePost(1), cover: undefined }} />);
    const cover = screen.getByRole('img', { name: 'Cover image for Post 1' });
    expect(cover.tagName).not.toBe('IMG');
  });

  test('NewsCard links to the post and shows a formatted date', () => {
    render(<NewsCard post={{ ...makePost(1), date: '2026-01-05' }} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/news/post-1');
    expect(screen.getByText('January 5, 2026')).toHaveAttribute('datetime', '2026-01-05');
  });
});

describe('TimelineList', () => {
  test('TimelineList renders entries in the order given', () => {
    render(
      <TimelineList
        entries={[
          { year: 2015, title: 'Founded', description: 'First' },
          { year: 2020, title: 'Grew', description: 'Second' },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('2015');
    expect(items[1]).toHaveTextContent('2020');
  });
});

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
