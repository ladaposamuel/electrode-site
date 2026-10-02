import Link from "next/link";
import { ContentItem } from "@/components/content-item";
import { VideoCard } from "@/components/video-card";
import { getRecentReading, getRecentWatching } from "lib/metrics";
import type { ContentItem as ContentItemType } from "@/types/reading";

// Firestore reads don't make a route dynamic on their own, so opt in explicitly —
// otherwise the lists would be frozen at build time.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reading & Watching",
  description: "What I'm currently reading and watching",
};

type Tab = "reading" | "watching";

/**
 * Groups items (already sorted newest first) under a "October 2026" style label,
 * keeping the order of both the months and the items inside them.
 */
function groupByMonth(items: ContentItemType[]) {
  const groups: { label: string; items: ContentItemType[] }[] = [];

  for (const item of items) {
    const label = new Date(item.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const last = groups[groups.length - 1];

    if (last && last.label === label) {
      last.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }

  return groups;
}

export default async function ReadingPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabParam } = await searchParams;
  const tab: Tab = tabParam === "watching" ? "watching" : "reading";

  const [reading, watching] = await Promise.all([
    getRecentReading(),
    getRecentWatching(),
  ]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "reading", label: "Reading", count: reading.length },
    { key: "watching", label: "Watching", count: watching.length },
  ];
  const groups = groupByMonth(tab === "reading" ? reading : watching);

  return (
    <section>
      <h1 className="font-bold text-2xl mb-6 tracking-tighter">
        reading & watching
      </h1>

      <nav className="mb-8 inline-flex gap-1 rounded-lg border border-neutral-200 dark:border-neutral-800 p-1">
        {tabs.map((item) => {
          const active = item.key === tab;

          return (
            <Link
              key={item.key}
              href={`/reading?tab=${item.key}`}
              scroll={false}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              }`}
            >
              {item.label}
              <span
                className={`ml-1.5 text-xs tabular-nums ${
                  active ? "opacity-70" : "text-neutral-400 dark:text-neutral-500"
                }`}
              >
                {item.count}
              </span>
            </Link>
          );
        })}
      </nav>

      {groups.length === 0 && (
        <p className="text-sm text-neutral-500">Nothing here yet.</p>
      )}

      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.label}>
            <h2 className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
              {group.label}
              <span className="h-px flex-1 bg-neutral-100 dark:bg-neutral-800" />
            </h2>

            {tab === "watching" ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
                {group.items.map((item) => (
                  <VideoCard key={item.url} item={item} />
                ))}
              </div>
            ) : (
              <div>
                {group.items.map((item) => (
                  <ContentItem key={item.url} item={item} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
