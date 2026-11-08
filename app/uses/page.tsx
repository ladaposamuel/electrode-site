import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getFaviconUrl } from "lib/favicon";
import { uses } from "lib/uses";

export const metadata: Metadata = {
  title: "Uses",
  description: "The apps I use every day.",
};

export default function UsesPage() {
  return (
    <section>
      <h1 className="font-bold text-2xl mb-2 tracking-tighter">uses</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
        The apps I open every day.
      </p>

      <div className="space-y-10">
        {uses.map((group) => (
          <div key={group.category}>
            <h2 className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
              {group.category}
              <span className="h-px flex-1 bg-neutral-100 dark:bg-neutral-800" />
            </h2>

            <div>
              {group.apps.map((app) => {
                const favicon = getFaviconUrl(app.href);

                return (
                  <Link
                    key={app.name}
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group -mx-2 flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    {favicon && (
                      <img
                        src={favicon}
                        alt=""
                        width={20}
                        height={20}
                        loading="lazy"
                        className="mt-0.5 h-5 w-5 shrink-0 rounded"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {app.name}
                        <ArrowUpRight className="ml-0.5 inline-block h-3 w-3 text-neutral-400 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                        {app.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
