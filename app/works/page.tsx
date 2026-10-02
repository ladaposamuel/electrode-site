import { WorkCard } from "../components/work-card";
import Link from "next/link";
import { getResumeLink } from "utils";
import { workExperience } from "lib/experience";
import { projects } from "lib/projects";

export default function Works() {
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
