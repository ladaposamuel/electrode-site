"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { type Session } from "next-auth";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// import { revalidatePath } from 'next/cache';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "../db.json");

type Data = {
  views: Array<{
    id: number;
    title: string;
    slug: string;
    count: number;
  }>;
};

export async function increment(slug: string) {
  const defaultData: Data = { views: [] };
  const adapter = new JSONFile<Data>(file);
  const db = new Low<Data>(adapter, defaultData);
  await db.read();

  const views = db.data.views;
  const indexToUpdate = views.findIndex((view) => view.slug === slug);
  if (indexToUpdate !== -1) {
    views[indexToUpdate].count += 1;
  }
  await db.write();
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
