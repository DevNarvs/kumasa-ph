import { describe, expect, test } from 'vitest';
import { toBaybayin } from '@/lib/baybayin';

describe('toBaybayin', () => {
  test.each([
    ['kumasa', 'ᜃᜓᜋᜐ'],
    ['kuntaw', 'ᜃᜓᜈ᜔ᜆᜏ᜔'],
    ['ngayon', 'ᜅᜌᜓᜈ᜔'],
    ['mabuhay', 'ᜋᜊᜓᜑᜌ᜔'],
    ['ako', 'ᜀᜃᜓ'],
    ['isa', 'ᜁᜐ'],
    ['kita', 'ᜃᜒᜆ'],
    ['sing', 'ᜐᜒᜅ᜔'],
  ])('%s becomes %s', (input, expected) => {
    expect(toBaybayin(input)).toBe(expected);
  });

  test('r uses the dedicated RA letter U+170D, which the font covers', () => {
    expect(toBaybayin('rosa')).toBe('ᜍᜓᜐ');
  });

  test('c becomes s before e or i and k otherwise', () => {
    expect(toBaybayin('cebu')).toBe('ᜐᜒᜊᜓ');
    expect(toBaybayin('cola')).toBe('ᜃᜓᜎ');
  });

  test('ñ is written as ny', () => {
    expect(toBaybayin('baño')).toBe('ᜊᜈ᜔ᜌᜓ');
  });

  test('f, v, q, z, x and j use their approximations', () => {
    expect(toBaybayin('fa')).toBe('ᜉ');
    expect(toBaybayin('va')).toBe('ᜊ');
    expect(toBaybayin('qa')).toBe('ᜃ');
    expect(toBaybayin('za')).toBe('ᜐ');
    expect(toBaybayin('taxi')).toBe('ᜆᜃ᜔ᜐᜒ');
    expect(toBaybayin('ja')).toBe('ᜇ᜔ᜌ');
  });

  test('spaces and digits pass through', () => {
    expect(toBaybayin('ana 2015')).toBe('ᜀᜈ 2015');
  });

  test('upper case is folded', () => {
    expect(toBaybayin('KUMASA')).toBe(toBaybayin('kumasa'));
  });

  test('empty input returns an empty string', () => {
    expect(toBaybayin('')).toBe('');
  });

  test('an emoji passes through unchanged', () => {
    expect(toBaybayin('🙂')).toBe('🙂');
    expect(toBaybayin('ka🙂')).toBe('ᜃ🙂');
  });

  test('a 200-character input returns without throwing', () => {
    const long = 'kumasa '.repeat(30).slice(0, 200);
    expect(() => toBaybayin(long)).not.toThrow();
    expect(toBaybayin(long).length).toBeGreaterThan(0);
  });
});
