// Normalizes a URL for dedup and Firestore doc ids: drops the #fragment, common
// tracking params, and a trailing slash, so the same article logged twice (or
// reshared with utm tags) maps to a single reading entry.
const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "ref",
  "ref_src",
  "ref_url",
];

export function normalizeUrl(input: string): string {
  try {
    const url = new URL(input);
    url.hash = "";
    for (const param of TRACKING_PARAMS) {
      url.searchParams.delete(param);
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return input;
  }
}
