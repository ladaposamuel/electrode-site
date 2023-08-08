"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { type Session } from "next-auth";

import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"; // Import the necessary Firestore functions
import { initializeApp } from "firebase/app";

// import { revalidatePath } from 'next/cache';

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

export async function increment(title: string, slug: string) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const viewsCollection = collection(db, "views");

  // Retrieve all documents from the "views" collection
  const querySnapshot = await getDocs(viewsCollection);
  const views = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const indexToUpdate = views.findIndex((view) => view.slug === slug);
  if (indexToUpdate !== -1) {
    // Increment the count property
    views[indexToUpdate].count += 1;

    // Update the document in Firestore
    const viewDoc = doc(db, "views", views[indexToUpdate].id);
    await updateDoc(viewDoc, { count: views[indexToUpdate].count });
  } else {
    // Add a new document to Firestore
    await addDoc(viewsCollection, {
      title,
      slug,
      count: 1,
      timestamp: serverTimestamp(),
    });
  }
}

async function getSession(): Promise<Session> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

// export async function saveGuestbookEntry(formData: FormData) {
//   const session = await getSession();
//   const email = session.user?.email as string;
//   const created_by = session.user?.name as string;
//   const entry = formData.get('entry')?.toString() || '';
//   const body = entry.slice(0, 500);

//   await queryBuilder
//     .insertInto('guestbook')
//     .values({ email, body, created_by })
//     .execute();

//   revalidatePath('/guestbook');
// }
