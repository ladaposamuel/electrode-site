import Image from "next/image";
import { ContactMethod } from "../components/contact-method";

export default function Contact() {
  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      description: "hello@electrode.dev",
      href: "mailto:hello@electrode.dev",
      color: "linear-gradient(to right bottom, #2563eb, #1d4ed8)",
    },
    {
      icon: "💼",
      title: "LinkedIn",
      description: "Let's connect professionally",
      href: "https://www.linkedin.com/in/ladapo-samuel/",
      color: "linear-gradient(to right bottom, #0077b5, #00548c)",
    },
    {
      icon: "🐦",
      title: "Twitter",
      description: "Follow me for tech updates",
      href: "https://twitter.com/ladapo_samuel",
      color: "linear-gradient(to right bottom, #1da1f2, #0c85d0)",
    },
    {
      icon: "💻",
      title: "GitHub",
      description: "Check out my open source work",
      href: "https://github.com/ladaposamuel",
      color: "linear-gradient(to right bottom, #333333, #24292e)",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">let's connect</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Open for opportunities and collaborations
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="relative aspect-[2/1] overflow-hidden sm:aspect-[3/1]">
            <Image
              alt={"Samuel Ladapo"}
              src={"https://i.imgur.com/DEXcwFy.png"}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tighter">get in touch</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {contactMethods.map((method) => (
            <ContactMethod key={method.title} {...method} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tighter">what I can help with</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
            <h3 className="font-medium">Development Services</h3>
            <ul className="list-disc space-y-2 pl-4 text-sm text-neutral-600 dark:text-neutral-400">
              <li>Full-stack software development</li>
              <li>API design and development</li>
              <li>Performance optimization</li>
              <li>Cloud infrastructure setup</li>
              <li>Technical architecture design</li>
            </ul>
          </div>
          <div className="space-y-4 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
            <h3 className="font-medium">Consulting Services</h3>
            <ul className="list-disc space-y-2 pl-4 text-sm text-neutral-600 dark:text-neutral-400">
              <li>Technical strategy planning</li>
              <li>Code review and best practices</li>
              <li>Team mentoring and training</li>
              <li>Technology stack selection</li>
              <li>Project planning and estimation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
        <blockquote className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
          "The best way to predict the future is to create it."
        </blockquote>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">— Peter Drucker</p>
      </section>
    </div>
  );
}
