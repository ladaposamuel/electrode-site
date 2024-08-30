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

  // Group posts by year
  const postsByYear = allBlogs
    .filter(post => !post?.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .reduce((acc, post) => {
      const year = new Date(post.publishedAt).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    }, {} as Record<number, typeof allBlogs>);

  // Sort years in descending order
  const sortedYears = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <section>
      <h1 className="font-bold text-3xl font-serif mb-5">Blog</h1>
      {sortedYears.map((year) => (
        <div key={year} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{year}</h2>
          {postsByYear[Number(year)].map((post) => (
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
        </div>
      ))}
    </section>
  );
}