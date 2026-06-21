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
  ctx: RouteContext<"/api/posts/[id]/save">
) {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const { id } = await ctx.params;

    const post = getPostRow(id);
    if (!post) return jsonError("Publicación no encontrada", 404);

    const existing = db
      .prepare(`SELECT 1 FROM saves WHERE post_id = ? AND user_id = ?`)
      .get(id, user.id);

    const label = post.title || post.body.slice(0, 25);

    if (existing) {
      db.prepare(`DELETE FROM saves WHERE post_id = ? AND user_id = ?`).run(
        id,
        user.id
      );
      db.prepare(
        `UPDATE posts SET saves = MAX(0, saves - 1) WHERE id = ?`
      ).run(id);
      logActivity(
        user.id,
        "save",
        `Quitó de guardados: "${label}..."`,
        "#3094FF"
      );
    } else {
      db.prepare(`INSERT INTO saves (post_id, user_id) VALUES (?, ?)`).run(
        id,
        user.id
      );
      db.prepare(`UPDATE posts SET saves = saves + 1 WHERE id = ?`).run(id);
      logActivity(
        user.id,
        "save",
        `Guardó la publicación: "${label}..."`,
        "#3094FF"
      );
    }

    const updated = getPostRow(id)!;
    return NextResponse.json({ post: hydratePost(updated, user.id) });
  });
}
