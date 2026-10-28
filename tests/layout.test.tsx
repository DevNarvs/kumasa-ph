import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
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

describe('Footer', () => {
  test('has the copyright, the name, every nav link and the contact email', () => {
    render(<Footer site={site} />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} KUMASA`))).toBeInTheDocument();
    expect(screen.getByText('KUMASA')).toHaveAttribute('aria-hidden', 'true');
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
