interface ContactMethodProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
}

export function ContactMethod({ icon, title, description, href, color }: ContactMethodProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full overflow-hidden rounded-lg bg-gradient-to-br p-px transition-all hover:scale-[1.01]"
      style={{ backgroundImage: color }}
    >
      <div className="relative flex items-center gap-4 rounded-lg bg-white/[0.9] px-4 py-3 dark:bg-black/[0.8]">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        </div>
        <svg
          className="ml-auto h-5 w-5 text-neutral-600 transition-transform group-hover:translate-x-1 dark:text-neutral-400"
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
    </a>
  );
}
