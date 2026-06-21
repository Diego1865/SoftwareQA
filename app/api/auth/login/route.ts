import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { verifyPassword, createSession } from "../../../lib/auth";
import { withErrorHandling, jsonError } from "../../../lib/api-helpers";
import type { User } from "../../../utils/types";

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
  password_hash: string;
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError("Cuerpo de solicitud inválido", 400);

    const { email, password }: { email?: string; password?: string } = body;
    if (!email?.trim() || !password) {
      return jsonError("Correo y contraseña son obligatorios", 400);
    }

    const row = db
      .prepare(
        `SELECT id, name, username, avatar, role, university, followers, following, bio, password_hash
         FROM users WHERE email = ?`
      )
      .get(email.trim().toLowerCase()) as UserRow | undefined;

    // Same error for "no such user" and "wrong password" — don't leak which
    // one it was.
    if (!row || !(await verifyPassword(password, row.password_hash))) {
      return jsonError("Correo o contraseña incorrectos", 401);
    }

    await createSession(row.id);

    const user: User = {
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

    return NextResponse.json({ user });
  });
}
