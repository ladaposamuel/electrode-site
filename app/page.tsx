import Link from 'next/link';
import Image from 'next/image';
import { getBlogViews, getTweetCount, getStarCount } from 'lib/metrics';
import {
  ArrowIcon,
  GitHubIcon,
  TwitterIcon,
  ViewsIcon,
} from 'app/components/icons';
import { name, about, bio, avatar } from 'lib/info';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let views;

  try {
    [ views] = await Promise.all([
      getBlogViews()
    ]);
  } catch (error) {
    console.error(error);
  }

  return (
    <section>
      <h1 className="font-bold text-3xl font-serif">{name}</h1>
      <p className="my-5 max-w-[460px] text-neutral-800 dark:text-neutral-200">
        {about()}
      </p>
      <div className="flex items-start md:items-center my-8 flex-col md:flex-row">
        <Image
          alt={name}
          className="rounded-full grayscale"
          src={avatar}
          placeholder="blur"
          width={100}
          priority
        />
        <div className="mt-8 md:mt-0 ml-0 md:ml-6 space-y-2 text-neutral-500 dark:text-neutral-400">
        {'</> Total time coded:'} 
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://wakatime.com/@electrode"
            className="flex items-center gap-2"
          >
          <Image
          alt={'wakatime stats'}
          src={'https://wakatime.com/badge/user/c81ce760-211d-45d2-8bcd-856d260c5c8c.svg'}
          width={200}
          height={20}
          priority
        />
        </a>
          <Link href="/blog" className="flex items-center">
            <ViewsIcon />
            {views} {` blog views all time`}
          </Link>
        </div>
      </div>
      <p className="my-5 max-w-[600px] text-neutral-800 dark:text-neutral-200">
        {bio()}
      </p>
      <ul className="flex flex-col md:flex-row mt-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0 font-sm text-neutral-500 dark:text-neutral-400">
        <li>
          <a
            className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://resume.io/r/Ofn9CEf2z"
          >
            <ArrowIcon />
            <p className="h-7">Check my Resume</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/ladaposamuel"
          >
            <ArrowIcon />
            <p className="h-7">Visit my Github Profile</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/ladapo-samuel/"
          >
            <ArrowIcon />
            <p className="h-7">Visit my Linkedin Profile</p>
          </a>
        </li>
      </ul>
    </section>
  );
}
