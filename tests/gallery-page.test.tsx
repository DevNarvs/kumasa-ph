import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import PageHeading from '@/components/PageHeading';
import GalleryPage from '@/app/gallery/page';

describe('PageHeading', () => {
  test('renders an h1 with an optional intro', () => {
    const { rerender } = render(<PageHeading title="Gallery" intro="Moments from KUMASA." />);
    expect(screen.getByRole('heading', { level: 1, name: 'Gallery' })).toBeInTheDocument();
    expect(screen.getByText('Moments from KUMASA.')).toBeInTheDocument();
    rerender(<PageHeading title="Gallery" />);
    expect(screen.queryByText('Moments from KUMASA.')).not.toBeInTheDocument();
  });
});

describe('Gallery page', () => {
  test('gallery page has one h1 and an album filter for each album', () => {
    render(<GalleryPage />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    for (const name of ['All', 'Events', 'Training', 'Seminars']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
  });
});
