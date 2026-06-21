import { NextResponse } from "next/server";
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
  request: Request,
  ctx: RouteContext<"/api/posts/[id]/purchase">
) {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const { id } = await ctx.params;

    const post = getPostRow(id);
    if (!post) return jsonError("Publicación no encontrada", 404);
    if (!post.is_premium) {
      return jsonError("Esta publicación no es premium", 400);
    }

    const existing = db
      .prepare(`SELECT 1 FROM purchases WHERE post_id = ? AND user_id = ?`)
      .get(id, user.id);

    if (!existing) {
      // No real payment processing here — this is a school project. We just
      // record that the user "owns" the resource now.
      db.prepare(
        `INSERT INTO purchases (post_id, user_id) VALUES (?, ?)`
      ).run(id, user.id);

      logActivity(
        user.id,
        "save",
        `Adquirió con éxito el recurso Premium: "${post.title ?? ""}"`,
        "#FFD700"
      );
    }

    const updated = getPostRow(id)!;
    return NextResponse.json({ post: hydratePost(updated, user.id) });
  });
}
