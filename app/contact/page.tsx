import Image from "next/image";

export default function Contact() {
  return (
    <section>
      <h1 className="font-bold text-3xl font-serif mb-5">Let's Connect!</h1>

      <Image
        alt={"Samuel Ladapo"}
        height={600}
        width={600}
        src={"https://i.imgur.com/DEXcwFy.png"}
        quality={100}
        className="rounded-lg shadow-md mb-6"
      />

      <blockquote className="border-l-4 border-primary-500 pl-4 italic text-lg text-neutral-700 dark:text-neutral-300 mb-6">
        "The best way to predict the future is to create it." - Peter Drucker
      </blockquote>

      <p className="my-5 text-neutral-800 dark:text-neutral-200">
        {`I'm available for contract work, consultations, and to answer any programming or coding-related questions. If you're interested in discussing potential projects or seeking technical advice, please don't hesitate to reach out at `}
        <a
          href="mailto:hello@electrode.dev"
          className="text-primary-500 hover:underline font-semibold"
        >
          hello@electrode.dev
        </a>
        {`.`}
      </p>

      <p className="my-5 text-neutral-800 dark:text-neutral-200">
        {`As an experienced developer, I offer a range of skills and expertise, including:`}
      </p>

      <ul className="list-disc pl-5 mb-5 text-neutral-800 dark:text-neutral-200">
        <li>Full-stack software development</li>
        <li>Guiding projects from concept to execution</li>
        <li>Strategic planning and architectural design</li>
        <li>Advising on best practices in software development</li>
        <li>Innovative software solution ideation</li>
        <li>Agile methodologies and project management</li>
        <li>Code optimization and performance tuning</li>
        <li>Integration of emerging technologies</li>
      </ul>
      <p className="text-neutral-800 dark:text-neutral-200">
        {`Whether you need technical consultation, contract work, or have specific programming questions, I'm here to assist. I look forward to the opportunity to contribute to your projects or provide the information you need.`}
      </p>
    </section>
  );
}
