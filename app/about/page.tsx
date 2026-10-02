import { getResumeLink } from "utils";
import { workExperience } from "lib/experience";
import { TechStack } from "../components/tech-stack";
import { HomepageButton } from "../components/homepage-button/homepage-button";
import { ArrowIcon } from "../components/icons";

export const metadata = {
  title: "About",
  description: "Fullstack developer, paintball enthusiast, continuous learner",
};

const now = [
  { label: "Building", value: "MySCU", href: "https://myscu.co" },
  { label: "Working at", value: "Audiomack", href: "https://audiomack.com" },
  { label: "Weekends", value: "Paintball 🎯" },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
      {children}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter">about me</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Fullstack developer, paintball enthusiast, continuous learner
          </p>
        </div>

        <p className="leading-relaxed text-neutral-800 dark:text-neutral-200">
          I'm a full-stack developer with 8+ years of building for the web. I lead
          engineering at MySCU, have been shipping at Audiomack since 2020, and
          spend my spare time on side projects like KoiLane. I care about systems
          that stay simple as they grow, and I learn best by building things.
        </p>

        <div className="grid grid-cols-3 divide-x divide-neutral-200 rounded-xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {now.map((item) => (
            <div key={item.label} className="px-4 py-3">
              <p className="text-xs text-neutral-500">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-neutral-900 hover:underline dark:text-neutral-100"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Experience</SectionLabel>
        <ol className="relative ml-1 border-l border-neutral-200 dark:border-neutral-800">
          {workExperience.map((work) => (
            <li key={work.title} className="relative pb-6 pl-6 last:pb-0">
              <span
                className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#111010] ${
                  work.status === "active"
                    ? "bg-green-500"
                    : "bg-neutral-300 dark:bg-neutral-600"
                }`}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <a
                  href={work.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-neutral-900 hover:underline dark:text-neutral-100"
                >
                  {work.title}
                </a>
                <span className="text-xs tabular-nums text-neutral-500">
                  {work.period.replace(/[A-Za-z]+ (\d{4})/g, "$1")}
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {work.position}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionLabel>Tech stack</SectionLabel>
        <TechStack />
      </section>

      <section>
        <SectionLabel>Beyond code</SectionLabel>
        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          When I'm not immersed in code, you can find me on the paintball field
          every Sunday. It's a fast, loud game of strategy and teamwork, and I bring
          a lot of that back to how I work. The rest of the time I'm reading,
          trying new tools, and contributing to open source.
        </p>
      </section>

      <section>
        <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
          Since you got here :), here's one of my favourite playlists:
        </p>
        <iframe
          title="Samuel's favourite playlist on Spotify"
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/playlist/60zXXNjqoiJsYpgk9VquzE?utm_source=generator"
          width="100%"
          height="352"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </section>

      <section>
        <div className="flex flex-wrap gap-2">
          <HomepageButton href={getResumeLink()}>
            <ArrowIcon />
            <p className="text-sm">view resume</p>
          </HomepageButton>
          <HomepageButton href="/contact">
            <ArrowIcon />
            <p className="text-sm">get in touch</p>
          </HomepageButton>
        </div>
      </section>
    </div>
  );
}
