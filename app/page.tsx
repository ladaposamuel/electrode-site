import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBlogViews, getWakatimeAllTime, getRecentWatching } from "lib/metrics";
import { name, avatar } from "lib/info";
import { projects } from "lib/projects";
import { getResumeLink } from "utils";
import { HomepageButton } from "app/components/homepage-button/homepage-button";
import { ArrowIcon } from "app/components/icons";
import { WorkCard } from "app/components/work-card";
import { VideoCard } from "@/components/video-card";
import { CountUp } from "@/components/count-up";
import { ArrowUpRight } from "lucide-react";
import { allBlogs } from "contentlayer/generated";

const FEATURED_PROJECTS = ["KoiLane", "Venhoot", "MangoLogs"];
const CAREER_START_YEAR = 2018;

export const revalidate = 60;
export const dynamic = "force-dynamic";

const ACCENT = "#47a3f3";

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export default async function HomePage() {
  let views: number | undefined;
  try {
    views = await getBlogViews();
  } catch (error) {
    console.error(error);
  }

  const wakatime = await getWakatimeAllTime();

  const publishedPosts = allBlogs
    .filter((post) => !post.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  const recentPosts = publishedPosts.slice(0, 3);
  const latestPostDate = publishedPosts[0]
    ? new Date(publishedPosts[0].publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  const parsedHours = wakatime ? Number(wakatime.hours.replace(/,/g, "")) : NaN;
  const codingHours = Number.isFinite(parsedHours) ? parsedHours : null;
  const yearsShipping = new Date().getFullYear() - CAREER_START_YEAR;

  const watched = await getRecentWatching();
  const featuredProjects = projects.filter((project) =>
    FEATURED_PROJECTS.includes(project.title),
  );

  return (
    <div className="space-y-12">
      <section className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              live
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                hey, I&apos;m samuel{" "}
                <span className="wave" role="img" aria-label="waving hand">
                  👋
                </span>
              </h1>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Fullstack developer, paintball enthusiast, continuous learner
              </p>
            </div>
          </div>

          {/* <div className="relative shrink-0">
            <Image
              alt={name}
              src={avatar}
              width={72}
              height={72}
              priority
              placeholder="blur"
              className="rounded-2xl grayscale transition-all hover:grayscale-0"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-[#111010]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div> */}
        </div>

        <p className="max-w-xl text-neutral-800 dark:text-neutral-200">
          Full-stack developer leading engineering at MySCU and building for the
          web since 2018.
        </p>
      </section>

      <section>
        <SectionLabel>the numbers</SectionLabel>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 lg:grid-cols-4 dark:border-neutral-800 dark:bg-neutral-800">
          <StatTile
            label="Coding"
            caption="via WakaTime"
            href="https://wakatime.com/@electrode"
            live
          >
            {codingHours !== null ? (
              <span className="flex items-baseline gap-1.5" title={wakatime?.full}>
                <span className="text-2xl font-bold">
                  <CountUp value={codingHours} />
                </span>
                <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                  {wakatime?.suffix}
                </span>
              </span>
            ) : (
              <Image
                alt="Wakatime coding hours"
                src="https://wakatime.com/badge/user/c81ce760-211d-45d2-8bcd-856d260c5c8c.svg?style=flat"
                width={140}
                height={18}
                priority
                className="dark:invert"
              />
            )}
          </StatTile>
          <StatTile label="Blog views" caption="across all posts" href="/blog">
            <span className="text-2xl font-bold">
              {views !== undefined ? <CountUp value={views} /> : "—"}
            </span>
          </StatTile>
          <StatTile
            label="Articles"
            caption={`latest ${latestPostDate}`}
            href="/blog"
          >
            <span className="text-2xl font-bold">
              <CountUp value={publishedPosts.length} />
            </span>
          </StatTile>
          <StatTile label="Years shipping" caption="since 2018" href="/about">
            <span className="text-2xl font-bold">
              <CountUp value={yearsShipping} suffix="+" />
            </span>
          </StatTile>
        </div>
      </section>

      <Link
        href="/contact"
        className="group flex items-center justify-between gap-4 rounded-xl border border-neutral-200 px-5 py-4 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
      >
        <span className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Open to work & collaborations
          </span>
        </span>
        <span className="whitespace-nowrap text-sm text-neutral-500 transition-colors group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
          let&apos;s talk →
        </span>
      </Link>

      <section>
        <div className="flex items-center justify-between">
          <SectionLabel className="mb-0">selected projects</SectionLabel>
          <ViewAll href="/works" />
        </div>
        <div className="-mx-3 mt-3 divide-y divide-neutral-100 dark:divide-neutral-800">
          {featuredProjects.map((project) => (
            <WorkCard key={project.title} {...project} tags={undefined} />
          ))}
        </div>
      </section>

      {watched.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <SectionLabel className="mb-0">recently watched</SectionLabel>
            <ViewAll href="/reading?tab=watching" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {watched.slice(0, 3).map((item, index) => (
              <div key={item.url} className={index === 2 ? "hidden sm:block" : ""}>
                <VideoCard item={item} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between">
          <SectionLabel className="mb-0">latest writing</SectionLabel>
          <ViewAll href="/blog" />
        </div>
        <ul className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-baseline gap-4 py-3"
              >
                <time className="hidden w-24 shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500 sm:block">
                  {formatDate(post.publishedAt)}
                </time>
                <div className="min-w-0">
                  <p
                    className="truncate font-medium text-neutral-900 transition-colors dark:text-neutral-100"
                    style={{ ["--tw" as string]: ACCENT }}
                  >
                    <span className="group-hover:text-[#47a3f3]">
                      {post.title}
                    </span>
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-neutral-500">
                    {post.summary}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-wrap gap-2">
        <HomepageButton href={getResumeLink()}>
          <ArrowIcon />
          <p className="text-sm">resume</p>
        </HomepageButton>
        <HomepageButton href="https://github.com/ladaposamuel">
          <ArrowIcon />
          <p className="text-sm">github</p>
        </HomepageButton>
        <HomepageButton href="https://www.linkedin.com/in/ladapo-samuel/">
          <ArrowIcon />
          <p className="text-sm">linkedin</p>
        </HomepageButton>
      </section>
    </div>
  );
}

function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`mb-4 text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 ${className}`}
    >
      {children}
    </h2>
  );
}

function ViewAll({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="text-xs text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-200"
    >
      view all →
    </Link>
  );
}

function StatTile({
  label,
  caption,
  href,
  live = false,
  children,
}: {
  label: string;
  caption: string;
  href: string;
  live?: boolean;
  children: ReactNode;
}) {
  const cardClass =
    "group flex flex-col bg-white p-4 transition-colors hover:bg-neutral-50 dark:bg-[#111010] dark:hover:bg-neutral-900";

  const body = (
    <>
      <div className="flex h-3 items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          {label}
        </span>
        {live && (
          <span className="group-hover:hidden">
            <Equalizer />
          </span>
        )}
        <ArrowUpRight className="hidden h-3.5 w-3.5 text-neutral-400 group-hover:block" />
      </div>
      <div className="mt-3 flex items-baseline text-neutral-900 dark:text-neutral-100">
        {children}
      </div>
      <p className="mt-1 text-xs text-neutral-500">{caption}</p>
    </>
  );

  return href.startsWith("http") ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass}
    >
      {body}
    </a>
  ) : (
    <Link href={href} className={cardClass}>
      {body}
    </Link>
  );
}

function Equalizer() {
  return (
    <span className="eq" aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
