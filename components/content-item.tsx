import { ContentItem as ContentItemType } from '@/types/reading';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function ContentItem({ item }: { item: ContentItemType }) {
  const icon = item.type === 'video' ? '📺' : item.type === 'tweet' ? '🐦' : '📚';
  
  return (
    <div className="flex items-start space-x-2 py-2">
      <span className="text-sm">{icon}</span>
      <div className="flex-1">
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 flex items-center"
        >
          {item.title}
          <ExternalLink className="ml-1 inline-block h-3 w-3" />
        </Link>
        <div className="flex items-center gap-x-2 mt-1">
          {item.author && (
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              by {item.author}
            </span>
          )}
          <span className="text-xs text-neutral-500 dark:text-neutral-500">
            {new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
        {item.notes && (
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            {item.notes}
          </p>
        )}
      </div>
    </div>
  );
}
