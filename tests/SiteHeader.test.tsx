import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import SiteHeader from '@/components/SiteHeader';

describe('SiteHeader', () => {
  test('renders the main navigation in a bar laid over the top of the page', () => {
    const { container } = render(<SiteHeader />);
    expect(container.firstElementChild).toHaveClass('absolute', 'inset-x-0', 'top-0');
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });
});
