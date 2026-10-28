import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import AboutPage from '@/app/about/page';

describe('About page', () => {
  test('about page shows the story, the timeline in order and every officer', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About KUMASA');
    expect(screen.getByRole('heading', { level: 2, name: 'Our mission' })).toBeInTheDocument();

    const history = screen.getByRole('region', { name: 'History' });
    const years = within(history)
      .getAllByRole('listitem')
      .map((li) => within(li).getByText(/^\d{4}$/).textContent);
    expect(years).toEqual(['2015', '2018', '2022']);

    const officers = screen.getByRole('region', { name: 'Officers' });
    expect(within(officers).getAllByRole('heading', { level: 3 })).toHaveLength(4);
  });
});
