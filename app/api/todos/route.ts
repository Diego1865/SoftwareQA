import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { withErrorHandling, jsonError } from "../../lib/api-helpers";
import type { Todo } from "../../utils/types";

interface TodoRow {
  id: string;
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

const VALID_LABELS: Todo["label"][] = [
  "study",
  "assignment",
  "exam",
  "personal",
  "project",
];
const VALID_PRIORITIES: Todo["priority"][] = ["low", "medium", "high"];

export async function GET() {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const rows = db
      .prepare(
        `SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC`
      )
      .all(user.id) as TodoRow[];
    return NextResponse.json({ todos: rows.map(rowToTodo) });
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const user = await requireUser();
    const body = await request.json().catch(() => null);
    if (!body) return jsonError("Cuerpo de solicitud inválido", 400);

    const {
      text,
      label,
      priority,
      dueDate,
    }: {
      text?: string;
      label?: Todo["label"];
      priority?: Todo["priority"];
      dueDate?: string;
    } = body;

    if (!text?.trim()) return jsonError("El texto es obligatorio", 400);
    if (!label || !VALID_LABELS.includes(label)) {
      return jsonError("Etiqueta inválida", 400);
    }
    if (!priority || !VALID_PRIORITIES.includes(priority)) {
      return jsonError("Prioridad inválida", 400);
    }

    const id = `t_${crypto.randomUUID()}`;
    db.prepare(
      `INSERT INTO todos (id, user_id, text, label, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, user.id, text.trim(), label, priority, dueDate?.trim() || null);

    const row = db.prepare(`SELECT * FROM todos WHERE id = ?`).get(id) as TodoRow;
    return NextResponse.json({ todo: rowToTodo(row) }, { status: 201 });
  });
}
