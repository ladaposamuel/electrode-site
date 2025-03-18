import Link from "next/link";
import Image from "next/image";
import { getBlogViews, getTweetCount, getStarCount } from "lib/metrics";
import { ArrowIcon } from "app/components/icons";
import { name, about, bio, avatar } from "lib/info";
import { getResumeLink } from "utils";
import { HomepageButton } from "app/components/homepage-button/homepage-button";
import { allBlogs } from "contentlayer/generated";
import { StatCard } from "./components/stat-card";
import { BlogPreview } from "./components/blog-preview";
import { ContentPreview } from "./components/content-preview";
import { OpenToWork } from "./components/open-to-work";
import { readingData } from "../data/reading";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let views;

  try {
    [views] = await Promise.all([getBlogViews()]);
  } catch (error) {
    console.error(error);
  }

  const recentPosts = allBlogs
    .filter((post) => !post.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">
              hey, I'm samuel 👋
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              fullstack developer, open source contributor, writer
            </p>
          </div>
          {/* Temporarily commented out
          <Image
            alt={name}
            className="rounded-full grayscale hover:grayscale-0 transition-all"
            src={avatar}
            placeholder="blur"
            width={100}
            height={100}
            priority
          />
          */}
        </div>
        <p className="text-neutral-800 dark:text-neutral-200">{about()}</p>
      </section>

      <section className="space-y-4">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <StatCard
              icon="👨🏾‍💻"
              label="Coding Stats"
              value={
                <div className="flex items-center justify-center w-full">
                  <Image
                    alt="wakatime stats"
                    src="https://wakatime.com/badge/user/c81ce760-211d-45d2-8bcd-856d260c5c8c.svg?style=flat"
                    width={200}
                    height={20}
                    priority
                    className="dark:invert"
                  />
                </div>
              }
              href="https://wakatime.com/@electrode"
            />
          </div>
          <StatCard
            icon="👀"
            label="Blog Views"
            value={views?.toLocaleString() ?? "0"}
            href="/blog"
          />
          <StatCard
            icon="🏗️"
            label="Active Projects"
            value="Venhoot & MangoLogs"
            href="/works"
          />
        </div>
      </section>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <ContentPreview
          title="currently reading"
          items={readingData.reading}
          viewAllLink="/reading"
        />
        <ContentPreview
          title="currently watching"
          items={readingData.watching}
          viewAllLink="/reading"
        />
      </div>

      <OpenToWork />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            recent posts
          </h2>
          <Link
            href="/blog"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            view all →
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-1">
          {recentPosts.map((post) => (
            <BlogPreview key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-2">
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
        </div>
      </section>
    </div>
  );
}
