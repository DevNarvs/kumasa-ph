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

  test('nav has About, Events, Gallery, News and a Join a club button to /contact', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(
      within(nav)
        .getAllByRole('link')
        .map((a) => [a.textContent?.replace('→', '').trim(), a.getAttribute('href')]),
    ).toEqual([
      ['About', '/about'],
      ['Events', '/#events'],
      ['Gallery', '/gallery'],
      ['News', '/news'],
      ['Join a club', '/contact'],
    ]);
  });

  test('the home link is named KUMASA home and shows the wordmark', () => {
    render(<Header />);
    const home = screen.getByRole('link', { name: 'KUMASA home' });
    expect(home).toHaveAttribute('href', '/');
    expect(home).toHaveTextContent('KUMASA');
  });

  test('focus wraps between the menu button and the last link while the menu is open', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const button = screen.getByRole('button', { name: /menu/i });
    await user.click(button);
    screen.getByRole('link', { name: /join a club/i }).focus();
    await user.tab();
    expect(button).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('link', { name: /join a club/i })).toHaveFocus();
  });

  test('Header takes its ink from the --ink token', () => {
    render(<Header />);
    expect(screen.getByRole('banner').className).toContain('text-[var(--ink)]');
  });
});
