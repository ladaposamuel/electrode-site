import { ContentItem } from "../../types/reading";

interface ContentPreviewProps {
  title: string;
  items: ContentItem[];
  viewAllLink: string;
}

export function ContentPreview({
  title,
  items,
  viewAllLink,
}: ContentPreviewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {title}
        </h2>
        <a
          href={viewAllLink}
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          view all →
        </a>
      </div>
      <div className="space-y-2">
        {items
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 2)
          .map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-2 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {item.author}
                </p>
              </div>
              <svg
                className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ))}
      </div>
    </div>
  );
}
