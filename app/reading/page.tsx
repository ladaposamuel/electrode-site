import { readingData } from "@/data/reading";
import { ContentItem } from "@/components/content-item";

export const metadata = {
  title: "Reading & Watching",
  description: "What I'm currently reading and watching",
};

export default function ReadingPage() {
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
            {readingData.reading.map((item) => (
              <ContentItem key={item.url} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
            Currently Watching
          </h2>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {readingData.watching
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((item) => (
                <ContentItem key={item.url} item={item} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
