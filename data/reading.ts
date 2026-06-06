import { ReadingData } from "@/types/reading";

// Both lists are now sourced live from Firestore (lib/metrics → getRecentReading /
// getRecentWatching), seeded once from the previous static entries via
// scripts/seed-reading.mjs and scripts/seed-watching.mjs. Anything left in these arrays
// is still merged in and deduped, so they can stay empty.
export const readingData: ReadingData = {
  reading: [],
  watching: [],
};
