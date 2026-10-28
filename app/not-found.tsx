import Button from '@/components/Button';
import PageHeading from '@/components/PageHeading';

export default function NotFound() {
  return (
    <>
      <PageHeading title="Page not found" intro="The page you are looking for does not exist or has moved." />
      <div className="wrap pb-[var(--gap)] pt-12">
        <Button href="/">Back to home</Button>
      </div>
    </>
  );
}
