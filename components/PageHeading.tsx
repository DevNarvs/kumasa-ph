type PageHeadingProps = { title: string; intro?: string };

/** Opens an inner page below the site header: the title at d-1, an optional statement. */
export default function PageHeading({ title, intro }: PageHeadingProps) {
  return (
    <header className="page-heading wrap">
      <h1 className="d-1">{title}</h1>
      {intro && <p className="statement max-w-[36ch]">{intro}</p>}
    </header>
  );
}
