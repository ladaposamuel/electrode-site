import type { Metadata } from 'next';
import Link from 'next/link';
import { allBlogs } from 'contentlayer/generated';
import ViewCounter from './view-counter';
import { getViewsCount } from 'lib/metrics';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read my thoughts on software development, design, and more.',
};

const formatDate = (date: string | Date): string => {
  try {
    const formattedDate = new Date(date).toLocaleDateString(undefined,  { year: 'numeric', month: 'short', day: '2-digit' });
    return formattedDate.replace(/\//g, '-');
  } catch (error) {
    console.error('Error formatting date:', error);
    throw error;
  }
};

export default async function BlogPage() {
  const allViews = await getViewsCount();
  return (
    <section>
      <h1 className="font-bold text-3xl font-serif mb-5">Blog</h1>
      {allBlogs
        .sort((a, b) => {
          if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
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
        ))}
    </section>
  );
}
