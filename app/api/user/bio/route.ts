import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { requireUser } from "../../../lib/auth";
import { withErrorHandling, jsonError } from "../../../lib/api-helpers";

export async function PATCH(request: NextRequest) {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const body = await request.json().catch(() => null);
    const bio: string | undefined = body?.bio;

    if (typeof bio !== "string") {
      return jsonError("El campo 'bio' es obligatorio", 400);
    }

    db.prepare(`UPDATE users SET bio = ? WHERE id = ?`).run(
      bio.trim(),
      user.id
    );

    return NextResponse.json({ user: { ...user, bio: bio.trim() } });
  });
}
