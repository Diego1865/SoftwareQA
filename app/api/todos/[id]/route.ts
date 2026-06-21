import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { requireUser } from "../../../lib/auth";
import { withErrorHandling, jsonError } from "../../../lib/api-helpers";
import type { Todo } from "../../../utils/types";

interface TodoRow {
  id: string;
  user_id: string;
  text: string;
  done: number;
  label: Todo["label"];
  due_date: string | null;
  priority: Todo["priority"];
}

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    text: row.text,
    done: !!row.done,
    label: row.label,
    dueDate: row.due_date ?? undefined,
    priority: row.priority,
  };
}

/** Toggles the `done` flag. The frontend's toggleTodoItem only flips state,
 * so PATCH here doesn't take a body — it just inverts whatever's stored. */
export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/todos/[id]">
) {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const { id } = await ctx.params;

    const row = db
      .prepare(`SELECT * FROM todos WHERE id = ?`)
      .get(id) as TodoRow | undefined;

    if (!row) return jsonError("Tarea no encontrada", 404);
    if (row.user_id !== user.id) {
      return jsonError("No autorizado para modificar esta tarea", 403);
    }

    db.prepare(`UPDATE todos SET done = NOT done WHERE id = ?`).run(id);

    const updated = db
      .prepare(`SELECT * FROM todos WHERE id = ?`)
      .get(id) as TodoRow;
    return NextResponse.json({ todo: rowToTodo(updated) });
  });
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/todos/[id]">
) {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const { id } = await ctx.params;

    const row = db
      .prepare(`SELECT user_id FROM todos WHERE id = ?`)
      .get(id) as { user_id: string } | undefined;

    if (!row) return jsonError("Tarea no encontrada", 404);
    if (row.user_id !== user.id) {
      return jsonError("No autorizado para eliminar esta tarea", 403);
    }

    db.prepare(`DELETE FROM todos WHERE id = ?`).run(id);
    return NextResponse.json({ ok: true });
  });
}
