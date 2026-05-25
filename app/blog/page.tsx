import type { Metadata } from "next";
import { allBlogs } from "contentlayer/generated";
import { getViewsCount } from "lib/metrics";
import BlogArchive, { type PostRow } from "./blog-archive";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my thoughts on software development, design, and more.",
};

interface ExternalPost {
  title: string;
  url: string;
  publishedAt: string;
  source: string;
  author: string;
}

const externalPosts: ExternalPost[] = [
  {
    title: "Send an Email Using Twilio SMS in PHP with SendGrid",
    url: "https://www.twilio.com/en-us/blog/send-email-twilio-sms-php-sendgrid",
    publishedAt: "2020-05-28",
    source: "Twilio Blog",
    author: "Ladapo Samuel",
  },
  {
    title: "Build an English to Shakespearean Translator using SMS and PHP",
    url: "https://www.twilio.com/en-us/blog/build-english-shakespearean-translator-sms-php",
    publishedAt: "2020-01-28",
    source: "Twilio Blog",
    author: "Ladapo Samuel",
  },
  {
    title: "How to Create an SMS Weather Forecast App using PHP & Twilio",
    url: "https://www.twilio.com/en-us/blog/create-sms-weather-forecast-app-php-twilio",
    publishedAt: "2019-03-19",
    source: "Twilio Blog",
    author: "Ladapo Samuel",
  },
  {
    title: "Convert Bitcoin to Local Currency using PHP",
    url: "https://www.twilio.com/en-us/blog/convert-bitcoin-local-currency-php-sms-app",
    publishedAt: "2019-02-15",
    source: "Twilio Blog",
    author: "Ladapo Samuel",
  },
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const allViews: { slug: string; count: number }[] = await getViewsCount();

  const internalPosts: PostRow[] = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      title: post.title,
      href: `/blog/${post.slug}`,
      isExternal: false,
      publishedAt: post.publishedAt,
      year: new Date(post.publishedAt).getFullYear(),
      tags: post.tags
        ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      views: allViews.find((view) => view.slug === post.slug)?.count ?? 0,
      source: null,
    }));

  const external: PostRow[] = externalPosts.map((post) => ({
    title: post.title,
    href: post.url,
    isExternal: true,
    publishedAt: post.publishedAt,
    year: new Date(post.publishedAt).getFullYear(),
    tags: [],
    views: null,
    source: post.source,
  }));

  const posts = [...internalPosts, ...external].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Order tags by how many posts use them so the most useful filters surface
  // first when the list is collapsed.
  const tagCounts = new Map<string, number>();
  for (const post of internalPosts) {
    for (const t of post.tags) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }
  }
  const allTags = Array.from(tagCounts.keys()).sort((a, b) => {
    const byCount = (tagCounts.get(b) ?? 0) - (tagCounts.get(a) ?? 0);
    return byCount !== 0 ? byCount : a.localeCompare(b);
  });

  return <BlogArchive posts={posts} tags={allTags} initialTag={tag} />;
}
