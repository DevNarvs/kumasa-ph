import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import EventsSection from '@/components/home/EventsSection';
import HomeHero from '@/components/home/HomeHero';
import HomeIntro from '@/components/home/HomeIntro';
import Programmes from '@/components/home/Programmes';
import type { About, EventItem, SiteInfo } from '@/lib/content';

const site: SiteInfo = {
  name: 'KUMASA',
  fullName: 'Kuntaw Unified Martial Sports Advocates',
  tagline: 'Filipino Martial Art',
  founded: 2015,
  description: 'We train, grade and compete in Kuntaw.',
  heroImage: '/images/hero.svg',
  heroAlt: 'Sparring final',
  email: 'info@kumasa.ph',
  phone: '000',
  address: 'Quezon City',
  socials: [],
};

const activity = (title: string, href: string) => ({
  title,
  description: `${title} blurb.`,
  word: 'Word',
  detail: 'Detail',
  href,
  image: `/images/${title}.svg`,
});

const about: About = {
  title: 'About KUMASA',
  excerpt: 'KUMASA brings clubs under one badge.',
  statement: 'One home for Kuntaw',
  facts: ['Since 2015', 'Kuntaw', 'Clubs across the Philippines'],
  programmesIntro: 'Every programme follows one syllabus.',
  activities: [
    activity('Training', '/contact'),
    activity('Competition', '/#events'),
    activity('Gradings and seminars', '/#events'),
    activity('Community', '/contact'),
  ],
  html: '<p>Story</p>',
};

const events: EventItem[] = [
  { date: '2026-11-15', title: 'National Open', venue: 'Cebu City', detail: 'All divisions', main: true, image: '/images/open.svg' },
  { date: '2026-12-06', title: 'Black belt grading', venue: 'Quezon City', detail: 'By invitation', main: false },
  { date: '2027-01-24', title: "Coaches' seminar", venue: 'Davao City', detail: 'Two days', main: false },
];

describe('HomeHero', () => {
  test('the h1 is named KUMASA and spells it one letter at a time', () => {
    render(<HomeHero site={site} />);
    const h1 = screen.getByRole('heading', { level: 1, name: 'KUMASA' });
    expect(h1.querySelectorAll('span')).toHaveLength(6);
  });

  test('the lede gives the full name and the description; Join a club goes to /contact', () => {
    render(<HomeHero site={site} />);
    expect(
      screen.getByText('Kuntaw Unified Martial Sports Advocates. We train, grade and compete in Kuntaw.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /join a club/i })).toHaveAttribute('href', '/contact');
  });

  test('the hero picture is the site hero image', () => {
    render(<HomeHero site={site} />);
    expect(screen.getByRole('img', { name: 'Sparring final' })).toHaveAttribute(
      'src',
      expect.stringContaining('/images/hero.svg'),
    );
  });
});

describe('HomeIntro', () => {
  test('shows the statement, the excerpt, three facts and the badge', () => {
    render(<HomeIntro about={about} logoSrc="/images/kumasa-logo.webp" />);
    expect(screen.getByRole('heading', { level: 2, name: 'One home for Kuntaw' })).toBeInTheDocument();
    expect(screen.getByText('KUMASA brings clubs under one badge.')).toBeInTheDocument();
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('img', { name: /^The KUMASA badge/ })).toBeInTheDocument();
  });
});

describe('Programmes', () => {
  test('has a Programmes heading with the intro and four linked panels', () => {
    render(<Programmes about={about} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Programmes' })).toBeInTheDocument();
    expect(screen.getByText('Every programme follows one syllabus.')).toBeInTheDocument();
    expect(
      screen.getAllByRole('link').map((a) => [within(a).getByRole('heading', { level: 3 }).textContent, a.getAttribute('href')]),
    ).toEqual([
      ['Training', '/contact'],
      ['Competition', '/#events'],
      ['Gradings and seminars', '/#events'],
      ['Community', '/contact'],
    ]);
  });
});

describe('EventsSection', () => {
  test('lists each event as one link, in the order given, with day and month', () => {
    render(<EventsSection events={events} />);
    const list = screen.getByRole('list');
    const rows = within(list).getAllByRole('link');
    expect(rows.map((row) => within(row).getByRole('heading', { level: 3 }).textContent)).toEqual([
      'National Open',
      'Black belt grading',
      "Coaches' seminar",
    ]);
    expect(within(rows[0]).getByText('15')).toBeInTheDocument();
    expect(within(rows[0]).getByText('Nov')).toBeInTheDocument();
    expect(rows[1]).toHaveAttribute('href', '/contact');
  });

  test('only the main event carries a round picture', () => {
    render(<EventsSection events={events} />);
    const rows = within(screen.getByRole('list')).getAllByRole('link');
    expect(within(rows[0]).getByRole('img')).toBeInTheDocument();
    expect(within(rows[1]).queryByRole('img')).toBeNull();
  });

  test('with no events it says so and still offers Register a club', () => {
    render(<EventsSection events={[]} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Coming up' })).toBeInTheDocument();
    expect(screen.getByText('No events announced yet.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register a club/i })).toHaveAttribute('href', '/contact');
  });
});
