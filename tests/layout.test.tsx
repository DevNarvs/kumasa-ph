import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import type { SiteInfo } from '@/lib/content';

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
  address: 'Somewhere, Philippines',
  socials: [],
};

describe('SectionHeading', () => {
  test('renders the title as an h2 with an optional eyebrow', () => {
    render(<SectionHeading title="Our officers" eyebrow="Leadership" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Our officers' })).toBeInTheDocument();
    expect(screen.getByText('Leadership')).toBeInTheDocument();
  });

  test('omits the eyebrow when not given', () => {
    render(<SectionHeading title="Our officers" />);
    expect(screen.queryByText('Leadership')).not.toBeInTheDocument();
  });
});

describe('Footer', () => {
  test('has the copyright, the BlockMark, every nav link and the contact email', () => {
    render(<Footer site={site} />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} KUMASA`))).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'KUMASA' })).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Footer' });
    for (const [name, href] of [['Home', '/'], ['About', '/about'], ['Gallery', '/gallery'], ['News', '/news'], ['Contact', '/contact']]) {
      expect(within(nav).getByRole('link', { name })).toHaveAttribute('href', href);
    }
    expect(screen.getByRole('link', { name: 'info@kumasa.example' })).toHaveAttribute('href', 'mailto:info@kumasa.example');
  });
});

describe('Reveal', () => {
  test('renders its children', () => {
    render(
      <Reveal>
        <p>Visible content</p>
      </Reveal>,
    );
    expect(screen.getByText('Visible content')).toBeVisible();
  });
});
