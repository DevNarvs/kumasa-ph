import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Header from '@/components/Header';

vi.mock('next/navigation', () => ({ usePathname: () => '/contact' }));

describe('Header on the contact page', () => {
  test('the Join a club button switches to the ground fill so it shows on the red field', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /join a club/i })).toHaveClass('bg-[var(--bg)]');
  });
});
