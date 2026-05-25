import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBlogViews } from "lib/metrics";
import { name, about, avatar } from "lib/info";
import { getResumeLink } from "utils";
import { HomepageButton } from "app/components/homepage-button/homepage-button";
import { ArrowIcon } from "app/components/icons";
import { allBlogs } from "contentlayer/generated";
import { OpenToWork } from "./components/open-to-work";
import { readingData } from "../data/reading";

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

  const publishedPosts = allBlogs
    .filter((post) => !post.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  const recentPosts = publishedPosts.slice(0, 3);

  const nowReading = readingData.reading[0];
  const nowWatching = readingData.watching[0];

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
                hey, I&apos;m samuel 👋
              </h1>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                fullstack developer · open source contributor · writer
              </p>
            </div>
          </div>

          <div className="relative shrink-0">
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
          </div>
        </div>

        <p className="max-w-xl text-neutral-800 dark:text-neutral-200">
          {about()}
        </p>
      </section>

      <section>
        <SectionLabel>the numbers</SectionLabel>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Coding" href="https://wakatime.com/@electrode" live>
            <Image
              alt="Wakatime coding hours"
              src="https://wakatime.com/badge/user/c81ce760-211d-45d2-8bcd-856d260c5c8c.svg?style=flat"
              width={140}
              height={18}
              priority
              className="dark:invert"
            />
          </StatTile>
          <StatTile label="Blog views" href="/blog">
            <span className="text-2xl font-bold tabular-nums">
              {views?.toLocaleString() ?? "—"}
            </span>
          </StatTile>
          <StatTile label="Articles" href="/blog">
            <span className="text-2xl font-bold tabular-nums">
              {publishedPosts.length}
            </span>
          </StatTile>
          <StatTile label="Building" href="/works">
            <span className="text-2xl font-bold">BuzzHive</span>
          </StatTile>
        </div>
      </section>

      <OpenToWork />

      <section>
        <div className="flex items-center justify-between">
          <SectionLabel className="mb-0">currently</SectionLabel>
          <ViewAll href="/reading" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <NowCard kicker="now reading" item={nowReading} />
          <NowCard kicker="now watching" item={nowWatching} />
        </div>
      </section>

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
  href,
  live = false,
  children,
}: {
  label: string;
  href: string;
  live?: boolean;
  children: ReactNode;
}) {
  const cardClass =
    "group flex min-h-[6rem] flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:border-neutral-700";

  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          {label}
        </span>
        {live && <Equalizer />}
      </div>
      <div className="mt-2 flex items-end text-neutral-900 dark:text-neutral-100">
        {children}
      </div>
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

function NowCard({
  kicker,
  item,
}: {
  kicker: string;
  item?: { title: string; url: string; author?: string };
}) {
  if (!item) return null;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:border-neutral-700"
    >
      <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {kicker}
      </span>
      <p className="line-clamp-2 font-medium text-neutral-900 transition-colors group-hover:text-[#47a3f3] dark:text-neutral-100">
        {item.title}
      </p>
      {item.author && <p className="text-sm text-neutral-500">{item.author}</p>}
    </a>
  );
}
