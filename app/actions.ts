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
import { cookies, headers } from "next/headers";
import { createHash, randomUUID } from "node:crypto";

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

  // Per-reader cap (the visible "X/50") plus a higher per-IP ceiling that curbs abuse
  // from someone clearing their cookie to clap repeatedly behind the same network.
  const USER_CLAP_CAP = 50;
  const IP_CLAP_CAP = 250;
  const CLAPPER_COOKIE = "clapper_id";

  // Resolves a stable identity for the current clapper. The httpOnly cookie is the
  // primary identity (and survives IP changes); a salted hash of the request IP is a
  // secondary, coarser abuse signal. The raw IP is never persisted.
  async function resolveClapperIdentity(): Promise<{ clapperId: string; ipHash: string }> {
    const cookieStore = await cookies();
    let clapperId = cookieStore.get(CLAPPER_COOKIE)?.value;
    if (!clapperId) {
      clapperId = randomUUID();
      cookieStore.set(CLAPPER_COOKIE, clapperId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    const headerStore = await headers();
    const forwarded = headerStore.get("x-forwarded-for");
    const ip =
      (forwarded ? forwarded.split(",")[0] : headerStore.get("x-real-ip"))?.trim() ||
      "unknown";
    const salt = process.env.CLAP_HASH_SALT ?? "electrode-clap-salt";
    const ipHash = createHash("sha256").update(`${ip}${salt}`).digest("hex");

    return { clapperId, ipHash };
  }

  // Records a batch of Medium-style claps for a post. The running total lives on
  // claps/{slug}; per-reader and per-IP tallies live in subcollections so both caps
  // are enforced atomically. Returns the authoritative counts for the calling reader.
  export async function clap(
    title: string,
    slug: string,
    delta: number
  ): Promise<{ total: number; userClaps: number; capped: boolean }> {
    const requested = Math.min(Math.max(Math.floor(delta) || 0, 0), USER_CLAP_CAP);

    const { clapperId, ipHash } = await resolveClapperIdentity();

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const clapDocRef = doc(db, "claps", slug);
    const clapperDocRef = doc(db, "claps", slug, "clappers", clapperId);
    const ipDocRef = doc(db, "claps", slug, "ipClappers", ipHash);

    try {
      return await runTransaction(db, async (transaction) => {
        const [clapDoc, clapperDoc, ipDoc] = await Promise.all([
          transaction.get(clapDocRef),
          transaction.get(clapperDocRef),
          transaction.get(ipDocRef),
        ]);

        const total = clapDoc.exists() ? (clapDoc.data().count as number) : 0;
        const userClaps = clapperDoc.exists() ? (clapperDoc.data().count as number) : 0;
        const ipClaps = ipDoc.exists() ? (ipDoc.data().count as number) : 0;

        // Grant only what both the per-reader and per-IP caps still permit.
        const allowed = Math.max(
          0,
          Math.min(requested, USER_CLAP_CAP - userClaps, IP_CLAP_CAP - ipClaps)
        );

        if (allowed === 0) {
          return { total, userClaps, capped: userClaps >= USER_CLAP_CAP };
        }

        const newTotal = total + allowed;
        const newUserClaps = userClaps + allowed;
        const newIpClaps = ipClaps + allowed;

        if (clapDoc.exists()) {
          transaction.update(clapDocRef, { count: newTotal });
        } else {
          transaction.set(clapDocRef, {
            title,
            slug,
            count: newTotal,
            timestamp: serverTimestamp(),
          });
        }

        transaction.set(
          clapperDocRef,
          { count: newUserClaps, ipHash, updatedAt: serverTimestamp() },
          { merge: true }
        );
        transaction.set(
          ipDocRef,
          { count: newIpClaps, updatedAt: serverTimestamp() },
          { merge: true }
        );

        return {
          total: newTotal,
          userClaps: newUserClaps,
          capped: newUserClaps >= USER_CLAP_CAP,
        };
      });
    } catch (error) {
      console.error("Error recording clap:", error);
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
