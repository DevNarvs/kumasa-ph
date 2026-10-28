import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import Header from '@/components/Header';

describe('Header', () => {
  test('menu button toggles aria-expanded', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const button = screen.getByRole('button', { name: /menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape closes the open menu and returns focus to the button', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const button = screen.getByRole('button', { name: /menu/i });
    await user.click(button);
    screen.getByRole('link', { name: 'About' }).focus();
    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  test('nav contains links to all five routes', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '/',
      '/about',
      '/gallery',
      '/news',
      '/contact',
    ]);
  });

  test('focus wraps between the menu button and the last link while the menu is open', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const button = screen.getByRole('button', { name: /menu/i });
    await user.click(button);
    screen.getByRole('link', { name: 'Contact' }).focus();
    await user.tab();
    expect(button).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveFocus();
  });

  test('Header takes its ink from the surrounding Field', () => {
    render(<Header />);
    expect(screen.getByRole('banner').className).toContain('text-[var(--ink)]');
  });
});
