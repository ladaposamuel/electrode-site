import { ContentItem as ContentItemType } from '@/types/reading';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function ContentItem({ item }: { item: ContentItemType }) {
  const icon = item.type === 'video' ? '📺' : item.type === 'tweet' ? '🐦' : '📚';

  return (
    <Link
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group -mx-2 flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
    >
      <span className="mt-0.5 text-sm">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {item.title}
            <ArrowUpRight className="ml-0.5 inline-block h-3 w-3 text-neutral-400 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          </p>
          <span className="shrink-0 text-xs tabular-nums text-neutral-500">
            {new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        {item.author && (
          <p className="mt-0.5 text-xs text-neutral-500">{item.author}</p>
        )}
        {item.notes && (
          <p className="mt-1 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">
            {item.notes}
          </p>
        )}
      </div>
    </Link>
  );
}
