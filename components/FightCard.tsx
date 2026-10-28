import Link from 'next/link';
import ImageSlot from '@/components/ImageSlot';

export type FightCardItem = {
  key: string;
  big: string;
  small?: string;
  title: string;
  where?: string;
  detail?: string;
  href?: string;
  main?: boolean;
  image?: string;
  imageAlt?: string;
};

function Row({ item }: { item: FightCardItem }) {
  const place = item.where && (
    <span className="bout-where">
      {item.where}
      {item.detail && <span>{item.detail}</span>}
    </span>
  );
  return (
    <>
      <span className="bout-date">
        <span className="bout-big">{item.big}</span>
        {item.small && <span className="bout-small">{item.small}</span>}
      </span>
      {item.main ? (
        <>
          <div className="bout-headliner">
            <h3 className="d-2">{item.title}</h3>
            {place}
          </div>
          <ImageSlot src={item.image} alt={item.imageAlt ?? item.title} shape="round" className="bout-photo" />
        </>
      ) : (
        <>
          <h3 className="d-2">{item.title}</h3>
          {place ?? <span />}
          {item.href && (
            <span className="round-go round-go--dark" aria-hidden="true">
              →
            </span>
          )}
        </>
      )}
    </>
  );
}

/** A fight-card list: big number on the left, the bout's name, its place, one row per entry. */
export default function FightCard({ items }: { items: FightCardItem[] }) {
  return (
    <ol className="card">
      {items.map((item) => {
        const className = `bout${item.main ? ' bout--main' : ''}${item.href ? ' bout--link' : ''}`;
        return (
          <li key={item.key}>
            {item.href ? (
              <Link href={item.href} className={className}>
                <Row item={item} />
              </Link>
            ) : (
              <div className={className}>
                <Row item={item} />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
