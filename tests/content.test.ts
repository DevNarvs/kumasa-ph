import path from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  getAbout,
  getAlbums,
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
    expect(getSite().name).toBe('KUMASA');
    expect(getTimeline()[0].year).toBe(2015);
  });

  test('placeholder about has four activities and a statement of 8 words or fewer', () => {
    const about = getAbout();
    expect(about.activities.map((a) => a.word)).toEqual(['Train', 'Compete', 'Gather', 'Serve']);
    expect(about.statement.split(/\s+/).length).toBeLessThanOrEqual(8);
  });

  test('placeholder content has an empty album, a cover-less post and a photo-less officer', () => {
    expect(getAlbums().map((a) => a.images.length).sort()).toEqual([0, 4, 6]);
    expect(getNewsPosts()).toHaveLength(3);
    expect(getNewsPosts().filter((p) => !p.cover)).toHaveLength(1);
    expect(getOfficers()).toHaveLength(4);
    expect(getOfficers().filter((o) => !o.photo)).toHaveLength(1);
  });
});
