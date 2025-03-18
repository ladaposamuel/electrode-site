const fs = require('fs');
const path = require('path');

// Get the article name from the command line arguments
const args = process.argv.slice(2);
const nameIndex = args.indexOf('-n');
if (nameIndex === -1 || !args[nameIndex + 1]) {
  console.error('Please provide a valid article name using the -n option.');
  process.exit(1);
}

const articleTitle = args[nameIndex + 1];
const slug = articleTitle.toLowerCase().replace(/ /g, '-'); // Convert title to slug
const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

// Content template for the MDX file
const content = `---
title: '${articleTitle}'
publishedAt: '${currentDate}'
summary: '-'
draft: false
---`;

// Define the output path
const outputPath = path.join(__dirname, '../content', `${slug}.mdx`);

// Write the file to the content folder
fs.writeFileSync(outputPath, content, 'utf8');

console.log(`New article created: /content/${slug}.mdx`);