import Image from 'next/image';

type SectionHeadingProps = { title: string; eyebrow?: string };

export default function SectionHeading({ title, eyebrow }: SectionHeadingProps) {
  return (
    <div className="mb-10">
      {eyebrow && (
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl uppercase tracking-wide md:text-5xl">{title}</h2>
      <Image
        src="/images/baybayin-rule.svg"
        alt=""
        aria-hidden="true"
        width={240}
        height={16}
        unoptimized
        className="mt-4 opacity-70"
      />
    </div>
  );
}
