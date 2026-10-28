import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import JoinField from '@/components/JoinField';
import { getSite } from '@/lib/content';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  const site = getSite();

  return (
    <JoinField site={site} heading="Contact KUMASA" as="header-page">
      <ContactForm endpoint={process.env.NEXT_PUBLIC_FORM_ENDPOINT} email={site.email} />
    </JoinField>
  );
}
