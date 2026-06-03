import React from "react";
import { Todo } from "../utils/types";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const LABEL_COLORS: Record<string, { bg: string; text: string }> = {
  study: { bg: "#1c2e40", text: "#3094FF" },
  assignment: { bg: "#2e1c1c", text: "#FF6B6B" },
  exam: { bg: "#2e2a1c", text: "#FFD700" },
  personal: { bg: "#1e2e1e", text: "#4CAF50" },
  project: { bg: "#251c2e", text: "#9B59B6" },
};

const PRIORITY_DOT: Record<string, string> = {
  high: "#FF6B6B",
  medium: "#FFD700",
  low: "#4a5a4e",
};

export const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete }) => {
  const lc = LABEL_COLORS[todo.label];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid #1a1e1b",
        opacity: todo.done ? 0.45 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          border: todo.done ? "none" : "1.5px solid #3a4a3e",
          background: todo.done ? "#3094FF" : "transparent",
          cursor: "pointer",
          flexShrink: 0,
          marginTop: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        {todo.done && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: PRIORITY_DOT[todo.priority],
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 13,
              color: "#c8d8ca",
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: todo.done ? "line-through" : "none",
              lineHeight: 1.4,
            }}
          >
            {todo.text}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: lc.text,
              background: lc.bg,
              padding: "2px 7px",
              borderRadius: 4,
              fontFamily: "monospace",
              letterSpacing: "0.06em",
            }}
          >
            {todo.label.toUpperCase()}
          </span>
          {todo.dueDate && (
            <span
              style={{
                fontSize: 9,
                color: todo.dueDate === "Today" ? "#FF6B6B" : "#4a5a4e",
                fontFamily: "monospace",
              }}
            >
              DUE {todo.dueDate.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#2a3a2e",
          padding: 2,
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};
