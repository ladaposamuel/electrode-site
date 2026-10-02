import { WorkCard } from "../components/work-card";
import Link from "next/link";
import { getResumeLink } from "utils";
import { workExperience } from "lib/experience";

export default function Works() {
  //   status: "wip" as const,
  //   status: "completed" as const,

  const projects = [
    {
      title: "BuzzHive",
      description:
        "A tool for online creators to manage their communities and share resources",
      href: "https://bz-web.mybuzzhive.com/",
      status: "sunset" as const,
      tags: [
        "Next.js",
        "Nest.js",
        "TypeScript",
        "Tailwind",
        "PostgreSQL",
        "Docker",
        "RabbitMQ",
        "Redis",
        "GitHub Actions",
        "AWS",
        "DigitalOcean",
        "GitLab CI/CD",
      ],
    },
    {
      title: "Venhoot",
      description: "Online review and rating system for Instagram businesses",
      href: "https://venhoot.com",
      status: "wip" as const,
      tags: ["Next.js", "TypeScript", "Tailwind", "Prisma", "PostgreSQL"],
    },
    {
      title: "Mangomoney App",
      description:
        "A mobile application that allows users to schedule money transfers and bills payments.",
      href: "https://mangomoney.app",
      status: "abandoned" as const,
      tags: ["React Native", "Node.js", "MongoDB"],
    },
    {
      title: "MangoLogs",
      description:
        "An open source logging library for NodeJs that allows you to log requests to a server to memory or a database.",
      href: "https://github.com/ladaposamuel/mangologs",
      status: "wip" as const,
      tags: ["Node.js", "TypeScript", "Open Source"],
    },
  ];

  return (
    <section>
      <h1 className="font-bold text-2xl mb-6 tracking-tighter">my works</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
            Projects
          </h2>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {projects.map((project) => (
              <WorkCard key={project.title} {...project} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
            Work Experience
          </h2>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {workExperience.map((work) => (
              <WorkCard key={work.title} {...work} />
            ))}
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
            See my{" "}
            <Link
              href={getResumeLink()}
              className="text-neutral-900 dark:text-neutral-100 hover:underline"
            >
              resume
            </Link>{" "}
            for more details.
          </p>
        </div>
      </div>
    </section>
  );
}
