import type { Metadata } from "next";
import Link from "next/link";
import { allBlogs, Blog } from "contentlayer/generated";
import ViewCounter from "./view-counter";
import { getViewsCount } from "lib/metrics";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my thoughts on software development, design, and more.",
};

interface ExternalPost {
  isExternal: true;
  title: string;
  url: string;
  publishedAt: string;
  source: string;
  author: string;
}

interface InternalPost extends Blog {
  isExternal: false;
  tags?: string;
}

type Post = InternalPost | ExternalPost;

const externalPosts: ExternalPost[] = [
  {
    title: "Send an Email Using Twilio SMS in PHP with SendGrid",
    url: "https://www.twilio.com/en-us/blog/send-email-twilio-sms-php-sendgrid",
    publishedAt: "2020-05-28",
    source: "Twilio Blog",
    author: "Ladapo Samuel",
    isExternal: true,
  },
  {
    title: "Build an English to Shakespearean Translator using SMS and PHP",
    url: "https://www.twilio.com/en-us/blog/build-english-shakespearean-translator-sms-php",
    publishedAt: "2020-01-28",
    source: "Twilio Blog",
    author: "Ladapo Samuel",
    isExternal: true,
  },
  {
    title: "How to Create an SMS Weather Forecast App using PHP & Twilio",
    url: "https://www.twilio.com/en-us/blog/create-sms-weather-forecast-app-php-twilio",
    publishedAt: "2019-03-19",
    source: "Twilio Blog",
    author: "Ladapo Samuel",
    isExternal: true,
  },
  {
    title: "Convert Bitcoin to Local Currency using PHP",
    url: "https://www.twilio.com/en-us/blog/convert-bitcoin-local-currency-php-sms-app",
    publishedAt: "2019-02-15", // Add actual date if different
    source: "Twilio Blog",
    author: "Ladapo Samuel",
    isExternal: true,
  },
];

const formatDate = (date: string | Date): string => {
  try {
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    return formattedDate.replace(/\//g, "-");
  } catch (error) {
    console.error("Error formatting date:", error);
    throw error;
  }
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const allViews: { slug: string; count: number }[] = await getViewsCount();
  type Post = (Blog & { isExternal: false }) | ExternalPost;

  const allPosts: Post[] = [
    ...allBlogs.map(
      (post): InternalPost => ({
        ...post,
        isExternal: false,
      })
    ),
    ...externalPosts.map(
      (post): ExternalPost => ({
        ...post,
        isExternal: true,
      })
    ),
  ];

  // Filter posts by tag if provided
  const filteredPosts = searchParams.tag
    ? allPosts.filter(
        (post) =>
          !post.isExternal &&
          post.tags?.split(",").map((t) => t.trim()).includes(searchParams.tag || "")
      )
    : allPosts;

  // Get unique tags from all posts
  const allTags = Array.from(
    new Set(
      allPosts
        .filter((post): post is InternalPost & { tags: string } =>
          !post.isExternal && post.tags !== undefined
        )
        .flatMap((post) => post.tags.split(",").map((t) => t.trim()))
    )
  ).sort();

  // Group posts by year
  const postsByYear = filteredPosts
    .filter((post) => !("draft" in post && post.draft))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .reduce((acc: { [key: string]: Post[] }, post) => {
      const year = new Date(post.publishedAt).getFullYear();
      acc[year] = acc[year] || [];
      acc[year].push(post);
      return acc;
    }, {});

  return (
    <section>
      <h1 className="font-bold text-2xl mb-4 tracking-tighter">read my blog</h1>

      {/* Tags filter */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        <Link
          href="/blog"
          className={`text-xs px-3 py-1 rounded-md transition-colors ${
            !searchParams.tag
              ? "bg-neutral-800 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          }`}
        >
          All
        </Link>
        {allTags.map((tag) => (
          <Link
            key={tag}
            href={`/blog?tag=${tag}`}
            className={`text-xs px-3 py-1 rounded-md transition-colors ${
              searchParams.tag === tag
                ? "bg-neutral-800 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>

      {Object.entries(postsByYear)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, posts]) => (
          <div key={year} className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-neutral-800 dark:text-neutral-200">{year}</h2>
            <div className="grid gap-4 mx-auto">
              {posts.map((post) => {
                const views = !post.isExternal && allViews.find(
                  (view) => view.slug === post.slug.replace("/blog", "")
                );

                return (
                  <div
                    key={post.isExternal ? post.url : post.slug}
                    className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="flex flex-col space-y-2">
                      <div>
                        {post.isExternal ? (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-medium text-neutral-900 dark:text-neutral-100 tracking-tight hover:text-neutral-600 dark:hover:text-neutral-400 flex items-center"
                          >
                            {post.title}
                            <ExternalLink className="ml-1.5 inline-block h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-base font-medium text-neutral-900 dark:text-neutral-100 tracking-tight hover:text-neutral-600 dark:hover:text-neutral-400"
                          >
                            {post.title}
                          </Link>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {formatDate(post.publishedAt)}
                        </span>
                        {!post.isExternal && views && (
                          <>
                            <span className="text-neutral-300 dark:text-neutral-600">•</span>
                            <ViewCounter
                              allViews={allViews}
                              slug={post.slug.replace("/blog", "")}
                              trackView={false}
                            />
                          </>
                        )}
                        {post.isExternal && (
                          <>
                            <span className="text-neutral-300 dark:text-neutral-600">•</span>
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">
                              {post.source}
                            </span>
                          </>
                        )}
                        {!post.isExternal && post.tags && (
                          <>
                            <span className="text-neutral-300 dark:text-neutral-600">•</span>
                            <div className="flex gap-1.5 flex-wrap">
                              {post.tags.split(",").map((tag) => (
                                <Link
                                  key={tag.trim()}
                                  href={`/blog?tag=${tag.trim()}`}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors"
                                >
                                  {tag.trim()}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </section>
  );
}
