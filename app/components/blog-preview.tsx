import Link from 'next/link';
import { Blog } from 'contentlayer/generated';

interface BlogPreviewProps {
  post: Blog;
}

export function BlogPreview({ post }: BlogPreviewProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col space-y-2 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
    >
      <div>
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
          {post.summary}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <time className="text-xs text-neutral-500 dark:text-neutral-400" dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
