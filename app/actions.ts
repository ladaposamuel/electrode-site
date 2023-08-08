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
  runTransaction,
  serverTimestamp,
} from "firebase/firestore"; // Import the necessary Firestore functions
import { initializeApp,  } from "firebase/app";

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

interface View {
  title: string;
  slug: string;
  count: number;
  timestamp: any;
}
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const viewsCollection = collection(db, "views");


  export async function increment(title: string, slug: string): Promise<void> {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const viewsCollection = collection(db, 'views');
  
    const viewDocRef = doc(viewsCollection, slug);
  
    try {
      await runTransaction(db, async (transaction) => {
        const viewDoc = await transaction.get(viewDocRef);
  
        if (viewDoc.exists()) {
          const viewData = viewDoc.data() as View;
          const count = viewData.count + 1;
          transaction.update(viewDocRef, { count });
        } else {
          const newViewData: View = {
            title,
            slug,
            count: 1,
            timestamp: serverTimestamp(),
          };
          transaction.set(viewDocRef, newViewData);
        }
      });
    } catch (error) {
      console.error('Error updating or adding view:', error);
      throw error;
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
