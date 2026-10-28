import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Home from '@/app/page';

test('home page renders KUMASA as the h1', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('KUMASA');
});
