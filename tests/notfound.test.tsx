import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import NotFound from '@/app/not-found';
import PageHeading from '@/components/PageHeading';

describe('PageHeading', () => {
  test('sets the title as a d-1 h1 with an optional statement', () => {
    render(<PageHeading title="Gallery" intro="Moments from the mat." />);
    expect(screen.getByRole('heading', { level: 1, name: 'Gallery' })).toHaveClass('d-1');
    expect(screen.getByText('Moments from the mat.')).toHaveClass('statement');
  });
});

describe('Not found page', () => {
  test('says the page was not found and links back home', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });
});
