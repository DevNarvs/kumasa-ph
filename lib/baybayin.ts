const VIRAMA = '᜔';
const VOWEL_SIGN_I = 'ᜒ';
const VOWEL_SIGN_U = 'ᜓ';

const STANDALONE_VOWELS: Record<string, string> = {
  a: 'ᜀ',
  e: 'ᜁ',
  i: 'ᜁ',
  o: 'ᜂ',
  u: 'ᜂ',
};

const CONSONANTS: Record<string, string> = {
  k: 'ᜃ',
  g: 'ᜄ',
  t: 'ᜆ',
  d: 'ᜇ',
  n: 'ᜈ',
  p: 'ᜉ',
  b: 'ᜊ',
  m: 'ᜋ',
  y: 'ᜌ',
  r: 'ᜍ',
  l: 'ᜎ',
  w: 'ᜏ',
  s: 'ᜐ',
  h: 'ᜑ',
};
const NGA = 'ᜅ';

const APPROXIMATIONS: Record<string, string> = {
  ñ: 'ny',
  x: 'ks',
  j: 'dy',
  q: 'k',
  f: 'p',
  v: 'b',
  z: 's',
};

function approximate(input: string): string[] {
  const chars = [...input.toLowerCase()];
  return chars.flatMap((ch, i) => {
    if (ch === 'c') return [/[ei]/.test(chars[i + 1] ?? '') ? 's' : 'k'];
    return [...(APPROXIMATIONS[ch] ?? ch)];
  });
}

/** A simple modern transliteration of Latin-script text into Baybayin (Unicode Tagalog block). */
export function toBaybayin(input: string): string {
  const chars = approximate(input);
  let out = '';
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    if (ch in STANDALONE_VOWELS) {
      out += STANDALONE_VOWELS[ch];
      i += 1;
      continue;
    }
    const isNga = ch === 'n' && chars[i + 1] === 'g';
    const letter = isNga ? NGA : CONSONANTS[ch];
    if (!letter) {
      out += ch;
      i += 1;
      continue;
    }
    i += isNga ? 2 : 1;
    const vowel = chars[i];
    if (vowel === 'a') {
      out += letter;
      i += 1;
    } else if (vowel === 'e' || vowel === 'i') {
      out += letter + VOWEL_SIGN_I;
      i += 1;
    } else if (vowel === 'o' || vowel === 'u') {
      out += letter + VOWEL_SIGN_U;
      i += 1;
    } else {
      out += letter + VIRAMA;
    }
  }
  return out;
}
