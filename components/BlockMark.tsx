import type { CSSProperties } from 'react';

const BLOCKS = [
  { ground: '#D01C1F', ink: '#FFFFFF' },
  { ground: '#1B3FA0', ink: '#FFFFFF' },
  { ground: '#F2C300', ink: '#0A0A0A' },
  { ground: '#F5F5F5', ink: '#0A0A0A' },
];
const HEIGHTS = [100, 72, 88, 64, 96, 80];

/** The name built from solid blocks of differing height, bottoms on one line. */
export default function BlockMark({ text }: { text: string }) {
  const letters = [...text.toUpperCase()];

  return (
    <div role="img" aria-label={text} className="grid h-[40svh] min-h-64 grid-cols-3 grid-rows-2 gap-1 md:flex md:h-[34svh] md:min-h-48 md:items-end">
      {letters.map((letter, i) => {
        const block = BLOCKS[i % BLOCKS.length];
        const style = {
          height: `${HEIGHTS[i % HEIGHTS.length]}%`,
          background: block.ground,
          color: block.ink,
        } as CSSProperties;
        return (
          <span
            key={`${i}-${letter}`}
            data-block
            aria-hidden="true"
            style={style}
            className="flex min-w-0 items-end justify-center self-end overflow-hidden font-display leading-[0.8] [container-type:inline-size] md:flex-1"
          >
            <span className="block text-[120cqw]">{letter}</span>
          </span>
        );
      })}
    </div>
  );
}
