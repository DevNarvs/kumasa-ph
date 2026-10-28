import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Field from '@/components/Field';
import MaskedLines from '@/components/MaskedLines';
import { TONES } from '@/lib/tones';

describe('Field', () => {
  test('Field exposes its tone and label as a region', () => {
    render(
      <Field tone="red" label="Hero">
        content
      </Field>,
    );
    const region = screen.getByRole('region', { name: 'Hero' });
    expect(region).toHaveAttribute('data-tone', 'red');
    expect(region.style.getPropertyValue('--ground')).toBe(TONES.red.ground);
    expect(region.style.getPropertyValue('--ink')).toBe(TONES.red.ink);
  });

  test('Field is not a region without a label', () => {
    render(<Field tone="blue">content</Field>);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  test('Field is tall by default and not when tall is false', () => {
    const { container, rerender } = render(<Field tone="paper">a</Field>);
    expect(container.firstElementChild?.className).toContain('min-h-[90svh]');
    rerender(
      <Field tone="paper" tall={false}>
        a
      </Field>,
    );
    expect(container.firstElementChild?.className).not.toContain('min-h-[90svh]');
  });

  test('Field renders as the element given by as', () => {
    const { container } = render(
      <Field tone="black" as="footer">
        a
      </Field>,
    );
    expect(container.firstElementChild?.tagName).toBe('FOOTER');
  });
});

describe('MaskedLines', () => {
  test('MaskedLines renders every line inside one heading and is visible without script', () => {
    render(<MaskedLines lines={['KUMASA', 'KUNTAW']} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('KUMASA KUNTAW');
    expect(heading).toBeVisible();
    expect(heading.querySelectorAll('span.line')).toHaveLength(2);
  });

  test('MaskedLines can render an h2', () => {
    render(<MaskedLines as="h2" lines={['One']} />);
    expect(screen.getByRole('heading', { level: 2, name: 'One' })).toBeInTheDocument();
  });
});
