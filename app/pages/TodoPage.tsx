import React, { useState } from "react";
import { Todo } from "../utils/types";
import { TodoItem } from "../components/TodoItem";
import { useApp } from "../context/AppContext";

const LABELS: Todo["label"][] = ["study", "assignment", "exam", "personal", "project"];
const PRIORITIES: Todo["priority"][] = ["high", "medium", "low"];

const LABEL_COLORS: Record<string, string> = {
  study: "border-blue-200 bg-blue-50 text-accent-blue",
  assignment: "border-red-200 bg-red-50 text-red-600",
  exam: "border-amber-200 bg-amber-50 text-amber-600",
  personal: "border-emerald-200 bg-emerald-50 text-emerald-600",
  project: "border-purple-200 bg-purple-50 text-purple-600",
};

const LABEL_COLORS_RAW: Record<string, string> = {
  study: "#3094FF",
  assignment: "#FF6B6B",
  exam: "#FFD700",
  personal: "#4CAF50",
  project: "#9B59B6",
};

const LABEL_SPANISH: Record<string, string> = {
  study: "ESTUDIO",
  assignment: "TAREA",
  exam: "EXAMEN",
  personal: "PERSONAL",
  project: "PROYECTO",
};

const PRIORITY_LABELS_SPANISH: Record<string, string> = {
  high: "ALTA",
  medium: "MEDIA",
  low: "BAJA",
};

export const TodoPage: React.FC = () => {
  const { todos, addTodoItem, toggleTodoItem, deleteTodoItem } = useApp();
  const [activeLabel, setActiveLabel] = useState<Todo["label"] | "all">("all");
  const [showAdd, setShowAdd] = useState(false);

  // Estado del nuevo elemento
  const [newText, setNewText] = useState("");
  const [newLabel, setNewLabel] = useState<Todo["label"]>("study");
  const [newPriority, setNewPriority] = useState<Todo["priority"]>("medium");
  const [newDue, setNewDue] = useState("");

  const handleAddTask = () => {
    if (!newText.trim()) return;
    addTodoItem(newText.trim(), newLabel, newPriority, newDue);
    setNewText("");
    setNewDue("");
    setShowAdd(false);
  };

  const filtered = activeLabel === "all" ? todos : todos.filter((t) => t.label === activeLabel);
  const pending = todos.filter((t) => !t.done).length;
  const done = todos.filter((t) => t.done).length;

  return (
    <div className="bg-dark-bg min-h-[100dvh] pb-24 pt-[env(safe-area-inset-top,0px)] px-4">
      
      {/* Cabecera */}
      <div className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="margin-0 text-2xl font-extrabold text-text-light font-serif tracking-tight">
              Mis Tareas
            </h1>
            <p className="margin-0 text-[10px] text-text-dark font-mono mt-1 font-bold tracking-wider uppercase">
              {pending} PENDIENTES · {done} COMPLETADAS
            </p>
          </div>
          
          <button
            onClick={() => setShowAdd(!showAdd)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200
              ${
                showAdd 
                  ? "bg-dark-card text-text-light border border-dark-border" 
                  : "bg-accent-blue text-text-light hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/20"
              }
            `}
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
              className={`transition-transform duration-300 ${showAdd ? "rotate-45" : "none"}`}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4 h-1.5 bg-dark-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-blue to-accent-blue-deep rounded-full transition-all duration-500 ease-out"
            style={{ width: `${todos.length ? (done / todos.length) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 mb-4">
          <span className="text-[8px] text-text-dark font-mono font-bold tracking-widest">PROGRESO GENERAL</span>
          <span className="text-[9px] text-accent-blue font-mono font-bold">
            {todos.length ? Math.round((done / todos.length) * 100) : 0}% COMPLETADO
          </span>
        </div>
      </div>

      {/* Panel para agregar tarea */}
      {showAdd && (
        <div className="bg-white border border-dark-border rounded-2xl p-4 flex flex-col gap-3.5 mb-4 animate-scale-in">
          <div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="¿Qué hay que hacer?"
              rows={2}
              className="w-full bg-dark-input border border-dark-border rounded-xl p-3 text-xs text-text-light outline-none resize-none placeholder-text-dark font-sans box-border"
            />
          </div>

          {/* Selección de Categoría / Etiqueta */}
          <div>
            <span className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-2">ETIQUETA DE CATEGORÍA</span>
            <div className="flex flex-wrap gap-1.5">
              {LABELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setNewLabel(l)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-bold font-mono cursor-pointer border transition-all duration-150
                    ${
                      newLabel === l 
                        ? LABEL_COLORS[l]
                        : "border-dark-border text-text-dark bg-transparent hover:text-text-muted"
                    }
                  `}
                >
                  {LABEL_SPANISH[l]}
                </button>
              ))}
            </div>
          </div>

          {/* Selección de Prioridad y Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-2">PRIORIDAD</span>
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => {
                  const colorsRaw: Record<string, string> = { high: "text-red-500 bg-red-50 border-red-200", medium: "text-amber-500 bg-amber-50 border-amber-200", low: "text-slate-400 bg-transparent border-slate-300" };
                  const selectedColors: Record<string, string> = { high: "text-red-600 bg-red-50 border-red-300", medium: "text-amber-600 bg-amber-50 border-amber-300", low: "text-slate-600 bg-slate-100 border-slate-300" };
                  return (
                    <button
                      key={p}
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 py-1 rounded-lg text-[9px] font-bold font-mono cursor-pointer border transition-all duration-150
                        ${newPriority === p ? selectedColors[p] : colorsRaw[p]}
                      `}
                    >
                      {PRIORITY_LABELS_SPANISH[p]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-2">FECHA DE ENTREGA</span>
              <input
                type="text"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                placeholder="ej. Jun 10 o Hoy"
                className="w-full bg-dark-input border border-dark-border rounded-lg px-3 py-1.5 text-xs text-text-light outline-none font-mono box-border placeholder-text-dark"
              />
            </div>
          </div>

          {/* Botón Guardar Tarea */}
          <button
            onClick={handleAddTask}
            disabled={!newText.trim()}
            className="w-full bg-gradient-to-r from-accent-blue to-accent-blue-deep text-text-light font-bold font-mono text-xs py-3 rounded-xl cursor-pointer hover:opacity-95 shadow-md shadow-accent-blue/15 disabled:opacity-45 transition-opacity"
          >
            AÑADIR TAREA
          </button>
        </div>
      )}

      {/* Filtro de etiquetas */}
      <div className="flex gap-0 overflow-x-auto no-scrollbar border-b border-dark-border/40 mb-3 py-1">
        <button
          onClick={() => setActiveLabel("all")}
          className={`flex-shrink-0 px-4 py-1.5 text-[9px] font-extrabold font-mono tracking-wider cursor-pointer border-b-2 transition-colors
            ${activeLabel === "all" ? "border-accent-blue text-accent-blue" : "border-transparent text-text-dark hover:text-text-muted"}
          `}
        >
          TODAS
        </button>
        {LABELS.map((l) => (
          <button
            key={l}
            onClick={() => setActiveLabel(l)}
            className={`flex-shrink-0 px-4 py-1.5 text-[9px] font-extrabold font-mono tracking-wider cursor-pointer border-b-2 transition-colors
              ${activeLabel === l ? `text-[${LABEL_COLORS_RAW[l]}]` : "border-transparent text-text-dark hover:text-text-muted"}
            `}
            style={{ borderBottomColor: activeLabel === l ? LABEL_COLORS_RAW[l] : "transparent", color: activeLabel === l ? LABEL_COLORS_RAW[l] : undefined }}
          >
            {LABEL_SPANISH[l]}
          </button>
        ))}
      </div>

      {/* Listado de tareas */}
      <div className="flex flex-col">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-text-dark font-mono tracking-widest">
            SIN TAREAS EN ESTA CATEGORÍA
          </div>
        ) : (
          filtered.map((todo) => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggle={toggleTodoItem} 
              onDelete={deleteTodoItem} 
            />
          ))
        )}
      </div>

    </div>
  );
};
