import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "./db";
import { AuthError } from "./auth";
import type { Post, Comment, User } from "../utils/types";

/** Wraps a route handler body, turning AuthError into a 401 and any other
 * thrown error into a 500, so individual routes don't need try/catch
 * boilerplate around every auth check. */
export async function withErrorHandling(
  fn: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

// --- Row -> API shape mappers -------------------------------------------

interface PostRow {
  id: string;
  author_id: string;
  type: Post["type"];
  title: string | null;
  body: string;
  tags: string;
  saves: number;
  created_at: string;
  is_premium: number;
  price: number | null;
  thumbnail: string | null;
  subject: string | null;
  reported: number;
}

interface UserRow {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: User["role"];
  university: string;
  followers: number;
  following: number;
  bio: string;
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    avatar: row.avatar,
    role: row.role,
    university: row.university,
    followers: row.followers,
    following: row.following,
    bio: row.bio,
  };
}

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso + "Z").getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "Ahora mismo";
  if (min < 60) return `Hace ${min}m`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Hace ${days}d`;
}

const userStmt = db.prepare(
  `SELECT id, name, username, avatar, role, university, followers, following, bio
   FROM users WHERE id = ?`
);

const commentsStmt = db.prepare(
  `SELECT c.id, c.text, c.created_at, u.name as author_name, u.avatar
   FROM comments c JOIN users u ON u.id = c.author_id
   WHERE c.post_id = ? ORDER BY c.created_at ASC`
);

const likesCountStmt = db.prepare(
  `SELECT COUNT(*) as n FROM likes WHERE post_id = ?`
);
const commentsCountStmt = db.prepare(
  `SELECT COUNT(*) as n FROM comments WHERE post_id = ?`
);
const likedByStmt = db.prepare(
  `SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?`
);
const savedByStmt = db.prepare(
  `SELECT 1 FROM saves WHERE post_id = ? AND user_id = ?`
);
const purchasedByStmt = db.prepare(
  `SELECT 1 FROM purchases WHERE post_id = ? AND user_id = ?`
);

/** Hydrates a raw `posts` row into the full `Post` shape the frontend
 * expects, including the denormalized author object, like/save/purchase
 * state for the requesting user, and the comment list. */
export function hydratePost(row: PostRow, viewerId: string | null): Post {
  const authorRow = userStmt.get(row.author_id) as UserRow;
  const commentRows = commentsStmt.all(row.id) as {
    id: string;
    text: string;
    created_at: string;
    author_name: string;
    avatar: string;
  }[];

  const likes = (likesCountStmt.get(row.id) as { n: number }).n;
  const comments = (commentsCountStmt.get(row.id) as { n: number }).n;

  const liked = viewerId ? !!likedByStmt.get(row.id, viewerId) : false;
  const saved = viewerId ? !!savedByStmt.get(row.id, viewerId) : false;
  const purchased = viewerId
    ? !!purchasedByStmt.get(row.id, viewerId)
    : false;

  const commentsList: Comment[] = commentRows.map((c) => ({
    id: c.id,
    authorName: c.author_name,
    avatar: c.avatar,
    text: c.text,
    createdAt: relativeTime(c.created_at),
  }));

  return {
    id: row.id,
    author: rowToUser(authorRow),
    type: row.type,
    title: row.title ?? undefined,
    body: row.body,
    tags: JSON.parse(row.tags) as string[],
    likes,
    comments,
    commentsList,
    saves: row.saves,
    createdAt: relativeTime(row.created_at),
    isPremium: !!row.is_premium,
    price: row.price ?? undefined,
    thumbnail: row.thumbnail ?? undefined,
    subject: row.subject ?? undefined,
    liked,
    saved,
    purchased,
    reported: !!row.reported,
  };
}

export function getPostRow(postId: string): PostRow | undefined {
  return db.prepare(`SELECT * FROM posts WHERE id = ?`).get(postId) as
    | PostRow
    | undefined;
}

export function logActivity(
  userId: string,
  type: "like" | "save" | "comment" | "publish" | "follow",
  text: string,
  accent: string
) {
  db.prepare(
    `INSERT INTO activity (id, user_id, type, text, accent) VALUES (?, ?, ?, ?, ?)`
  ).run(`act_${crypto.randomUUID()}`, userId, type, text, accent);
}
