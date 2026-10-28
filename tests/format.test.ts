import { describe, expect, test } from 'vitest';
import { formatDayMonth } from '@/lib/format';

describe('formatDayMonth', () => {
  test('returns the day without a leading zero and the short month', () => {
    expect(formatDayMonth('2026-12-06')).toEqual({ day: '6', month: 'Dec' });
  });

  test('reads the date in UTC', () => {
    expect(formatDayMonth('2027-01-24')).toEqual({ day: '24', month: 'Jan' });
  });
});
