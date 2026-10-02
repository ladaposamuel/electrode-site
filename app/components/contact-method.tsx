import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface ContactMethodProps {
  icon: ReactNode;
  title: string;
  handle: string;
  description: string;
  href: string;
}

export function ContactMethod({ icon, title, handle, description, href }: ContactMethodProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group -mx-2 flex items-center gap-4 rounded-md px-2 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-800 dark:border-neutral-800 dark:text-neutral-200">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {title}
          <span className="ml-2 font-normal text-neutral-500">{handle}</span>
        </p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">{description}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
