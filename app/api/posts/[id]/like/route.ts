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
  ctx: RouteContext<"/api/posts/[id]/like">
) {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const { id } = await ctx.params;

    const post = getPostRow(id);
    if (!post) return jsonError("Publicación no encontrada", 404);

    const existing = db
      .prepare(`SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?`)
      .get(id, user.id);

    if (existing) {
      db.prepare(`DELETE FROM likes WHERE post_id = ? AND user_id = ?`).run(
        id,
        user.id
      );
    } else {
      db.prepare(`INSERT INTO likes (post_id, user_id) VALUES (?, ?)`).run(
        id,
        user.id
      );
      const author = db
        .prepare(`SELECT name FROM users WHERE id = ?`)
        .get(post.author_id) as { name: string } | undefined;
      logActivity(
        user.id,
        "like",
        `Le dio me gusta a la publicación de ${author?.name ?? "un autor"}`,
        "#FF6B6B"
      );
    }

    const updated = getPostRow(id)!;
    return NextResponse.json({ post: hydratePost(updated, user.id) });
  });
}
