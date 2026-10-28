import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import PageHeading from '@/components/PageHeading';
import { getSite } from '@/lib/content';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  const site = getSite();

  return (
    <>
      <PageHeading title="Contact" intro="Questions about KUMASA, training or events? Get in touch." />
      <section aria-label="Contact details" className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 md:grid-cols-2 md:px-6">
        <dl className="space-y-6 text-[1rem]">
          <div>
            <dt className="text-muted">Email</dt>
            <dd>
              <a href={`mailto:${site.email}`} className="underline underline-offset-4">
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted">Phone</dt>
            <dd>{site.phone}</dd>
          </div>
          <div>
            <dt className="text-muted">Address</dt>
            <dd>{site.address}</dd>
          </div>
        </dl>
        <ContactForm endpoint={process.env.NEXT_PUBLIC_FORM_ENDPOINT} email={site.email} />
      </section>
    </>
  );
}
