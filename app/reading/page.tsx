import { ContentItem } from "@/components/content-item";
import { getRecentReading, getRecentWatching } from "lib/metrics";

// Firestore reads don't make a route dynamic on their own, so opt in explicitly —
// otherwise the lists would be frozen at build time.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reading & Watching",
  description: "What I'm currently reading and watching",
};

export default async function ReadingPage() {
  const [reading, watching] = await Promise.all([
    getRecentReading(),
    getRecentWatching(),
  ]);

  return (
    <section>
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">
        reading & watching
      </h1>

      <div className="space-y-12">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
            Currently Reading
          </h2>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {reading.map((item) => (
              <ContentItem key={item.url} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
            Currently Watching
          </h2>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {watching.map((item) => (
              <ContentItem key={item.url} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
