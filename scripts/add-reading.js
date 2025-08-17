#!/usr/bin/env node
const { createInterface } = require('readline');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const readingDataPath = join(__dirname, '../data/reading.ts');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

const validTypes = ['resource', 'video', 'article', 'tweet', 'tool'];

const isValidType = (type) => validTypes.includes(type);

async function main() {
  try {
    const title = await question('Enter title: ');
    const url = await question('Enter URL: ');
    let type = 'resource';
    const typeInput = await question('Enter type (resource/tool/article/video) [default: resource]: ') || 'resource';
    
    if (isValidType(typeInput)) {
      type = typeInput;
    } else {
      console.error('Invalid type. Using default: resource');
    }
    
    const author = await question('Enter author (optional): ');
    const notes = await question('Enter notes: ');

    // Read the current reading data
    const fileContent = readFileSync(readingDataPath, 'utf8');
    const match = fileContent.match(/export const readingData: ReadingData = ({[\s\S]*});/);

    if (!match) {
      console.error('Could not parse reading data file');
      process.exit(1);
    }

    const currentData = eval(`(${match[1]})`);

    // Create new item
    const newItem = {
      title,
      url,
      type,
      ...(author && { author }),
      date: new Date().toISOString().split('T')[0],
      notes,
    };

    // Add to appropriate section based on type
    if (type === 'video') {
      currentData.watching.unshift(newItem);
    } else {
      currentData.reading.unshift(newItem);
    }

    // Generate the new file content
    const newFileContent = `import { ReadingData } from "@/types/reading";

export const readingData: ReadingData = ${JSON.stringify(currentData, null, 2)};
`;

    // Write back to file
    writeFileSync(readingDataPath, newFileContent, 'utf8');

    console.log(`\nSuccessfully added new ${type}: ${title}`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    rl.close();
  }
}

main();
