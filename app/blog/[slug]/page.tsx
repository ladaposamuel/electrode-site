import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Mdx } from 'app/components/mdx';
import { allBlogs } from 'contentlayer/generated';
import { getTweets } from 'lib/twitter';
import Balancer from 'react-wrap-balancer';
import ViewCounter from '../view-counter';
import { getViewsCount } from 'lib/metrics';

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {
  const post = allBlogs.find((post) => post.slug === params.slug);
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
    const formattedDate = new Date(date).toLocaleDateString(undefined,  { year: 'numeric', month: 'short', day: '2-digit' });
    return formattedDate.replace(/\//g, '-');
  } catch (error) {
    console.error('Error formatting date:', error);
    throw error;
  }
};


export default async function Blog({ params }) {
  const post = allBlogs.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const [allViews, tweets] = await Promise.all([
    getViewsCount(),
    getTweets(post.tweetIds),
  ]);

  return (
    <section>
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(post.structuredData)}
      </script>
      <a href="/blog" className="text-sm font-mono text-neutral-500 dark:text-neutral-400">
        ← Back to blog
      </a>
      <h1 className="font-bold text-3xl font-serif max-w-[650px]">
        <Balancer>{post.title}</Balancer>
      </h1>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mt-4 mb-8 font-mono text-sm max-w-[650px]">
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1 tracking-tighter">
          {formatDate(post.publishedAt)}
        </div>
        <div className="h-[0.2em] bg-neutral-50 dark:bg-neutral-800 mx-2" />
        <ViewCounter allViews={allViews} post={post} trackView />
      </div>
      <Mdx code={post.body.code} tweets={tweets} />
    </section>
  );
}
