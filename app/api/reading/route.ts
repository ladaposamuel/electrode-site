import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createHash } from "node:crypto";
import { normalizeUrl } from "lib/normalize-url";

// Always run on demand: every call records a saved link, nothing to cache.
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
// (e.g. the watching/views server code) to avoid a duplicate-app error.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char] ?? char)
  );

const page = (body: string, status = 200): Response =>
  new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reading</title></head><body style="margin:0;font:15px/1.6 system-ui,sans-serif;display:grid;place-items:center;height:100vh;background:#111010;color:#e5e5e5"><div style="text-align:center;padding:2rem;max-width:30rem">${body}</div></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } }
  );

/**
 * Saves a link to the reading list, triggered by the bookmarklet via a top-level
 * navigation (GET) — not fetch — so the source site's CSP connect-src can't block it.
 * The bookmarklet reads the page's own metadata (title, og:site_name, og:description)
 * and passes it as query params, so no server-side fetch of arbitrary URLs is needed.
 * Validates the shared secret and upserts into `reading`, keyed by the normalized URL.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!process.env.WATCH_INGEST_SECRET || token !== process.env.WATCH_INGEST_SECRET) {
    return page("⛔ Invalid or missing token.", 401);
  }

  const url = searchParams.get("url");
  if (!url || !/^https?:\/\//i.test(url)) {
    return page("⛔ Missing or invalid URL.", 400);
  }

  const title = (searchParams.get("title") || url).slice(0, 300);
  const author = (searchParams.get("site") || "").slice(0, 120);
  const notes = (searchParams.get("notes") || "").slice(0, 400);

  // Hash the normalized URL so reshares (trailing slash, utm tags, #fragment) of the
  // same article map to one document instead of creating duplicates.
  const id = createHash("sha1").update(normalizeUrl(url)).digest("hex").slice(0, 20);

  try {
    await setDoc(
      doc(db, "reading", id),
      { url, title, author, notes, type: "article", addedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    console.error("Reading Firestore write error:", error);
    return page("⚠️ Couldn’t save the link. Check the Firestore rules.", 500);
  }

  return page(
    `✓ Saved <strong>${escapeHtml(title)}</strong>` +
      `<br><span style="opacity:.6;font-size:13px">closing…</span>` +
      `<script>setTimeout(function(){window.close()},900)</script>`
  );
}
