import Link from "next/link";
import { getResumeLink } from "utils";

export default function Works() {
  const projects = [
    {
      name: "Venhoot",
      description: "Online review and rating system for Instagram businesses",
      href: "https://venhoot.com",
    },
    {
      name: "Mangomoney App (iOS & Android)",
      description:
        "A mobile application that allows users to schedule money transfers and bills payments. (Not Live yet)",
      href: "https://mangomoney.app",
    },
    {
      name: "MangoLogs",
      description:
        "An open source logging library for NodeJs that allows you to log requests to a server to memory or a database.",
      href: "https://github.com/ladaposamuel/mangologs",
    },
  ];

  const workExperience = [
    {
      name: "Audiomack.com",
      position: "Fullstack Software Developer",
      period: "October 2020 - Present",
      href: "https://audiomack.com",
    },
    {
      name: "Abrahams Consulting Limited",
      position: "Full Stack Developer",
      period: "January 2018 - January 2024",
      href: getResumeLink(),
    },
    {
      name: "Jackocoins.com",
      position: "Full Stack Developer",
      period: "January 2018 - January 2023",
      href: "https://jackocoins.com",
    },
    {
      name: "GigaLayer.com",
      position: "Full Stack Developer",
      period: "November 2019 - November 2020",
      href: "https://gigalayer.com",
    },
  ];

  return (
    <section>
      <h1 className="font-bold text-3xl font-serif mb-5">My Works</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        {projects.map((project, index) => (
          <Link
            key={index}
            className="flex flex-col space-y-1 mb-4"
            href={project.href}
          >
            <div className="w-full flex flex-col">
              <p className="font-medium">⥱ {project.name}</p>
              <p className="text-gray-600">{project.description}</p>
            </div>
          </Link>
        ))}
        <i className="text-gray-600 text-sm">
          Working on some other cool secret project I'm going to list soon.
        </i>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
        {workExperience.map((work, index) => (
          <Link
            key={index}
            className="flex flex-col space-y-1 mb-4"
            href={work.href}
          >
            <div className="w-full flex flex-col">
              <p className="font-medium">⥱ {work.name}</p>
              <p className="text-gray-600">
                {work.position} ({work.period})
              </p>
            </div>
          </Link>
        ))}
        See my [
        <Link
          href={getResumeLink()}
          className="text-orange-600 hover:underline"
        >
          resume
        </Link>
        ] for more details.
      </div>
    </section>
  );
}
