import Header from '@/components/Header';

/** Site-wide navigation bar, laid over the top of every page. */
export default function SiteHeader() {
  return (
    <div className="absolute inset-x-0 top-0 z-50 px-[var(--m)] py-5">
      <Header />
    </div>
  );
}
