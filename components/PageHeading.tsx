import Image from 'next/image';

type PageHeadingProps = { title: string; intro?: string };

export default function PageHeading({ title, intro }: PageHeadingProps) {
  return (
    <header className="mx-auto max-w-6xl px-4 pb-8 pt-16 md:px-6 md:pt-24">
      <h1 className="font-display text-5xl uppercase tracking-wide md:text-7xl">{title}</h1>
      <Image
        src="/images/baybayin-rule.svg"
        alt=""
        aria-hidden="true"
        width={240}
        height={16}
        unoptimized
        className="mt-5 opacity-70"
      />
      {intro && <p className="mt-6 max-w-2xl text-lg text-muted">{intro}</p>}
    </header>
  );
}
