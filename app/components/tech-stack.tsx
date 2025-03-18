import Image from 'next/image';

interface TechItem {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'tools';
}

const techStack: TechItem[] = [
  // Frontend
  {
    name: 'React',
    icon: '/icons/react.svg',
    category: 'frontend',
  },
  {
    name: 'Vue.js',
    icon: '/icons/vue.svg',
    category: 'frontend',
  },
  {
    name: 'TypeScript',
    icon: '/icons/typescript.svg',
    category: 'frontend',
  },
  {
    name: 'Next.js',
    icon: '/icons/nextjs.svg',
    category: 'frontend',
  },
  // Backend
  {
    name: 'Node.js',
    icon: '/icons/nodejs.svg',
    category: 'backend',
  },
  {
    name: 'PHP',
    icon: '/icons/php.svg',
    category: 'backend',
  },
  {
    name: 'Laravel',
    icon: '/icons/laravel.svg',
    category: 'backend',
  },
  {
    name: 'Express.js',
    icon: '/icons/express.svg',
    category: 'backend',
  },
  // Database
  {
    name: 'MySQL',
    icon: '/icons/mysql.svg',
    category: 'database',
  },
  {
    name: 'PostgreSQL',
    icon: '/icons/postgresql.svg',
    category: 'database',
  },
  {
    name: 'MongoDB',
    icon: '/icons/mongodb.svg',
    category: 'database',
  },
  {
    name: 'Redis',
    icon: '/icons/redis.svg',
    category: 'database',
  },
  // Cloud & Infrastructure
  {
    name: 'AWS',
    icon: '/icons/aws.svg',
    category: 'cloud',
  },
  {
    name: 'Docker',
    icon: '/icons/docker.svg',
    category: 'cloud',
  },
  {
    name: 'DigitalOcean',
    icon: '/icons/digitalocean.svg',
    category: 'cloud',
  },
  // Tools
  {
    name: 'Git',
    icon: '/icons/git.svg',
    category: 'tools',
  },
  {
    name: 'RabbitMQ',
    icon: '/icons/rabbitmq.svg',
    category: 'tools',
  },
  {
    name: 'GitHub',
    icon: '/icons/github.svg',
    category: 'tools',
  }
];

const categories = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  cloud: 'Cloud & Infrastructure',
  tools: 'Tools & Others'
};

export function TechStack() {
  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([key, title]) => (
        <div key={key}>
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            {title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack
              .filter((tech) => tech.category === key)
              .map((tech) => (
                <div
                  key={tech.name}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-4 relative">
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 ml-1.5">
                    {tech.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
