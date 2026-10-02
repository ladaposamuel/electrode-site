import { ContactMethod } from "../components/contact-method";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "../components/icons";
import { CopyEmail } from "@/components/copy-email";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Samuel Ladapo",
};

const socials = [
  {
    icon: <LinkedInIcon />,
    title: "LinkedIn",
    handle: "ladapo-samuel",
    description: "Let's connect professionally",
    href: "https://www.linkedin.com/in/ladapo-samuel/",
  },
  {
    icon: <TwitterIcon />,
    title: "X / Twitter",
    handle: "@ladapo_samuel",
    description: "Tech updates and thoughts",
    href: "https://twitter.com/ladapo_samuel",
  },
  {
    icon: <GitHubIcon />,
    title: "GitHub",
    handle: "ladaposamuel",
    description: "My open source work",
    href: "https://github.com/ladaposamuel",
  },
];

const services = [
  "Full-stack development",
  "API design",
  "Performance",
  "Cloud infrastructure",
  "Architecture",
  "Code review",
  "Mentoring",
  "Tech stack selection",
];

export default function Contact() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter">let's connect</h1>
          <p className="mt-1 flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Open for opportunities and collaborations
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <img
            alt="Samuel Ladapo"
            src="https://i.imgur.com/DEXcwFy.png"
            className="block h-auto w-full"
          />
        </div>
      </section>

      <CopyEmail />

      <section>
        <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
          Elsewhere
        </h2>
        <div>
          {socials.map((social) => (
            <ContactMethod key={social.title} {...social} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
          What I can help with
        </h2>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <span
              key={service}
              className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-300"
            >
              {service}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
