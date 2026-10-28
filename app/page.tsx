import Button from '@/components/Button';
import EventsSection from '@/components/home/EventsSection';
import GalleryStrip from '@/components/home/GalleryStrip';
import HomeHero from '@/components/home/HomeHero';
import HomeIntro from '@/components/home/HomeIntro';
import Programmes from '@/components/home/Programmes';
import JoinField from '@/components/JoinField';
import NewsList from '@/components/NewsList';
import Reveal from '@/components/Reveal';
import { getAbout, getAlbums, getEvents, getNewsPosts, getSite } from '@/lib/content';

export default function Home() {
  const site = getSite();
  const about = getAbout();

  return (
    <>
      <HomeHero site={site} />
      <HomeIntro about={about} logoSrc="/images/kumasa-logo.webp" />
      <Programmes about={about} />
      <EventsSection events={getEvents()} />
      <GalleryStrip albums={getAlbums()} />
      <section className="news wrap" aria-labelledby="news-title">
        <Reveal stagger className="section-head section-head--action">
          <h2 id="news-title" className="d-1">
            News
          </h2>
          <Button href="/news" variant="ink">
            All news
          </Button>
        </Reveal>
        <Reveal>
          <NewsList posts={getNewsPosts().slice(0, 3)} />
        </Reveal>
      </section>
      <JoinField site={site} />
    </>
  );
}
