import Link from "next/link";
import Image from "next/image";
import { getBlogViews, getTweetCount, getStarCount } from "lib/metrics";
import { ArrowIcon, ViewsIcon } from "app/components/icons";
import { name, about, bio, avatar } from "lib/info";
import { getResumeLink } from "utils";
import { HomepageButton } from "app/components/homepage-button/homepage-button";
import { allBlogs } from "contentlayer/generated";

export const revalidate = 60;
export const dynamic = "force-dynamic";

const blogPostLimit = 3;

export default async function HomePage() {
  let views;

  try {
    [views] = await Promise.all([getBlogViews()]);
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <section>
        <h1 className="font-bold text-3xl font-serif">{name}</h1>
        <p className="my-5 max-w-[460px] text-neutral-800 dark:text-neutral-200">
          {about()}
        </p>
        <div className="flex items-start md:items-center my-8 flex-col md:flex-row">
          <Image
            alt={name}
            className="rounded-md grayscale"
            src={avatar}
            placeholder="blur"
            width={120}
            priority
          />
          <div className="mt-8 md:mt-0 ml-0 md:ml-6 space-y-2 text-neutral-500 dark:text-neutral-400">
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://wakatime.com/@electrode"
              className="flex items-center gap-2"
            >
              {"👨🏾‍💻 Tracked Coding time: "}
              <Image
                alt={"wakatime stats"}
                src={
                  "https://wakatime.com/badge/user/c81ce760-211d-45d2-8bcd-856d260c5c8c.svg"
                }
                width={200}
                height={20}
                priority
              />
            </a>

            <Link href="/blog" className="flex items-center">
              {"👀 Blog views:"} {views}
            </Link>

            <Link
              href="/works"
              className="venhoot-text flex items-center"
            >
              <span>
                {"👷🏾 "} Currently building{" "}
                <span className="underline">Venhoot</span> &  <span className="underline">MangoLogs</span> 
              </span>
            </Link>
            <Link href="/works" className="flex items-center">
              {"🏢 "}
              {` Electrode Dev Ltd (CAC number: 7178628)`}
            </Link>
          </div>
        </div>
        <p className="my-5 max-w-[600px] text-neutral-800 dark:text-neutral-200">
          {bio()}
        </p>
        <ul className="flex flex-col md:flex-row mt-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0 font-sm text-neutral-500 dark:text-neutral-400">
          <li>
            <HomepageButton href={getResumeLink()}>
              <ArrowIcon />
              <p className="text-sm">Check my Resume</p>
            </HomepageButton>
          </li>
          <li>
            <HomepageButton href="https://github.com/ladaposamuel">
              <ArrowIcon />
              <p className="text-sm">Visit my Github Profile</p>
            </HomepageButton>
          </li>
          <li>
            <HomepageButton href="https://www.linkedin.com/in/ladapo-samuel/">
              <ArrowIcon />
              <p className="text-sm">Visit my Linkedin Profile</p>
            </HomepageButton>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h3 className="font-bold text-2 font-serif mb-5">Recent Blog Posts</h3>
        {allBlogs
          .filter((post) => !post.draft)
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          ) // Step 2
          .slice(0, 3)
          .map((post) => (
            <Link
              key={post.slug}
              className="flex flex-col space-y-1 mb-4"
              href={`/blog/${post.slug}`}
            >
              <div className="w-full flex flex-col">
                <p> ⥅ {post.title}</p>
              </div>
            </Link>
          ))}
      </section>
    </>
  );
}
