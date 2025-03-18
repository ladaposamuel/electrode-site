import Link from 'next/link';

export function OpenToWork() {
  return (
    <Link
      href="/contact"
      className="group relative block w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-px transition-all hover:scale-[1.01]"
    >
      <div className="relative flex items-center justify-between rounded-lg bg-white/[0.8] px-5 py-4 dark:bg-black/[0.8]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
            <span className="text-2xl">👨🏾‍💻</span>
          </div>
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
              Open to Work & Collaborations
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Looking for exciting opportunities in fullstack development
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Let's Talk
          </span>
          <svg
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
