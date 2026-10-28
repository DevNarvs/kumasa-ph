import path from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  getAbout,
  getAlbums,
  getNewsPost,
  getNewsPosts,
  getOfficers,
  getTimeline,
} from '@/lib/content';

const root = path.join(__dirname, 'fixtures', 'content');
const badRoot = path.join(root, 'bad');

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
