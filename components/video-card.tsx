import { ContentItem as ContentItemType } from '@/types/reading';
import { Play } from 'lucide-react';
import Link from 'next/link';

export function VideoCard({ item }: { item: ContentItemType }) {
  return (
    <Link
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-video overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 transition-transform duration-200 group-hover:-translate-y-0.5">
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Play className="h-4 w-4 translate-x-px fill-current" />
          </span>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400">
        {item.title}
      </p>
      <p className="mt-0.5 truncate text-xs text-neutral-500">
        {item.author && <span>{item.author} · </span>}
        {new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </p>
    </Link>
  );
}
