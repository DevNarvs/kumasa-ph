import Image from 'next/image';

const ASPECT = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
} as const;

type ImageSlotProps = {
  src?: string;
  alt: string;
  aspect?: keyof typeof ASPECT;
  className?: string;
};

export default function ImageSlot({ src, alt, aspect = 'video', className = '' }: ImageSlotProps) {
  const shape = `${ASPECT[aspect]} ${className}`.trim();

  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${shape} flex items-center justify-center overflow-hidden border border-white/10 bg-surface bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgba(255,255,255,0.03)_14px_28px)]`}
      >
        <span aria-hidden="true" className="text-3xl text-gold/60">
          ★
        </span>
      </div>
    );
  }

  return (
    <div className={`${shape} relative overflow-hidden bg-surface`}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
