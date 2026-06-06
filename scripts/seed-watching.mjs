// One-time seed: migrate the previously-static "currently watching" list into the
// Firestore `watching` collection so every entry lives in one place and renders in the
// same thumbnail style as bookmarklet-logged videos. Idempotent (keyed by video id);
// safe to re-run. Preserves each entry's channel, notes, and original date.
//
//   nvm use 22 && node scripts/seed-watching.mjs

import { readFileSync } from "node:fs";
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

const entries = [
  { videoId: "tNZnLkRBYA8", title: `ThePrimeagen: Programming, AI, ADHD, Productivity, Addiction, and God | Lex Fridman Podcast #461`, channel: `Lex Fridman`, date: "2025-03-26", notes: `` },
  { videoId: "TC09ml9Fpg8", title: `Tracking Pixels in Emails (They're Spying on You)`, channel: `bmdyy`, date: "2025-03-26", notes: `` },
  { videoId: "iUU4O1sWtJA", title: `Beginner System Design Interview: Design Bitly w/ a Ex-Meta Staff Engineer`, channel: `Hello Interview - SWE Interview Preparation`, date: "2025-03-21", notes: `System Design Interview` },
  { videoId: "1xHADtekTNg", title: `System Design Interview: Design LeetCode (Online Judge) w/ a Ex-Meta Staff Engineer`, channel: `Hello Interview - SWE Interview Preparation`, date: "2025-03-21", notes: `A step-by-step breakdown of the popular FAANG+ system design interview question, Design LeetCode also named Online Judge, Online Coding Platform, or Live leaderboard.` },
  { videoId: "IACHfKmZMr8", title: `Vibe Coding Is The Future`, channel: `Y Combinator`, date: "2025-03-18", notes: `Andrej Karpathy recently coined the term vibe coding to describe how LLMs are getting so good that devs can simply 'give in to the vibes, embrace exponentials, and forget that the code even exists.' We dive into this new way of programming and what it means for builders in the age of AI.` },
  { videoId: "0VLAoVGf_74", title: `How DeepSeek Rewrote the Transformer [MLA]`, channel: `Welch Labs`, date: "2025-03-18", notes: `quite intresting AI deepdive explaining how and why DeepSeek's changes to the architechure result in such an incredible performance AND efficency improvement` },
  { videoId: "2qxih-gdWwA", title: `6 Days of Fishing & Life in the Ice in GREENLAND`, channel: `Alluring Arctic Sailing`, date: "2025-06-13", notes: `Life and fishing in Greenland's icy conditions` },
  { videoId: "3JlXlnXDzro", title: `You Call It Insane. We Call It Our Home. (Full Tour)`, channel: `Alluring Arctic Sailing`, date: "2025-06-13", notes: `Tour of a unique home in extreme conditions` },
  { videoId: "6lTybfDRIsI", title: `Intercepted by the Canadian Federal Arctic Unit`, channel: `Alluring Arctic Sailing`, date: "2025-06-13", notes: `Encounter with Canadian Arctic authorities` },
  { videoId: "gwzhqIduAx4", title: `The BEST & WORST Anchors. Settling the Great Debate Forever.`, channel: `Alluring Arctic Sailing`, date: "2025-06-13", notes: `Comprehensive analysis of different anchor types and their performance` },
  { videoId: "HgSlmzC7O-E", title: `Scaling Databases with Vitess - Harshit Gangal & Manan Gupta, Planetscale`, channel: `CNCF [Cloud Native Computing Foundation]`, date: "2025-06-17", notes: `A deep dive into how Vitess, a database sharding solution, enables horizontal scaling of databases while maintaining data integrity and consistency.` },
  { videoId: "VwpFS1guqTg", title: `Tested at the AWS DeepRacer Championship Cup!`, channel: `Adam Savage's Tested`, date: "2025-06-18", notes: `Adam Savage tests the AWS DeepRacer Championship Cup, a self-driving car race, and shares his experience.` },
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let seeded = 0;
for (const entry of entries) {
  await setDoc(
    doc(db, "watching", entry.videoId),
    {
      videoId: entry.videoId,
      title: entry.title,
      channel: entry.channel,
      url: `https://www.youtube.com/watch?v=${entry.videoId}`,
      thumbnail: `https://i.ytimg.com/vi/${entry.videoId}/hqdefault.jpg`,
      notes: entry.notes,
      watchedAt: Timestamp.fromDate(new Date(`${entry.date}T12:00:00Z`)),
    },
    { merge: true }
  );
  seeded += 1;
  console.log(`  ✓ ${entry.videoId}  ${entry.title.slice(0, 56)}`);
}

console.log(`\nDone: ${seeded}/${entries.length} watching docs seeded.`);
process.exit(0);
