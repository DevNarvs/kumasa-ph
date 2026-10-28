import path from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  getAbout,
  getAlbums,
  getEvents,
  getNewsPost,
  getNewsPosts,
  getOfficers,
  getSite,
  getTimeline,
} from '@/lib/content';

const root = path.join(__dirname, 'fixtures', 'content');
const badRoot = path.join(root, 'bad');
const badWordRoot = path.join(root, 'bad-word');
const badDetailRoot = path.join(root, 'bad-detail');
const badFactRoot = path.join(root, 'bad-fact');
const badEventsMainRoot = path.join(root, 'bad-events-main');
const badEventsDateRoot = path.join(root, 'bad-events-date');

describe('content layer', () => {
  test('getNewsPosts sorts newest first and breaks date ties by slug', () => {
    expect(getNewsPosts(root).map((p) => p.slug)).toEqual([
      '2026-02-01-newest',
      '2026-01-05-alpha',
      '2026-01-05-beta',
    ]);
  });

  test('getNewsPosts normalizes unquoted YAML dates to YYYY-MM-DD strings', () => {
    const alpha = getNewsPosts(root).find((p) => p.slug === '2026-01-05-alpha');
    expect(typeof alpha?.date).toBe('string');
    expect(alpha?.date).toBe('2026-01-05');
  });

  test('getNewsPost returns undefined for an unknown slug', () => {
    expect(getNewsPost('does-not-exist', root)).toBeUndefined();
  });

  test('getNewsPost renders markdown body to html', () => {
    expect(getNewsPost('2026-02-01-newest', root)?.html).toContain('<strong>bold</strong>');
  });

  test('getTimeline sorts ascending by year', () => {
    expect(getTimeline(root).map((e) => e.year)).toEqual([2015, 2020]);
  });

  test('getOfficers allows a missing photo', () => {
    const officers = getOfficers(root);
    expect(officers[0].photo).toBe('/images/one.jpg');
    expect(officers[1].photo).toBeUndefined();
  });

  test('getAbout exposes excerpt and activities from frontmatter', () => {
    const about = getAbout(root);
    expect(about.excerpt).toBe('Fixture excerpt about the org.');
    expect(about.activities.map((a) => a.title)).toEqual(['Training', 'Events']);
    expect(about.html).toContain('<strong>about</strong>');
  });

  test('getAbout exposes statement, and word and detail for each activity', () => {
    const about = getAbout(root);
    expect(about.statement).toBe('Fixture statement of five words');
    expect(about.activities.map((a) => [a.word, a.detail])).toEqual([
      ['Train', 'Weekly sessions'],
      ['Gather', 'Yearly'],
    ]);
  });

  test('getAbout rejects an activity word longer than 8 characters, naming about.md', () => {
    expect(() => getAbout(badWordRoot)).toThrow(/about\.md.*word/);
  });

  test('getAbout rejects an activity detail longer than 24 characters', () => {
    expect(() => getAbout(badDetailRoot)).toThrow(/about\.md.*detail/);
  });

  test('getAlbums derives slug from filename and keeps image order', () => {
    const [events] = getAlbums(root);
    expect(events.slug).toBe('events');
    expect(events.images.map((i) => i.src)).toEqual([
      '/images/b.jpg',
      '/images/a.jpg',
      '/images/c.jpg',
    ]);
  });

  test('getEvents keeps events on or after today, soonest first', () => {
    expect(getEvents(root, '2026-10-28').map((e) => e.title)).toEqual(['Open', 'Grading', 'Seminar']);
  });

  test('getEvents includes an event dated today', () => {
    expect(getEvents(root, '2026-11-15')[0].title).toBe('Open');
  });

  test('getEvents defaults main to false and reads main: true', () => {
    expect(getEvents(root, '2026-10-28').map((e) => e.main)).toEqual([true, false, false]);
  });

  test('getEvents reads venue, detail and an optional image', () => {
    const [open, grading] = getEvents(root, '2026-10-28');
    expect(open).toMatchObject({ date: '2026-11-15', venue: 'Cebu City', detail: 'All divisions', image: '/images/open.jpg' });
    expect(grading.image).toBeUndefined();
  });

  test('getEvents returns [] when events.yml holds only a comment', () => {
    expect(getEvents(path.join(root, 'empty-events'), '2026-10-28')).toEqual([]);
  });

  test('getEvents returns [] when events.yml is missing', () => {
    expect(getEvents(badRoot, '2026-10-28')).toEqual([]);
  });

  test('getEvents rejects two main events, naming events.yml', () => {
    expect(() => getEvents(badEventsMainRoot, '2026-10-28')).toThrow(/events\.yml.*main/);
  });

  test('getEvents rejects a non-ISO date, naming events.yml', () => {
    expect(() => getEvents(badEventsDateRoot, '2026-10-28')).toThrow(/events\.yml.*date/);
  });

  test('getSite exposes description, heroImage and heroAlt', () => {
    expect(getSite(root)).toMatchObject({
      description: 'Fixture description sentence.',
      heroImage: '/images/hero.jpg',
      heroAlt: 'Fixture hero',
    });
  });

  test('getAbout exposes facts, programmesIntro, and href and image per activity', () => {
    const about = getAbout(root);
    expect(about.facts).toEqual(['Since 2015', 'Kuntaw']);
    expect(about.programmesIntro).toBe('Fixture programmes intro.');
    expect(about.activities.map((a) => [a.href, a.image])).toEqual([
      ['/contact', '/images/train.jpg'],
      ['/#events', '/images/events.jpg'],
    ]);
  });

  test('getAbout rejects a fact longer than 32 characters, naming about.md', () => {
    expect(() => getAbout(badFactRoot)).toThrow(/about\.md.*fact/);
  });

  test('malformed content throws an error naming the file', () => {
    expect(() => getOfficers(badRoot)).toThrow(/officers\.yml/);
  });
});

describe('placeholder content', () => {
  test('placeholder content loads without error', () => {
    expect(() => {
      getSite();
      getAbout();
      getTimeline();
      getOfficers();
      getAlbums();
      getNewsPosts();
    }).not.toThrow();
    expect(getEvents(undefined, '2026-10-28')).toHaveLength(4);
    expect(getSite().name).toBe('KUMASA');
    expect(getTimeline()[0].year).toBe(2015);
  });

  test('placeholder about has four programmes and a statement of 8 words or fewer', () => {
    const about = getAbout();
    expect(about.activities.map((a) => a.title)).toEqual([
      'Training',
      'Competition',
      'Gradings and seminars',
      'Community',
    ]);
    expect(about.statement.split(/\s+/).length).toBeLessThanOrEqual(8);
  });

  test('no visible content string contains [Placeholder]', () => {
    const visible = JSON.stringify([
      getSite(),
      getAbout(),
      getTimeline(),
      getOfficers(),
      getAlbums(),
      getNewsPosts(),
      getEvents(undefined, '2026-10-28'),
    ]);
    expect(visible).not.toContain('[Placeholder]');
  });

  test('placeholder content has an empty album, a cover-less post and a photo-less officer', () => {
    expect(getAlbums().map((a) => a.images.length).sort()).toEqual([0, 4, 6]);
    expect(getNewsPosts()).toHaveLength(3);
    expect(getNewsPosts().filter((p) => !p.cover)).toHaveLength(1);
    expect(getOfficers()).toHaveLength(4);
    expect(getOfficers().filter((o) => !o.photo)).toHaveLength(1);
  });
});
