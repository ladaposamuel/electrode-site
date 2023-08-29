import Image from "next/image";

const frameworks = [
  { name: "PHP", color: "blue" },
  { name: "Javascript", color: "yellow" },
  { name: "MySql", color: "blue" },
];

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
  const experienceYears = 5;
  // const frameworks = ['PHP', 'Laravel', 'Lumen'];

  return (
    <section>
      <h1 className="font-bold text-3xl font-serif">About Me</h1>
      <p className="my-5 text-neutral-800 dark:text-neutral-200">
        {`I am a versatile developer with a passion for crafting exceptional web applications. 
        My journey has led me through a diverse array of technologies and tools, including:`}
      </p>
      <p className=" text-neutral-800 dark:text-neutral-200">
        {/* {`${frameworks
          .map((framework) => framework.name)
          .join(", ")} frameworks.`} */}
        {stacks.map((stack) => stack).join(", ")}
      </p>

      <p className=" text-neutral-800 dark:text-neutral-200 pt-5">
        {`Each of these stacks has enriched my skill set and allowed me to create innovative solutions.
         From the elegance of JavaScript and the power of React, to the robustness of PostgreSQL and the scalability of AWS,
          I bring a dynamic blend of expertise to every project. Let's collaborate and bring your ideas to life!`}
      </p>
    </section>
  );
}
