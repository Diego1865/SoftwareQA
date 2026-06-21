import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "../../../lib/db";
import { hashPassword, createSession } from "../../../lib/auth";
import { withErrorHandling, jsonError } from "../../../lib/api-helpers";
import type { User } from "../../../utils/types";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

function slugifyUsername(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // strip accents
      .replace(/[^a-z0-9]+/g, "") || "user"
  );
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError("Cuerpo de solicitud inválido", 400);

    const {
      name,
      university,
      role,
      email,
      password,
    }: {
      name?: string;
      university?: string;
      role?: "student" | "creator";
      email?: string;
      password?: string;
    } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return jsonError("Nombre, correo y contraseña son obligatorios", 400);
    }
    if (password.length < 8) {
      return jsonError(
        "La contraseña debe tener al menos 8 caracteres",
        400
      );
    }
    const normalizedEmail = email.trim().toLowerCase();
    const safeRole: "student" | "creator" =
      role === "creator" ? "creator" : "student";

    const existing = db
      .prepare(`SELECT id FROM users WHERE email = ?`)
      .get(normalizedEmail);
    if (existing) {
      return jsonError("Ya existe una cuenta con este correo", 409);
    }

    // Derive a unique username from the name (vcruz, vcruz2, vcruz3, ...).
    const base = slugifyUsername(name);
    let username = base;
    let suffix = 1;
    while (db.prepare(`SELECT id FROM users WHERE username = ?`).get(username)) {
      suffix += 1;
      username = `${base}${suffix}`;
    }

    const id = `u_${crypto.randomUUID()}`;
    const passwordHash = await hashPassword(password);

    db.prepare(
      `INSERT INTO users (id, name, username, email, password_hash, avatar, role, university, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      name.trim(),
      username,
      normalizedEmail,
      passwordHash,
      initials(name),
      safeRole,
      university?.trim() ?? "",
      ""
    );

    await createSession(id);

    const user: User = {
      id,
      name: name.trim(),
      username,
      avatar: initials(name),
      role: safeRole,
      university: university?.trim() ?? "",
      followers: 0,
      following: 0,
      bio: "",
    };

    return NextResponse.json({ user }, { status: 201 });
  });
}
