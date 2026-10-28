import Field from '@/components/Field';
import Header from '@/components/Header';

/** Site-wide navigation bar, used until each page carries the header in its own first field. */
export default function SiteHeader() {
  return (
    <Field tone="black" as="div" tall={false}>
      <Header />
    </Field>
  );
}
