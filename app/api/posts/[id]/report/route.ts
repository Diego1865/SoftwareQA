import { NextRequest, NextResponse } from "next/server";
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
  ctx: RouteContext<"/api/posts/[id]/report">
) {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const { id } = await ctx.params;

    const post = getPostRow(id);
    if (!post) return jsonError("Publicación no encontrada", 404);

    const body = await request.json().catch(() => ({}));
    const reason: string = body?.reason?.trim() || "Sin especificar";

    db.prepare(
      `UPDATE posts SET reported = 1, report_reason = ? WHERE id = ?`
    ).run(reason, id);

    const author = db
      .prepare(`SELECT name FROM users WHERE id = ?`)
      .get(post.author_id) as { name: string } | undefined;
    logActivity(
      user.id,
      "comment",
      `Reportó la publicación de ${author?.name ?? "un autor"} por: "${reason}" (DMCA)`,
      "#FF6B6B"
    );

    const updated = getPostRow(id)!;
    return NextResponse.json({ post: hydratePost(updated, user.id) });
  });
}
