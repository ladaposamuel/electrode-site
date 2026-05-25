import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Mdx } from 'app/components/mdx';
import { allBlogs } from 'contentlayer/generated';
import { getTweets } from 'lib/twitter';
import Balancer from 'react-wrap-balancer';
import ViewCounter from '../view-counter';
import { getViewsCount } from 'lib/metrics';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug: paramSlug } = await params;
  const post = allBlogs.find((post) => post.slug === paramSlug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
    slug,
  } = post;
  const ogImage = image
    ? `https://electrode.dev${image}`
    : `https://electrode.dev/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `https://electrode.dev/blog/${slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

const formatDate = (date: string | Date): string => {
  try {
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate;
  } catch (error) {
    console.error('Error formatting date:', error);
    throw error;
  }
};

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allBlogs.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const [allViews, tweets] = await Promise.all([
    getViewsCount(),
    getTweets(post.tweetIds),
  ]);

  return (
    <article className="max-w-2xl mx-auto">
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(post.structuredData)}
      </script>

      <header className="mb-8 sm:mb-12">
        <a
          href="/blog"
          className="group flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to blog
        </a>

        <h1 className="font-bold text-3xl sm:text-4xl tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
          <Balancer>{post.title}</Balancer>
        </h1>

        {post.summary && (
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
            {post.summary}
          </p>
        )}

        {/* Framed metadata strip: date and views on the left, non-wrapping tag pills on the right. */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-neutral-200 dark:border-neutral-800 py-3 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
            <div className="inline-flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" aria-hidden />
              <ViewCounter slug={post.slug} allViews={allViews} trackView />
            </div>
          </div>

          {post.tags && (
            <div className="flex flex-wrap items-center gap-1.5">
              {post.tags.split(',').map((tag) => (
                <a
                  key={tag.trim()}
                  href={`/blog?tag=${tag.trim()}`}
                  className="whitespace-nowrap text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800/60 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 transition-colors"
                >
                  <span className="text-neutral-400 dark:text-neutral-600">#</span>
                  {tag.trim()}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <Mdx code={post.body.code} tweets={tweets} />
      </div>
    </article>
  );
}
