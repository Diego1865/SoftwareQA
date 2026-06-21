import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "../../../../lib/db";
import { requireUser } from "../../../../lib/auth";
import {
  withErrorHandling,
  jsonError,
  hydratePost,
  getPostRow,
  logActivity,
} from "../../../../lib/api-helpers";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/posts/[id]/comments">
) {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const { id } = await ctx.params;

    const post = getPostRow(id);
    if (!post) return jsonError("Publicación no encontrada", 404);

    const body = await request.json().catch(() => null);
    const text: string | undefined = body?.text;
    if (!text?.trim()) {
      return jsonError("El comentario no puede estar vacío", 400);
    }

    const commentId = `c_${crypto.randomUUID()}`;
    db.prepare(
      `INSERT INTO comments (id, post_id, author_id, text) VALUES (?, ?, ?, ?)`
    ).run(commentId, id, user.id, text.trim());

    const author = db
      .prepare(`SELECT name FROM users WHERE id = ?`)
      .get(post.author_id) as { name: string } | undefined;
    logActivity(
      user.id,
      "comment",
      `Comentó en la publicación de ${author?.name ?? "un autor"}: "${text
        .trim()
        .slice(0, 20)}..."`,
      "#4CAF50"
    );

    const updated = getPostRow(id)!;
    return NextResponse.json(
      { post: hydratePost(updated, user.id) },
      { status: 201 }
    );
  });
}
