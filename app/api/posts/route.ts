import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "../../lib/db";
import { getCurrentUser, requireUser } from "../../lib/auth";
import {
  withErrorHandling,
  jsonError,
  hydratePost,
  getPostRow,
  logActivity,
} from "../../lib/api-helpers";
import type { ContentType } from "../../utils/types";

const allPostsStmt = db.prepare(
  `SELECT * FROM posts ORDER BY created_at DESC`
);

export async function GET() {
  return withErrorHandling(async () => {
    const viewer = await getCurrentUser();
    const rows = allPostsStmt.all() as ReturnType<typeof getPostRow>[];
    const posts = rows.map((row) => hydratePost(row!, viewer?.id ?? null));
    return NextResponse.json({ posts });
  });
}

const VALID_TYPES: ContentType[] = ["post", "book", "course", "resource"];

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const user = await requireUser();

    const body = await request.json().catch(() => null);
    if (!body) return jsonError("Cuerpo de solicitud inválido", 400);

    const {
      type,
      title,
      body: postBody,
      tags,
      subject,
      isPremium,
      price,
    }: {
      type?: ContentType;
      title?: string;
      body?: string;
      tags?: string[];
      subject?: string;
      isPremium?: boolean;
      price?: number;
    } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return jsonError("Tipo de contenido inválido", 400);
    }
    if (!postBody?.trim()) {
      return jsonError("El contenido no puede estar vacío", 400);
    }
    if (type !== "post" && !title?.trim()) {
      return jsonError("El título es obligatorio para este tipo de contenido", 400);
    }

    const id = `p_${crypto.randomUUID()}`;

    db.prepare(
      `INSERT INTO posts (id, author_id, type, title, body, tags, is_premium, price, subject)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      user.id,
      type,
      type !== "post" ? title?.trim() ?? null : null,
      postBody.trim(),
      JSON.stringify(Array.isArray(tags) ? tags : []),
      isPremium ? 1 : 0,
      isPremium && price ? price : null,
      subject?.trim() || null
    );

    logActivity(
      user.id,
      "publish",
      `Publicó un nuevo contenido: "${(title || postBody).slice(0, 25)}..."`,
      "#20B2AA"
    );

    const row = getPostRow(id)!;
    const post = hydratePost(row, user.id);
    return NextResponse.json({ post }, { status: 201 });
  });
}
