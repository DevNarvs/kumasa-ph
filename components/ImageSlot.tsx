import Image from 'next/image';

const SHAPE = {
  video: 'relative aspect-video',
  square: 'relative aspect-square',
  round: 'relative aspect-square rounded-full',
  fill: 'absolute inset-0',
} as const;

type ImageSlotProps = {
  src?: string;
  alt: string;
  shape?: keyof typeof SHAPE;
  className?: string;
};

export default function ImageSlot({ src, alt, shape = 'video', className = '' }: ImageSlotProps) {
  const frame = `${SHAPE[shape]} overflow-hidden bg-[var(--surface)] ${className}`.trim();

  if (!src) {
    return <div role="img" aria-label={alt} className={frame} />;
  }

  return (
    <div className={frame}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
