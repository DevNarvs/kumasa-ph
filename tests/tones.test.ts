import { describe, expect, test } from 'vitest';
import { TONES, contrastRatio, type Tone } from '@/lib/tones';

const tones = Object.keys(TONES) as Tone[];

describe('tones', () => {
  test('contrastRatio gives 21:1 for black on white, in either order', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 0);
  });

  test("every tone's ink meets 4.5:1 on its ground", () => {
    for (const tone of tones) {
      expect(contrastRatio(TONES[tone].ink, TONES[tone].ground), tone).toBeGreaterThanOrEqual(4.5);
    }
  });

  test('the display ink on red meets 3:1 and the red ink is not black', () => {
    expect(contrastRatio(TONES.red.displayInk, TONES.red.ground)).toBeGreaterThanOrEqual(3);
    expect(TONES.red.ink.toLowerCase()).not.toBe('#0a0a0a');
  });

  test('every display ink meets 3:1 on its ground', () => {
    for (const tone of tones) {
      expect(contrastRatio(TONES[tone].displayInk, TONES[tone].ground), tone).toBeGreaterThanOrEqual(3);
    }
  });

  test('adjacent home chapters differ in lightness', () => {
    const order: Tone[] = ['red', 'black', 'yellow', 'black', 'paper', 'blue', 'black'];
    for (let i = 1; i < order.length; i++) {
      const ratio = contrastRatio(TONES[order[i - 1]].ground, TONES[order[i]].ground);
      expect(ratio, `${order[i - 1]} next to ${order[i]}`).toBeGreaterThanOrEqual(1.5);
    }
  });
});
