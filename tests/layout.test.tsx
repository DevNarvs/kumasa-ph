import { render, screen } from '@testing-library/react';
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
  test('shows the copyright with the org name and links to every route', () => {
    render(<Footer site={site} />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} KUMASA`))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gallery' })).toHaveAttribute('href', '/gallery');
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
