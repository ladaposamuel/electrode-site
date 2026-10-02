import { getResumeLink } from "utils";

export const workExperience = [
  {
    title: "MySCU",
    position: "Tech Lead / Founding Engineer",
    period: "September 2025 - Present",
    location: "Lagos, Nigeria (Remote)",
    description: "Leading all engineering.",
    href: "https://myscu.co",
    status: "active" as const,
  },
  {
    title: "Audiomack",
    position: "Fullstack Software Developer",
    period: "October 2020 - Present",
    href: "https://audiomack.com",
    status: "active" as const,
    tags: ["PHP", "Laravel", "Vue.js", "AWS", "Redis"],
  },
  {
    title: "Abrahams Consulting Limited",
    position: "Full Stack Developer",
    period: "January 2018 - January 2024",
    href: getResumeLink(),
    status: "completed" as const,
    tags: ["PHP", "Laravel", "React", "MySQL"],
  },
  {
    title: "Jackocoins",
    position: "Full Stack Developer",
    period: "January 2018 - January 2023",
    href: "https://jackocoins.com",
    status: "completed" as const,
    tags: ["PHP", "Laravel", "Vue.js", "PostgreSQL"],
  },
  {
    title: "GigaLayer",
    position: "Full Stack Developer",
    period: "November 2019 - November 2020",
    href: "https://gigalayer.com",
    status: "completed" as const,
    tags: ["PHP", "Laravel", "JavaScript", "MySQL"],
  },
];
