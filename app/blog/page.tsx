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
        .filter((post): post is InternalPost => !post.isExternal && post.tags !== undefined)
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
      <h1 className="font-bold text-2xl mb-8 tracking-tighter">read my blog</h1>

      {/* Tags filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`text-sm px-3 py-1 rounded-full ${
            !searchParams.tag
              ? "bg-neutral-100 text-neutral-900"
              : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
          }`}
        >
          All
        </Link>
        {allTags.map((tag) => (
          <Link
            key={tag}
            href={`/blog?tag=${tag}`}
            className={`text-sm px-3 py-1 rounded-full ${
              searchParams.tag === tag
                ? "bg-neutral-100 text-neutral-900"
                : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>

      {Object.entries(postsByYear)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, posts]) => (
          <div key={year}>
            <h2 className="text-xl font-bold mb-4">{year}</h2>
            <div className="grid gap-8 mx-auto">
              {posts.map((post) => {
                const views = !post.isExternal && allViews.find(
                  (view) => view.slug === post.slug.replace("/blog", "")
                );

                return (
                  <div
                    key={post.isExternal ? post.url : post.slug}
                    className="flex flex-col space-y-1"
                  >
                    <div className="w-full flex flex-col">
                      {post.isExternal ? (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-900 dark:text-neutral-100 tracking-tight flex items-center hover:text-neutral-600 dark:hover:text-neutral-400"
                        >
                          {post.title}
                          <ExternalLink className="ml-1 inline-block h-4 w-4" />
                        </a>
                      ) : (
                        <Link
                          href={post.slug}
                          className="text-neutral-900 dark:text-neutral-100 tracking-tight hover:text-neutral-600 dark:hover:text-neutral-400"
                        >
                          {post.title}
                        </Link>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(post.publishedAt)}
                      </span>
                      {!post.isExternal && views && (
                        <ViewCounter
                          allViews={allViews}
                          slug={post.slug.replace("/blog", "")}
                          trackView={false}
                        />
                      )}
                      {post.isExternal && (
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {post.source}
                        </span>
                      )}
                    </div>
                    {!post.isExternal && post.tags && (
                      <div className="flex gap-2 flex-wrap">
                        {post.tags.split(",").map((tag) => (
                          <Link
                            key={tag.trim()}
                            href={`/blog?tag=${tag.trim()}`}
                            className="text-xs px-2 py-1 rounded-full bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                          >
                            {tag.trim()}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </section>
  );
}
