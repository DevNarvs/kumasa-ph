import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import NameWriter from '@/components/NameWriter';
import { toBaybayin } from '@/lib/baybayin';

const LABEL = 'Your name in Baybayin, as on our badge';

describe('NameWriter', () => {
  test('shows KUMASA in Baybayin before anything is typed', () => {
    render(<NameWriter />);
    expect(screen.getByText('ᜃᜓᜋᜐ')).toHaveAttribute('lang', 'tl-Tglg');
    expect(screen.getByText('KUMASA')).toBeInTheDocument();
  });

  test('writes a typed name in Baybayin with the name under it', async () => {
    const user = userEvent.setup();
    render(<NameWriter />);
    await user.type(screen.getByLabelText(LABEL), 'Ana');
    expect(screen.getByText('ᜀᜈ')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  test('clearing the field brings KUMASA back', async () => {
    const user = userEvent.setup();
    render(<NameWriter />);
    const input = screen.getByLabelText(LABEL);
    await user.type(input, 'Ana');
    await user.clear(input);
    expect(screen.getByText('ᜃᜓᜋᜐ')).toBeInTheDocument();
    expect(screen.getByText('KUMASA')).toBeInTheDocument();
  });

  test('characters with no Baybayin letter pass through', async () => {
    const user = userEvent.setup();
    render(<NameWriter />);
    await user.type(screen.getByLabelText(LABEL), 'Jo 2');
    expect(screen.getByText(toBaybayin('Jo 2'))).toBeInTheDocument();
  });

  test('the field takes at most 18 characters and is announced politely', () => {
    const { container } = render(<NameWriter />);
    expect(screen.getByLabelText(LABEL)).toHaveAttribute('maxlength', '18');
    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull();
  });
});
