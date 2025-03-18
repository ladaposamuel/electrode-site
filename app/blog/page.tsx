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

export default async function BlogPage() {
  const allViews = await getViewsCount();
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

  // Group posts by year
  const postsByYear = allPosts
    .filter((post) => !("draft" in post && post.draft))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .reduce((acc, post) => {
      const year = new Date(post.publishedAt).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    }, {} as Record<number, typeof allPosts>);

  const sortedYears = Object.keys(postsByYear).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <section>
      <h1 className="font-bold text-3xl font-serif mb-5">Blog</h1>
      {sortedYears.map((year) => (
        <div key={year} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{year}</h2>
          {postsByYear[Number(year)].map((post) =>
            post.isExternal ? (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col space-y-1 mb-4 group"
              >
                <div className="w-full flex flex-col">
                  <div className="flex items-center">
                    <p>⥱ {post.title}</p>
                    <ExternalLink className="w-4 h-4 ml-1 inline-block text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(post.publishedAt)} · {post.source}
                  </p>
                </div>
              </a>
            ) : (
              <Link
                key={post.slug}
                className="flex flex-col space-y-1 mb-4"
                href={`/blog/${post.slug}`}
              >
                <div className="w-full flex flex-col">
                  <p>⥱ {post.title}</p>
                  <ViewCounter
                    post={post}
                    allViews={allViews}
                    trackView={false}
                    showTime={formatDate(post.publishedAt)}
                  />
                </div>
              </Link>
            )
          )}
        </div>
      ))}
    </section>
  );
}
