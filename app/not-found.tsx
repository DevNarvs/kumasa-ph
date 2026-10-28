import Link from 'next/link';
import PageHeading from '@/components/PageHeading';

export default function NotFound() {
  return (
    <>
      <PageHeading
        title="Page not found"
        intro="The page you are looking for does not exist or has moved."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <Link
          href="/"
          className="inline-block bg-gold px-6 py-3 font-display uppercase tracking-wide text-(--color-base) hover:brightness-110"
        >
          Back to home
        </Link>
      </div>
    </>
  );
}
