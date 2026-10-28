import Button from '@/components/Button';
import FightCard from '@/components/FightCard';
import Reveal from '@/components/Reveal';
import type { EventItem } from '@/lib/content';
import { formatDayMonth } from '@/lib/format';

export default function EventsSection({ events }: { events: EventItem[] }) {
  return (
    <section id="events" className="events wrap" aria-labelledby="events-title">
      <Reveal stagger className="section-head section-head--action">
        <h2 id="events-title" className="d-1">
          Coming up
        </h2>
        <Button href="/contact" variant="ink">
          Register a club
        </Button>
      </Reveal>
      {events.length === 0 ? (
        <p className="statement">No events announced yet.</p>
      ) : (
        <Reveal>
          <FightCard
            items={events.map((event) => {
              const { day, month } = formatDayMonth(event.date);
              return {
                key: `${event.date}-${event.title}`,
                big: day,
                small: month,
                title: event.title,
                where: event.venue,
                detail: event.detail,
                href: '/contact',
                main: event.main,
                image: event.image,
                imageAlt: `${event.title}, ${event.venue}`,
              };
            })}
          />
        </Reveal>
      )}
    </section>
  );
}
