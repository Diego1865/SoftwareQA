import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "./db";
import type { User } from "../utils/types";

export const SESSION_COOKIE = "sg_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

// --- Password hashing -------------------------------------------------

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// --- Session tokens -----------------------------------------------------
// We issue a random opaque token to the browser (in an httpOnly cookie) and
// only ever store a SHA-256 hash of it server-side, in the `sessions` table.
// This way a leaked database doesn't hand out usable session tokens, the
// same way we wouldn't want a leaked database to hand out usable passwords.

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  db.prepare(
    `INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)`
  ).run(tokenHash, userId, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(
      hashToken(token)
    );
  }
  cookieStore.delete(SESSION_COOKIE);
}

interface UserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: "student" | "creator" | "moderator";
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

/**
 * Reads the session cookie (if any), validates it against the sessions
 * table, and returns the associated user. Returns null if there's no
 * valid session — callers decide whether that's a 401 or just "logged out".
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = db
    .prepare(
      `SELECT user_id, expires_at FROM sessions WHERE token_hash = ?`
    )
    .get(tokenHash) as { user_id: string; expires_at: string } | undefined;

  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(tokenHash);
    return null;
  }

  const row = db
    .prepare(
      `SELECT id, name, username, email, avatar, role, university, followers, following, bio
       FROM users WHERE id = ?`
    )
    .get(session.user_id) as UserRow | undefined;

  if (!row) return null;
  return rowToUser(row);
}

/**
 * Convenience wrapper for route handlers that require auth: returns the
 * current user, or throws an AuthError that route handlers turn into a
 * 401 JSON response.
 */
export class AuthError extends Error {}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Not authenticated");
  return user;
}
