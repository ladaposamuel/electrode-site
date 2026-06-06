// One-time seed: migrate the previously-static "currently reading" list into the
// Firestore `reading` collection so links live in one place alongside bookmarklet-saved
// ones. Idempotent (keyed by a hash of the normalized URL); safe to re-run. Preserves
// each entry's title, source, notes, type, and original date.
//
//   nvm use 22 && node scripts/seed-reading.mjs

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

const env = {};
for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
}

const firebaseConfig = {
  apiKey: env.REACT_APP_FIREBASE_API_KEY,
  authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.REACT_APP_FIREBASE_APP_ID,
};

// Kept in sync with lib/normalize-url.ts.
const TRACKING_PARAMS = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","fbclid","gclid","ref","ref_src","ref_url"];
const normalizeUrl = (input) => {
  try {
    const url = new URL(input);
    url.hash = "";
    for (const p of TRACKING_PARAMS) url.searchParams.delete(p);
    return url.toString().replace(/\/$/, "");
  } catch {
    return input;
  }
};

const entries = [
  { url: "https://github.com/sindresorhus/awesome", title: `Awesome Lists`, author: `Sindre Sorhus`, type: "resource", date: "2025-03-18", notes: `A curated list of awesome lists about various development topics and technologies` },
  { url: "https://randomkeygen.com/", title: `RandomKeygen - The Secure Password & Keygen Generator`, author: ``, type: "tool", date: "2025-03-18", notes: `Online tool for generating secure passwords and keys` },
  { url: "https://dns-lookup.com/", title: `DNS Lookup Tool`, author: ``, type: "tool", date: "2025-03-18", notes: `Find IP addresses and perform deep DNS lookups with detailed record information (A, MX, NS, SOA, TXT)` },
  { url: "https://www.dnsleaktest.com/", title: `DNS Leak Test - Understanding and Preventing DNS Leaks`, author: ``, type: "article", date: "2025-03-18", notes: `Comprehensive guide on DNS leaks, their implications for privacy, and how to prevent them` },
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let seeded = 0;
for (const entry of entries) {
  const id = createHash("sha1").update(normalizeUrl(entry.url)).digest("hex").slice(0, 20);
  await setDoc(
    doc(db, "reading", id),
    {
      url: entry.url,
      title: entry.title,
      author: entry.author,
      notes: entry.notes,
      type: entry.type,
      addedAt: Timestamp.fromDate(new Date(`${entry.date}T12:00:00Z`)),
    },
    { merge: true }
  );
  seeded += 1;
  console.log(`  ✓ ${id}  ${entry.title.slice(0, 52)}`);
}

console.log(`\nDone: ${seeded}/${entries.length} reading docs seeded.`);
process.exit(0);
