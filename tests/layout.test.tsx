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
  test('returns the name at full width, hidden from screen readers', () => {
    render(<Footer site={site} />);
    const name = screen.getByText('KUMASA', { selector: 'p' });
    expect(name).toHaveAttribute('aria-hidden', 'true');
    expect(name).toHaveClass('d-hero');
  });

  test('has the full-name line, every footer link and Back to top', () => {
    render(<Footer site={site} />);
    expect(
      screen.getByText('Kuntaw Unified Martial Sports Advocates. Filipino martial art, since 2015.'),
    ).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Footer' });
    expect(
      within(nav)
        .getAllByRole('link')
        .map((a) => [a.textContent, a.getAttribute('href')]),
    ).toEqual([
      ['About', '/about'],
      ['Events', '/#events'],
      ['Gallery', '/gallery'],
      ['News', '/news'],
      ['Contact', '/contact'],
      ['Back to top', '#main'],
    ]);
  });

  test('shows the email, phone and address', () => {
    render(<Footer site={site} />);
    expect(screen.getByRole('link', { name: 'info@kumasa.example' })).toHaveAttribute(
      'href',
      'mailto:info@kumasa.example',
    );
    expect(screen.getByText('000')).toBeInTheDocument();
    expect(screen.getByText('Somewhere, Philippines')).toBeInTheDocument();
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
