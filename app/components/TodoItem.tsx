import React from "react";
import { Todo } from "../utils/types";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const LABEL_COLORS: Record<string, { bg: string; text: string }> = {
  study: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-accent-blue" },
  assignment: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400" },
  exam: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400" },
  personal: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400" },
  project: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400" },
};

const LABEL_SPANISH: Record<string, string> = {
  study: "ESTUDIO",
  assignment: "TAREA",
  exam: "EXAMEN",
  personal: "PERSONAL",
  project: "PROYECTO",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-red-500 shadow-md shadow-red-500/30",
  medium: "bg-amber-400 shadow-md shadow-amber-400/30",
  low: "bg-text-dark",
};

export const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete }) => {
  const lc = LABEL_COLORS[todo.label];

  return (
    <div
      className={`flex items-start gap-3.5 py-3.5 border-b border-dark-border/40 transition-all duration-300
        ${todo.done ? "opacity-40" : "opacity-100"}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all duration-150 flex-shrink-0 mt-0.5
          ${
            todo.done 
              ? "bg-accent-blue border-transparent text-text-light scale-105" 
              : "border-text-dark hover:border-text-muted bg-transparent"
          }
        `}
      >
        {todo.done && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[todo.priority]}`} />
          <span
            className={`text-xs text-text-light font-sans font-medium leading-relaxed block truncate
              ${todo.done ? "line-through text-text-dark" : ""}
            `}
          >
            {todo.text}
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <span className={`text-[8px] font-bold px-2 py-0.5 rounded border font-mono tracking-wider ${lc.bg} ${lc.text}`}>
            {LABEL_SPANISH[todo.label]}
          </span>
          {todo.dueDate && (
            <span
              className={`text-[8px] font-mono tracking-wide font-bold
                ${todo.dueDate.toLowerCase() === "today" || todo.dueDate.toLowerCase() === "hoy" 
                  ? "text-red-400" 
                  : "text-text-dark"
                }
              `}
            >
              VENCE: {todo.dueDate.toUpperCase() === "TODAY" ? "HOY" : todo.dueDate.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        className="text-text-dark hover:text-red-400 p-1 rounded transition-colors cursor-pointer flex-shrink-0 mt-0.5"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};
