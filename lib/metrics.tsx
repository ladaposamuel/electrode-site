import 'server-only';

import { Octokit } from '@octokit/rest';

import { cache } from 'react';
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, '../db.json')

type Data = {
  views: Array<{
    id: number;
    title: string;
    slug: string;
    count: number;
  }>;
};

export const getBlogViews = async () => {
  const defaultData: Data = { views: [] };

  const adapter = new JSONFile<Data>(file);
  const db = new Low<Data>(adapter, defaultData);
  await db.read();
  const views = db.data.views;

  const totalCount: number = views.reduce((sum, blog) => sum + blog.count, 0);

  return totalCount;
};


//total views count on all blogs
export const getViewsCount = cache(async () => {
  const defaultData: Data = { views: [] };
    const adapter = new JSONFile<Data>(file);
    const db = new Low<Data>(adapter, defaultData);
    await db.read();
    let views =   db.data.views;
    return views;
});

export async function getTweetCount() {
  if (!process.env.TWITTER_API_TOKEN) {
    return 0;
  }

  const response = await fetch(
    `https://api.twitter.com/2/users/by/username/leeerob?user.fields=public_metrics`,
    {
      cache: 'force-cache',
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
      },
    }
  );

  const { data } = await response.json();
  return Number(data.public_metrics.tweet_count);
}

export const getStarCount = cache(async () => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const req = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: 'leerob',
    repo: 'leerob.io',
  });

  return req.data.stargazers_count;
});

