import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import AboutPage from '@/app/about/page';

describe('About page', () => {
  test('opens with the page title and the statement beside the story', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About KUMASA');
    expect(screen.getByRole('heading', { level: 2, name: 'One home for Kuntaw' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Our mission' })).toBeInTheDocument();
  });

  test('history is a fight card of years, oldest first', () => {
    render(<AboutPage />);
    const history = screen.getByRole('region', { name: 'Our history' });
    const rows = within(within(history).getByRole('list')).getAllByRole('listitem');
    expect(rows.map((row) => within(row).getByText(/^\d{4}$/).textContent)).toEqual(['2015', '2018', '2022']);
    expect(within(rows[0]).getByRole('heading', { level: 3 })).toHaveTextContent('KUMASA founded');
  });

  test('officers are round frames with name and role; a missing photo is a plain frame', () => {
    render(<AboutPage />);
    const officers = screen.getByRole('region', { name: 'Our officers' });
    const items = within(within(officers).getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(within(items[0]).getByText('President')).toBeInTheDocument();
    const lastPortrait = within(items[3]).getByRole('img');
    expect(lastPortrait.tagName).not.toBe('IMG');
    expect(lastPortrait).toHaveClass('rounded-full');
  });

  test('closes with the Join field', () => {
    render(<AboutPage />);
    expect(screen.getByRole('region', { name: 'Train with us' })).toBeInTheDocument();
  });
});
