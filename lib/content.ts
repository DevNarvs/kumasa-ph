import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { parse as parseYaml } from 'yaml';

export type SiteInfo = {
  name: string;
  fullName: string;
  tagline: string;
  founded: number;
  description: string;
  heroImage: string;
  heroAlt: string;
  email: string;
  phone: string;
  address: string;
  socials: { label: string; url: string }[];
};
export type TimelineEntry = { year: number; title: string; description: string };
export type Officer = { name: string; role: string; bio: string; photo?: string };
export type Album = {
  slug: string;
  title: string;
  description: string;
  images: { src: string; alt: string }[];
};
export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover?: string;
  html: string;
};
export type Activity = {
  title: string;
  description: string;
  word: string;
  detail: string;
  href: string;
  image: string;
};
export type EventItem = {
  date: string;
  title: string;
  venue: string;
  detail: string;
  main: boolean;
  image?: string;
};
export type About = {
  title: string;
  excerpt: string;
  statement: string;
  facts: string[];
  programmesIntro: string;
  activities: Activity[];
  html: string;
};

type Data = Record<string, unknown>;

class ContentError extends Error {
  constructor(file: string, reason: string) {
    super(`Invalid content in ${file}: ${reason}`);
  }
}

const defaultRoot = () => path.join(process.cwd(), 'content');

function guard<T>(file: string, fn: () => T): T {
  try {
    return fn();
  } catch (error) {
    if (error instanceof ContentError) throw error;
    throw new ContentError(file, error instanceof Error ? error.message : String(error));
  }
}

function readText(root: string, file: string): string {
  return guard(file, () => fs.readFileSync(path.join(root, file), 'utf8'));
}

function readYaml(root: string, file: string): unknown {
  return guard(file, () => parseYaml(readText(root, file)));
}

function readMarkdown(root: string, file: string): { data: Data; body: string } {
  return guard(file, () => {
    const parsed = matter(readText(root, file));
    return { data: parsed.data as Data, body: parsed.content };
  });
}

function toHtml(body: string): string {
  return remark().use(remarkHtml).processSync(body).toString();
}

function requireString(data: Data, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== 'string' || value === '') {
    throw new ContentError(file, `missing required string field "${key}"`);
  }
  return value;
}

function optionalString(data: Data, key: string, file: string): string | undefined {
  const value = data[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') throw new ContentError(file, `field "${key}" must be a string`);
  return value;
}

function requireShortString(data: Data, key: string, file: string, max: number): string {
  const value = requireString(data, key, file);
  if (value.length > max) {
    throw new ContentError(file, `field "${key}" must be at most ${max} characters`);
  }
  return value;
}

function requireStringList(data: Data, key: string, file: string, max: number): string[] {
  const value = data[key] ?? [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item === '')) {
    throw new ContentError(file, `field "${key}" must be a list of strings`);
  }
  for (const item of value as string[]) {
    if (item.length > max) {
      throw new ContentError(file, `each ${key.replace(/s$/, '')} must be at most ${max} characters`);
    }
  }
  return value as string[];
}

function optionalBoolean(data: Data, key: string, file: string): boolean {
  const value = data[key];
  if (value === undefined || value === null) return false;
  if (typeof value !== 'boolean') throw new ContentError(file, `field "${key}" must be true or false`);
  return value;
}

function requireNumber(data: Data, key: string, file: string): number {
  const value = data[key];
  if (typeof value !== 'number') {
    throw new ContentError(file, `missing required number field "${key}"`);
  }
  return value;
}

function list(value: unknown, file: string, what: string): Data[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'object' || item === null)) {
    throw new ContentError(file, `${what} must be a list of entries`);
  }
  return value as Data[];
}

function requireList(value: unknown, file: string): Data[] {
  if (!Array.isArray(value)) throw new ContentError(file, 'must be a list of entries');
  return list(value, file, 'entries');
}

function normalizeDate(value: unknown, file: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new ContentError(file, 'field "date" must be a YYYY-MM-DD date');
}

function markdownFiles(root: string, dir: string): string[] {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((name) => name.endsWith('.md'))
    .sort();
}

const slugOf = (fileName: string) => fileName.replace(/\.md$/, '');

export function getSite(root: string = defaultRoot()): SiteInfo {
  const file = 'site.md';
  const { data } = readMarkdown(root, file);
  return {
    name: requireString(data, 'name', file),
    fullName: requireString(data, 'fullName', file),
    tagline: requireString(data, 'tagline', file),
    founded: requireNumber(data, 'founded', file),
    description: requireString(data, 'description', file),
    heroImage: requireString(data, 'heroImage', file),
    heroAlt: requireString(data, 'heroAlt', file),
    email: requireString(data, 'email', file),
    phone: requireString(data, 'phone', file),
    address: requireString(data, 'address', file),
    socials: list(data.socials, file, 'socials').map((s) => ({
      label: requireString(s, 'label', file),
      url: requireString(s, 'url', file),
    })),
  };
}

export function getAbout(root: string = defaultRoot()): About {
  const file = 'about.md';
  const { data, body } = readMarkdown(root, file);
  return {
    title: requireString(data, 'title', file),
    excerpt: requireString(data, 'excerpt', file),
    statement: requireString(data, 'statement', file),
    facts: requireStringList(data, 'facts', file, 32),
    programmesIntro: requireString(data, 'programmesIntro', file),
    activities: list(data.activities, file, 'activities').map((a) => ({
      title: requireString(a, 'title', file),
      description: requireString(a, 'description', file),
      word: requireShortString(a, 'word', file, 8),
      detail: requireShortString(a, 'detail', file, 24),
      href: requireString(a, 'href', file),
      image: requireString(a, 'image', file),
    })),
    html: guard(file, () => toHtml(body)),
  };
}

export function getTimeline(root: string = defaultRoot()): TimelineEntry[] {
  const file = 'timeline.yml';
  return requireList(readYaml(root, file), file)
    .map((e) => ({
      year: requireNumber(e, 'year', file),
      title: requireString(e, 'title', file),
      description: requireString(e, 'description', file),
    }))
    .sort((a, b) => a.year - b.year);
}

export function getOfficers(root: string = defaultRoot()): Officer[] {
  const file = 'officers.yml';
  return requireList(readYaml(root, file), file).map((o) => ({
    name: requireString(o, 'name', file),
    role: requireString(o, 'role', file),
    bio: requireString(o, 'bio', file),
    photo: optionalString(o, 'photo', file),
  }));
}

export function getAlbums(root: string = defaultRoot()): Album[] {
  return markdownFiles(root, 'albums').map((name) => {
    const file = `albums/${name}`;
    const { data } = readMarkdown(root, file);
    return {
      slug: slugOf(name),
      title: requireString(data, 'title', file),
      description: requireString(data, 'description', file),
      images: list(data.images, file, 'images').map((i) => ({
        src: requireString(i, 'src', file),
        alt: requireString(i, 'alt', file),
      })),
    };
  });
}

export function getNewsPosts(root: string = defaultRoot()): NewsPost[] {
  return markdownFiles(root, 'news')
    .map((name): NewsPost => {
      const file = `news/${name}`;
      const { data, body } = readMarkdown(root, file);
      return {
        slug: slugOf(name),
        title: requireString(data, 'title', file),
        date: normalizeDate(data.date, file),
        excerpt: requireString(data, 'excerpt', file),
        cover: optionalString(data, 'cover', file),
        html: guard(file, () => toHtml(body)),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getNewsPost(slug: string, root: string = defaultRoot()): NewsPost | undefined {
  return getNewsPosts(root).find((post) => post.slug === slug);
}

const todayUtc = () => new Date().toISOString().slice(0, 10);

export function getEvents(root: string = defaultRoot(), today: string = todayUtc()): EventItem[] {
  const file = 'events.yml';
  if (!fs.existsSync(path.join(root, file))) return [];
  const raw = readYaml(root, file);
  // An empty or comment-only file means no events, not a broken one.
  if (raw === null || raw === undefined) return [];
  const events = requireList(raw, file).map(
    (e): EventItem => ({
      date: normalizeDate(e.date, file),
      title: requireString(e, 'title', file),
      venue: requireString(e, 'venue', file),
      detail: requireString(e, 'detail', file),
      main: optionalBoolean(e, 'main', file),
      image: optionalString(e, 'image', file),
    }),
  );
  if (events.filter((e) => e.main).length > 1) {
    throw new ContentError(file, 'at most one event may set "main"');
  }
  return events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}
