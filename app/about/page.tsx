import Image from "next/image";
import { getResumeLink } from "utils";

const frameworks = [
  { name: "PHP", color: "blue" },
  { name: "Javascript", color: "yellow" },
  { name: "MySql", color: "blue" },
];

function Badge(props) {
  return (
    <a
      {...props}
      target="_blank"
      className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded p-1 text-sm inline-flex items-center leading-4 text-neutral-900 dark:text-neutral-100 no-underline"
    />
  );
}

const stacks = [
  "PHP",
  "GIT",
  "RabbitMQ",
  "PostgreSQL",
  "JavaScript",
  "TypeScript",
  "React",
  "Laravel",
  "Vue.js",
  "MySQL",
  "AWS",
  "Node.js",
];

const FrameworkImages = () => (
  <div className="pt-5">
    {frameworks.map(({ name, color }) => (
      <Image
        alt={`${name} stack badge`}
        src={`https://img.shields.io/badge/stack-${name}-${color}`}
        width={100}
        height={20}
        priority
        className="inline"
      />
    ))}
  </div>
);

export default function AboutPage() {
  return (
    <section>
      <h1 className="font-bold text-3xl font-serif">About Me</h1>
      <p className="my-5 text-neutral-800 dark:text-neutral-200">
        {`I'm a passionate Full-Stack Developer with over 5 years of experience, dedicated to crafting exceptional web applications. My journey in software development has been driven by an insatiable curiosity and a genuine love for problem-solving.`}
      </p>
      <h2 className="font-bold text-2xl font-serif mt-8">What I Can Do</h2>
      <ul className="list-disc pl-5 mt-4 text-neutral-800 dark:text-neutral-200">
        <li>
          Develop scalable and efficient backend systems using PHP, Laravel,
          Node.js, and Express.js
        </li>
        <li>
          Create responsive and interactive front-end applications with React,
          Vue.js, and Next.js
        </li>
        <li>
          Design and optimize database structures using MySQL, PostgreSQL, and
          MongoDB
        </li>
        <li>Implement RESTful APIs and integrate third-party services</li>
        <li>Set up and manage cloud infrastructure on AWS and DigitalOcean</li>
        <li>Implement CI/CD pipelines and follow Agile methodologies</li>
        <li>
          Integrate AI and machine learning solutions, such as OpenAI, into
          applications
        </li>
      </ul>
      <h2 className="font-bold text-2xl font-serif mt-8">My Tech Stack</h2>
      <p className="text-neutral-800 dark:text-neutral-200 mt-4">
        {stacks.map((stack, index) => (
          <>
            <Badge key={index} href={getResumeLink()}>
              {`${stack}`}
            </Badge>{" "}
          </>
        ))}
      </p>
      <h2 className="font-bold text-2xl font-serif mt-8">
        Passion for Technology
      </h2>
      <p className="mt-4 text-neutral-800 dark:text-neutral-200">
        {`My enthusiasm for software development goes beyond just writing code. I'm constantly exploring new technologies, attending tech conferences, and contributing to open-source projects. This passion drives me to stay at the forefront of industry trends and best practices, ensuring that I can deliver cutting-edge solutions to every project I undertake.`}
      </p>
      <h2 className="font-bold text-2xl font-serif mt-8">Beyond Coding</h2>
      <p className="mt-4 text-neutral-800 dark:text-neutral-200">
        {`When I'm not immersed in code, you can find me on the paintball field every Sunday. This high-energy sport not only provides an exhilarating break from the digital world but also hones my strategic thinking and teamwork skills – qualities that I bring back to my development projects.`}
      </p>
      <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-700 pl-4 mt-8 italic text-neutral-800 dark:text-neutral-200">
        "The only way to do great work is to love what you do. If you haven't
        found it yet, keep looking. Don't settle." - Steve Jobs
      </blockquote>
      <p className="mt-8 text-neutral-800 dark:text-neutral-200">
        {`I'm always excited to take on new challenges and collaborate on innovative projects. Whether you need a scalable backend system, an intuitive user interface, or a complete full-stack solution, I'm ready to bring your ideas to life with passion and expertise.`}
      </p>

      <section className="mt-10">
        <p className="m-1">
          Since you got here :), here's one of my favourite playlists:
        </p>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/playlist/60zXXNjqoiJsYpgk9VquzE?utm_source=generator"
          width="100%"
          height="352"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </section>
    </section>
  );
}
