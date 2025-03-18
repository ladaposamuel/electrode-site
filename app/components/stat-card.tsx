import { ReactNode } from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number | ReactNode;
  href?: string;
}

export function StatCard({ icon, label, value, href }: StatCardProps) {
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group flex items-center gap-2 rounded-lg border-[1.5px] border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 transition-all hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm dark:hover:shadow-neutral-800/50"
    >
      <span className="text-lg">{icon}</span>
      <div className="flex min-w-0 flex-col">
        <div className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {value}
        </div>
        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
      </div>
      {href && (
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
      )}
    </Wrapper>
  );
}
