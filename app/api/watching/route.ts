import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Always run on demand: every call records a watch event, nothing to cache.
export const dynamic = "force-dynamic";

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

// Reuse the existing default Firebase app if one was already initialized elsewhere
// (e.g. the views/claps server action) to avoid a duplicate-app error.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char] ?? char)
  );

// Minimal self-closing confirmation page rendered in the bookmarklet's popup tab.
const page = (body: string, status = 200): Response =>
  new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Watching</title></head><body style="margin:0;font:15px/1.6 system-ui,sans-serif;display:grid;place-items:center;height:100vh;background:#111010;color:#e5e5e5"><div style="text-align:center;padding:2rem;max-width:30rem">${body}</div></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } }
  );

/**
 * Records a "currently watching" YouTube video, triggered by the bookmarklet via a
 * top-level navigation (GET) — not fetch — so YouTube's CSP connect-src can't block it.
 * Validates the shared secret, enriches the video id key-free through YouTube oEmbed,
 * and upserts it into the `watching` Firestore collection keyed by video id.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const videoId = searchParams.get("videoId");

  if (!process.env.WATCH_INGEST_SECRET || token !== process.env.WATCH_INGEST_SECRET) {
    return page("⛔ Invalid or missing token.", 401);
  }
  if (!videoId || !/^[\w-]{6,20}$/.test(videoId)) {
    return page("⛔ Missing or invalid video id.", 400);
  }

  const url = `https://www.youtube.com/watch?v=${videoId}`;

  let title: string;
  let channel: string;
  let thumbnail: string;
  try {
    const oembed = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { signal: AbortSignal.timeout(6000) }
    );
    // Private, deleted, or age-restricted videos return 401/404 here — bail without
    // writing a half-populated document.
    if (!oembed.ok) {
      return page("⚠️ Couldn’t fetch video info (private, deleted, or restricted).", 502);
    }
    const data = await oembed.json();
    title = (data.title as string)?.trim() || "Untitled video";
    channel = (data.author_name as string)?.trim() || "";
    thumbnail =
      (data.thumbnail_url as string) || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  } catch (error) {
    console.error("Watching oEmbed error:", error);
    return page("⚠️ Couldn’t reach YouTube to fetch video info. Try again.", 502);
  }

  try {
    await setDoc(
      doc(db, "watching", videoId),
      { videoId, title, channel, url, thumbnail, watchedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    console.error("Watching Firestore write error:", error);
    return page("⚠️ Fetched the video but couldn’t save it. Check the Firestore rules.", 500);
  }

  return page(
    `✓ Logged <strong>${escapeHtml(title)}</strong>` +
      `<br><span style="opacity:.6;font-size:13px">closing…</span>` +
      `<script>setTimeout(function(){window.close()},900)</script>`
  );
}
