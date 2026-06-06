import 'server-only';

import { Octokit } from '@octokit/rest';
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { cache } from 'react';

import { readingData } from '@/data/reading';
import type { ContentItem } from '@/types/reading';
import { normalizeUrl } from './normalize-url';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getBlogViews = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'views'));
    const views = querySnapshot.docs.map((doc) => {
      const data = doc.data() as { count: number, timestamp: any };
      // Convert the Firestore Timestamp to a simple value
      return { ...data, timestamp: data.timestamp.toMillis() };
    });


    const totalCount: number = views.reduce((sum, blog) => sum + blog.count, 0);
    return totalCount;
  } catch (error) {
    console.error('Error fetching blog views:', error);
    throw error;
  }
};




export const getViewsCount = cache(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'views'));
      const views = querySnapshot.docs.map((doc) => {
        const data = doc.data() as { count: number; timestamp: any; slug: string };
        // Convert the Firestore Timestamp to a simple value
        return { ...data, timestamp: data.timestamp.toMillis() };
      });
      return views;
    } catch (error) {
      console.error('Error fetching views count:', error);
      return [];
    }
});

// Returns the clap totals per post slug from the dedicated "claps" collection.
// Deliberately reads only slug and count (no timestamp): the clap UI never displays
// a timestamp, and mapping a missing timestamp would throw and zero out every post's
// clap count via the catch below.
export const getClapsCount = cache(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'claps'));
      const claps = querySnapshot.docs.map((doc) => {
        const data = doc.data() as { count: number; slug: string };
        return { slug: data.slug, count: data.count };
      });
      return claps;
    } catch (error) {
      console.error('Error fetching claps count:', error);
      return [];
    }
});

// Reads how many claps the current reader has already given a post, keyed by their
// httpOnly clapper-id cookie. Used to render the server-authoritative "X/50" label so
// the cap reflects the reader's true total across reloads and devices, not localStorage.
export const getUserClaps = async (slug: string, clapperId?: string): Promise<number> => {
  if (!clapperId) {
    return 0;
  }
  try {
    const snapshot = await getDoc(doc(db, 'claps', slug, 'clappers', clapperId));
    return snapshot.exists() ? ((snapshot.data().count as number) ?? 0) : 0;
  } catch (error) {
    console.error('Error fetching user claps:', error);
    return 0;
  }
};

export type WatchingEntry = {
  videoId: string;
  title: string;
  channel: string;
  url: string;
  thumbnail: string;
  date: string;
  notes?: string;
};

// Reads the most recently logged "currently watching" videos (newest first) from the
// `watching` collection that the bookmarklet writes to via /api/watching. watchedAt is
// read defensively so a doc still mid-write (null server timestamp) cannot throw.
export const getWatching = cache(async (): Promise<WatchingEntry[]> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'watching'), orderBy('watchedAt', 'desc'), limit(24))
    );
    return snapshot.docs.map((document) => {
      const data = document.data() as {
        videoId: string;
        title: string;
        channel?: string;
        url: string;
        thumbnail?: string;
        notes?: string;
        watchedAt?: { toMillis?: () => number };
      };
      const millis = data.watchedAt?.toMillis?.();
      return {
        videoId: data.videoId,
        title: data.title,
        channel: data.channel ?? '',
        url: data.url,
        thumbnail:
          data.thumbnail ?? `https://i.ytimg.com/vi/${data.videoId}/hqdefault.jpg`,
        date: new Date(millis ?? Date.now()).toISOString(),
        notes: data.notes || undefined,
      };
    });
  } catch (error) {
    console.error('Error fetching watching list:', error);
    return [];
  }
});

// Pulls the YouTube video id out of a watch or short URL.
const youtubeId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || null;
    return parsed.searchParams.get('v');
  } catch {
    return null;
  }
};

// The watch list shown across the site (reading page + homepage): live bookmarklet-
// logged videos merged with any remaining curated static entries, deduped by video id
// and sorted newest first. Static items get a thumbnail derived from their video id so
// every row renders in the same thumbnail style.
export const getRecentWatching = async (): Promise<ContentItem[]> => {
  const live = await getWatching();
  const liveIds = new Set(live.map((entry) => entry.videoId));

  const liveItems: ContentItem[] = live.map((entry) => ({
    title: entry.title,
    url: entry.url,
    type: 'video',
    author: entry.channel,
    date: entry.date,
    notes: entry.notes,
    thumbnail: entry.thumbnail,
  }));

  const staticItems: ContentItem[] = readingData.watching
    .filter((item) => {
      const id = youtubeId(item.url);
      return !id || !liveIds.has(id);
    })
    .map((item) => {
      const id = youtubeId(item.url);
      return id
        ? {
            ...item,
            thumbnail:
              item.thumbnail ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          }
        : item;
    });

  return [...liveItems, ...staticItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export type ReadingEntry = {
  url: string;
  title: string;
  author: string;
  notes?: string;
  type: ContentItem['type'];
  date: string;
};

// Reads the most recently saved reading-list links (newest first) from the `reading`
// collection that the bookmarklet writes to via /api/reading. addedAt is read
// defensively so a doc still mid-write (null server timestamp) cannot throw.
export const getReading = cache(async (): Promise<ReadingEntry[]> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'reading'), orderBy('addedAt', 'desc'), limit(24))
    );
    return snapshot.docs.map((document) => {
      const data = document.data() as {
        url: string;
        title: string;
        author?: string;
        notes?: string;
        type?: ContentItem['type'];
        addedAt?: { toMillis?: () => number };
      };
      const millis = data.addedAt?.toMillis?.();
      return {
        url: data.url,
        title: data.title,
        author: data.author ?? '',
        notes: data.notes || undefined,
        type: data.type ?? 'article',
        date: new Date(millis ?? Date.now()).toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching reading list:', error);
    return [];
  }
});

// The reading list shown on the reading page: live bookmarklet-saved links merged with
// any remaining curated static entries, deduped by normalized URL and sorted newest
// first. Mirrors getRecentWatching but for articles/resources (no thumbnails).
export const getRecentReading = async (): Promise<ContentItem[]> => {
  const live = await getReading();
  const liveUrls = new Set(live.map((entry) => normalizeUrl(entry.url)));

  const liveItems: ContentItem[] = live.map((entry) => ({
    title: entry.title,
    url: entry.url,
    type: entry.type,
    author: entry.author || undefined,
    date: entry.date,
    notes: entry.notes,
  }));

  const staticItems: ContentItem[] = readingData.reading.filter(
    (item) => !liveUrls.has(normalizeUrl(item.url))
  );

  return [...liveItems, ...staticItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export async function getTweetCount() {
  if (!process.env.TWITTER_API_TOKEN) {
    return 0;
  }

  const response = await fetch(
    `https://api.twitter.com/2/users/by/username/leeerob?user.fields=public_metrics`,
    {
      cache: 'force-cache',
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
      },
    }
  );

  const { data } = await response.json();
  return Number(data.public_metrics.tweet_count);
}

export const getStarCount = cache(async () => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const req = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: 'leerob',
    repo: 'leerob.io',
  });

  return req.data.stargazers_count;
});

const WAKATIME_BADGE_URL =
  'https://wakatime.com/badge/user/c81ce760-211d-45d2-8bcd-856d260c5c8c.svg';

type WakatimeTotal = { hours: string; suffix: string; full: string };

// Splits a WakaTime total string (e.g. "8,599 hrs 51 mins") into a big headline
// number and its unit, keeping the full string for the tooltip/aria label.
const splitWakatimeTotal = (full: string): WakatimeTotal => {
  const parts = full.match(/^([\d,]+)\s*(hrs?|hours?)/i);
  return { hours: parts?.[1] ?? full, suffix: parts?.[2] ?? '', full };
};

// Returns the all-time coding total shown on the homepage. Prefers WakaTime's
// authenticated JSON endpoint (fresher and structured) when WAKATIME_API_KEY is set,
// and falls back to parsing the public badge SVG so it still works key-free. Hourly
// revalidate with a short timeout so a slow or down WakaTime never blocks the render;
// returns null on total failure so the UI can fall back to the badge image.
export const getWakatimeAllTime = cache(async (): Promise<WakatimeTotal | null> => {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (apiKey) {
    try {
      const auth = Buffer.from(apiKey).toString('base64');
      const response = await fetch(
        'https://wakatime.com/api/v1/users/current/all_time_since_today',
        {
          headers: { Authorization: `Basic ${auth}` },
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(4000),
        }
      );
      if (response.ok) {
        const json = await response.json();
        const full = json?.data?.text?.trim();
        if (full) {
          return splitWakatimeTotal(full);
        }
      }
    } catch (error) {
      console.error('Error fetching wakatime API:', error);
    }
  }

  try {
    const response = await fetch(WAKATIME_BADGE_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) {
      return null;
    }
    const svg = await response.text();
    const valueMatch = svg.match(/<text[^>]*>([^<]*\bhrs?\b[^<]*)<\/text>/i);
    const full = valueMatch?.[1]?.trim();
    return full ? splitWakatimeTotal(full) : null;
  } catch (error) {
    console.error('Error fetching wakatime badge:', error);
    return null;
  }
});
