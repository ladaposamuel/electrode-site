const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = {
  'react': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
  'vue': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg',
  'typescript': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg',
  'nextjs': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg',
  'nodejs': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg',
  'php': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg',
  'laravel': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/laravel/laravel-original.svg',
  'express': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg',
  'mysql': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg',
  'postgresql': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg',
  'mongodb': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg',
  'redis': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg',
  'aws': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'docker': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg',
  'digitalocean': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/digitalocean/digitalocean-original.svg',
  'git': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg',
  'rabbitmq': 'https://www.vectorlogo.zone/logos/rabbitmq/rabbitmq-icon.svg',
  'github': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg'
};

const iconsDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

Object.entries(icons).forEach(([name, url]) => {
  const filePath = path.join(iconsDir, `${name}.svg`);
  https.get(url, (response) => {
    const file = fs.createWriteStream(filePath);
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${name} icon`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${name} icon:`, err);
  });
});
