import React, { useState } from "react";
import { Todo } from "../utils/types";
import { TodoItem } from "../components/TodoItem";
import { MOCK_TODOS } from "../utils/data";

const LABELS: Todo["label"][] = ["study", "assignment", "exam", "personal", "project"];
const PRIORITIES: Todo["priority"][] = ["high", "medium", "low"];

const LABEL_COLORS: Record<string, string> = {
  study: "#3094FF",
  assignment: "#FF6B6B",
  exam: "#FFD700",
  personal: "#4CAF50",
  project: "#9B59B6",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "HIGH",
  medium: "MED",
  low: "LOW",
};

export const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);
  const [activeLabel, setActiveLabel] = useState<Todo["label"] | "all">("all");
  const [showAdd, setShowAdd] = useState(false);

  // New item state
  const [newText, setNewText] = useState("");
  const [newLabel, setNewLabel] = useState<Todo["label"]>("study");
  const [newPriority, setNewPriority] = useState<Todo["priority"]>("medium");
  const [newDue, setNewDue] = useState("");

  const toggle = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const addTodo = () => {
    if (!newText.trim()) return;
    const todo: Todo = {
      id: `t${Date.now()}`,
      text: newText.trim(),
      done: false,
      label: newLabel,
      priority: newPriority,
      dueDate: newDue || undefined,
    };
    setTodos((prev) => [todo, ...prev]);
    setNewText("");
    setNewDue("");
    setShowAdd(false);
  };

  const filtered = activeLabel === "all" ? todos : todos.filter((t) => t.label === activeLabel);
  const pending = todos.filter((t) => !t.done).length;
  const done = todos.filter((t) => t.done).length;

  return (
    <div
      style={{
        background: "#101411",
        minHeight: "100dvh",
        paddingBottom: 80,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{
                margin: "0 0 2px",
                fontSize: 24,
                fontWeight: 800,
                color: "#e8ede9",
                fontFamily: "'DM Serif Display', serif",
                letterSpacing: "-0.02em",
              }}
            >
              My Tasks
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: "#4a5a4e", fontFamily: "monospace" }}>
              {pending} PENDING · {done} COMPLETED
            </p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            style={{
              background: showAdd ? "#232925" : "linear-gradient(135deg, #3094FF, #0527FC)",
              border: "none",
              borderRadius: 10,
              width: 40,
              height: 40,
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: showAdd ? "none" : "0 4px 16px #3094FF30",
              transition: "all 0.15s ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: showAdd ? "rotate(45deg)" : "none",
                transition: "transform 0.2s ease",
              }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div
          style={{
            margin: "16px 0 0",
            height: 4,
            background: "#1e2620",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${todos.length ? (done / todos.length) * 100 : 0}%`,
              background: "linear-gradient(90deg, #3094FF, #0527FC)",
              borderRadius: 99,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 4,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 9, color: "#3a4a3e", fontFamily: "monospace" }}>
            {todos.length ? Math.round((done / todos.length) * 100) : 0}% DONE
          </span>
        </div>
      </div>

      {/* Add task panel */}
      {showAdd && (
        <div
          style={{
            margin: "0 16px 16px",
            background: "#161b17",
            border: "1px solid #1e2620",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="What needs to be done?"
            rows={2}
            style={{
              background: "#0e1210",
              border: "1px solid #1e2620",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 13,
              color: "#c8d8ca",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              resize: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#4a5a4e", fontFamily: "monospace", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>
                LABEL
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {LABELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setNewLabel(l)}
                    style={{
                      padding: "4px 9px",
                      borderRadius: 5,
                      border: `1px solid ${newLabel === l ? LABEL_COLORS[l] + "66" : "#1e2620"}`,
                      background: newLabel === l ? LABEL_COLORS[l] + "18" : "transparent",
                      color: newLabel === l ? LABEL_COLORS[l] : "#3a4a3e",
                      fontSize: 9,
                      fontWeight: 700,
                      fontFamily: "monospace",
                      cursor: "pointer",
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#4a5a4e", fontFamily: "monospace", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>
                PRIORITY
              </span>
              <div style={{ display: "flex", gap: 5 }}>
                {PRIORITIES.map((p) => {
                  const colors: Record<string, string> = { high: "#FF6B6B", medium: "#FFD700", low: "#4a5a4e" };
                  return (
                    <button
                      key={p}
                      onClick={() => setNewPriority(p)}
                      style={{
                        flex: 1,
                        padding: "5px 0",
                        borderRadius: 5,
                        border: `1px solid ${newPriority === p ? colors[p] + "66" : "#1e2620"}`,
                        background: newPriority === p ? colors[p] + "18" : "transparent",
                        color: newPriority === p ? colors[p] : "#3a4a3e",
                        fontSize: 9,
                        fontWeight: 700,
                        fontFamily: "monospace",
                        cursor: "pointer",
                      }}
                    >
                      {PRIORITY_LABELS[p]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#4a5a4e", fontFamily: "monospace", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>
                DUE DATE
              </span>
              <input
                type="text"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                placeholder="e.g. Jun 10"
                style={{
                  width: "100%",
                  background: "#0e1210",
                  border: "1px solid #1e2620",
                  borderRadius: 5,
                  padding: "5px 8px",
                  fontSize: 11,
                  color: "#c8d8ca",
                  fontFamily: "monospace",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            onClick={addTodo}
            style={{
              background: "linear-gradient(135deg, #3094FF, #0527FC)",
              border: "none",
              borderRadius: 8,
              padding: "11px 0",
              cursor: "pointer",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: "0.08em",
            }}
          >
            ADD TASK
          </button>
        </div>
      )}

      {/* Label filter */}
      <div
        style={{
          display: "flex",
          gap: 0,
          overflowX: "auto",
          padding: "0 16px 12px",
          scrollbarWidth: "none",
        }}
      >
        <button
          onClick={() => setActiveLabel("all")}
          style={{
            flexShrink: 0,
            padding: "6px 12px",
            background: "transparent",
            border: "none",
            borderBottom: `2px solid ${activeLabel === "all" ? "#3094FF" : "transparent"}`,
            cursor: "pointer",
            color: activeLabel === "all" ? "#3094FF" : "#3a4a3e",
            fontSize: 9,
            fontWeight: 700,
            fontFamily: "monospace",
            letterSpacing: "0.08em",
          }}
        >
          ALL
        </button>
        {LABELS.map((l) => (
          <button
            key={l}
            onClick={() => setActiveLabel(l)}
            style={{
              flexShrink: 0,
              padding: "6px 12px",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${activeLabel === l ? LABEL_COLORS[l] : "transparent"}`,
              cursor: "pointer",
              color: activeLabel === l ? LABEL_COLORS[l] : "#3a4a3e",
              fontSize: 9,
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: "0.08em",
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ padding: "0 16px" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              paddingTop: 40,
              color: "#2a3a2e",
              fontFamily: "monospace",
              fontSize: 11,
            }}
          >
            NO TASKS IN THIS CATEGORY
          </div>
        ) : (
          filtered.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggle} onDelete={remove} />
          ))
        )}
      </div>
    </div>
  );
};
