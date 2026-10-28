import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import ContactPage from '@/app/contact/page';

describe('Contact page', () => {
  test('is the red field itself, titled Contact KUMASA', () => {
    render(<ContactPage />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const field = screen.getByRole('region', { name: 'Contact KUMASA' });
    expect(field).toHaveClass('join', 'join--page');
  });

  test('shows the email, phone and address as text', () => {
    render(<ContactPage />);
    const field = screen.getByRole('region', { name: 'Contact KUMASA' });
    expect(within(field).getAllByText('info@kumasa.ph').length).toBeGreaterThan(0);
    expect(within(field).getByText('+63 917 000 0000')).toBeInTheDocument();
    expect(within(field).getByText('Quezon City, Philippines')).toBeInTheDocument();
  });

  test('without a form endpoint it offers an email link instead of a form', () => {
    render(<ContactPage />);
    expect(screen.getByText(/email us at/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Send message' })).toBeNull();
  });
});
