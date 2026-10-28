import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import SiteHeader from '@/components/SiteHeader';

describe('SiteHeader', () => {
  test('renders the main navigation', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });
});
