import { NextResponse } from "next/server";
import { db } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { withErrorHandling } from "../../lib/api-helpers";
import type { Activity } from "../../utils/types";

interface ActivityRow {
  id: string;
  type: Activity["type"];
  text: string;
  accent: string;
  created_at: string;
}

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso + "Z").getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "Ahora mismo";
  if (min < 60) return `Hace ${min}m`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Hace ${days}d`;
}

export async function GET() {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const rows = db
      .prepare(
        `SELECT id, type, text, accent, created_at FROM activity
         WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`
      )
      .all(user.id) as ActivityRow[];

    const activity: Activity[] = rows.map((r) => ({
      id: r.id,
      type: r.type,
      text: r.text,
      time: relativeTime(r.created_at),
      accent: r.accent,
    }));

    return NextResponse.json({ activity });
  });
}
