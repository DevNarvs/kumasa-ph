import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import SiteHeader from '@/components/SiteHeader';

describe('SiteHeader', () => {
  test('renders the main navigation inside a black field', () => {
    const { container } = render(<SiteHeader />);
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'black');
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });
});
