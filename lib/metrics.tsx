import 'server-only';

import { Octokit } from '@octokit/rest';
import { collection, doc, getDocs } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { cache } from 'react';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getBlogViews = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'views'));
    const views = querySnapshot.docs.map((doc) => {
      const data = doc.data() as { count: number, timestamp: any };
      // Convert the Firestore Timestamp to a simple value
      return { ...data, timestamp: data.timestamp.toMillis() };
    });


    const totalCount: number = views.reduce((sum, blog) => sum + blog.count, 0);
    return totalCount;
  } catch (error) {
    console.error('Error fetching blog views:', error);
    throw error;
  }
};




export const getViewsCount = cache(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'views'));
      const views = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert the Firestore Timestamp to a simple value
        return { ...data, timestamp: data.timestamp.toMillis() };
      });
      return views;
    } catch (error) {
      console.error('Error fetching blog views count:', error);
      throw error;
    }
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

