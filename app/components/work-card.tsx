import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface WorkCardProps {
  title: string;
  description?: string;
  href: string;
  status?: "active" | "completed" | "wip" | "abandoned";
  period?: string;
  position?: string;
  tags?: string[];
}

export function WorkCard({
  title,
  description,
  href,
  status = "completed",
  period,
  position,
  tags,
}: WorkCardProps) {
  const statusColors = {
    active:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    completed:
      "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
    wip: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    abandoned:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusLabels = {
    active: "Active",
    completed: "Completed",
    wip: "In Progress",
    abandoned: "Abandoned",
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {title}
            </h3>
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          {description && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
              {description}
            </p>
          )}
          {(position || period) && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
              {position && <span className="font-medium">{position}</span>}
              {position && period && " • "}
              {period}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <span
          className={`shrink-0 px-2 py-1 text-[10px] font-medium rounded-full ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>
    </Link>
  );
}
