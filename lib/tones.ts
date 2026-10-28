export type Tone = 'red' | 'blue' | 'yellow' | 'black' | 'paper';

type ToneColours = { ground: string; ink: string; displayInk: string };

/** Ink is for running text. Display ink is for type of 24px or larger. */
export const TONES: Record<Tone, ToneColours> = {
  red: { ground: '#D01C1F', ink: '#FFFFFF', displayInk: '#0A0A0A' },
  blue: { ground: '#1B3FA0', ink: '#FFFFFF', displayInk: '#FFFFFF' },
  yellow: { ground: '#F2C300', ink: '#0A0A0A', displayInk: '#0A0A0A' },
  black: { ground: '#0A0A0A', ink: '#FFFFFF', displayInk: '#FFFFFF' },
  paper: { ground: '#F5F5F5', ink: '#0A0A0A', displayInk: '#0A0A0A' },
};

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio of two `#RRGGBB` colours. */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
