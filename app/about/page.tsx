import Image from "next/image";
import { getResumeLink } from "utils";
import { TechStack } from "../components/tech-stack";
import { AboutCard } from "../components/about-card";
import { HomepageButton } from "../components/homepage-button/homepage-button";
import { ArrowIcon } from "../components/icons";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">about me</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Fullstack developer, paintball enthusiast, continuous learner
            </p>
          </div>
        </div>

        {/* <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="relative aspect-[2/1] overflow-hidden sm:aspect-[3/1]">
            <Image
              alt={"Samuel Ladapo"}
              src={"https://i.imgur.com/DEXcwFy.png"}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div> */}

        <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
          I'm a passionate Full-Stack Developer with over 5 years of experience,
          dedicated to crafting exceptional web applications. My journey in
          software development has been driven by an insatiable curiosity and a
          genuine love for problem-solving.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tighter">what I can do</h2>
        <AboutCard
          title="Development & Consulting"
          gradient="linear-gradient(to right bottom, #2563eb, #1d4ed8)"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2 text-white/90">Backend</h3>
              <ul className="list-disc space-y-1.5 pl-4 text-sm text-white/80">
                <li>Scalable systems with PHP, Laravel, Node.js</li>
                <li>Database optimization (MySQL, PostgreSQL)</li>
                <li>RESTful APIs and microservices</li>
                <li>Cloud infrastructure (AWS, DigitalOcean)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-white/90">Frontend</h3>
              <ul className="list-disc space-y-1.5 pl-4 text-sm text-white/80">
                <li>React, Vue.js, and Next.js applications</li>
                <li>Responsive and interactive UIs</li>
                <li>Modern state management</li>
                <li>Performance optimization</li>
              </ul>
            </div>
          </div>
        </AboutCard>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tighter">tech stack</h2>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
          <TechStack />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tighter">beyond coding</h2>
        <AboutCard
          title="Life Outside Code"
          gradient="linear-gradient(to right bottom, #059669, #047857)"
        >
          <div className="space-y-4 text-sm text-white/80">
            <p>
              I'm constantly exploring new technologies, attending tech conferences,
              and contributing to open-source projects. This passion drives me to
              stay at the forefront of industry trends and best practices.
            </p>
            <p>
              When I'm not immersed in code, you can find me on the paintball
              field every Sunday. This high-energy sport hones my strategic
              thinking and teamwork skills – qualities that I bring back to my
              development projects.
            </p>
          </div>
        </AboutCard>

        <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <blockquote className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
            "The only way to do great work is to love what you do. If you haven't
            found it yet, keep looking. Don't settle."
          </blockquote>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            — Steve Jobs
          </p>
        </div>
      </section>

      <section className="mt-10">
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
