import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { withErrorHandling } from "../../../lib/api-helpers";

export async function GET() {
  return withErrorHandling(async () => {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({ user });
  });
}
