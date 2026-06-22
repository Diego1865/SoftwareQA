import React, { useState, useMemo } from "react";
import { ContentType, Screen } from "../utils/types";
import { PostCard } from "../components/PostCard";
import { useApp } from "../context/AppContext";

interface Props {
  onNavigate: (s: Screen) => void;
}

const FILTERS: { id: ContentType | "all"; label: string }[] = [
  { id: "all", label: "TODAS" },
  { id: "post", label: "PUBLICACIONES" },
  { id: "course", label: "CURSOS" },
  { id: "book", label: "EBOOKS" },
  { id: "resource", label: "RECURSOS" },
];

const SUBJECTS = ["Todas las Materias", "Matemáticas", "Ciencia de la Computación", "Ciencia de Datos", "Estadística", "Física"];

export const FeedPage: React.FC<Props> = ({ onNavigate }) => {
  const { posts, currentUser } = useApp();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ContentType | "all">("all");
  const [activeSubject, setActiveSubject] = useState("Todas las Materias");
  const [showSubjects, setShowSubjects] = useState(false);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      // Ocultar publicaciones reportadas
      if (p.reported) return false;

      const matchesType = activeFilter === "all" || p.type === activeFilter;
      const matchesSubject = activeSubject === "Todas las Materias" || p.subject === activeSubject;
      const matchesSearch =
        !search ||
        p.body.toLowerCase().includes(search.toLowerCase()) ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        p.author.name.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSubject && matchesSearch;
    });
  }, [posts, search, activeFilter, activeSubject]);

  return (
    <div className="bg-dark-bg min-h-[100dvh] pb-24 pt-[env(safe-area-inset-top,0px)]">
      
      {/* Cabecera pegajosa */}
      <div className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur-md border-b border-dark-border/40">
        
        {/* Barra superior */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-blue to-accent-blue-deep grid grid-cols-2 gap-0.5 p-1 shadow-md shadow-accent-blue/15">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="bg-white/90 rounded-[2px]" />
              ))}
            </div>
            <span className="text-[18px] font-black text-text-light font-serif tracking-tight">
              Scholar Grid
            </span>
          </div>

          {/* Avatar del usuario — clicable para ir al perfil */}
          <button
            onClick={() => onNavigate("profile")}
            className="w-8 h-8 rounded-full bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center text-xs font-bold font-mono text-accent-blue cursor-pointer transition-transform active:scale-95 p-0"
          >
            {currentUser?.avatar}
          </button>
        </div>

        {/* Buscador */}
        <div className="px-4 pb-2.5">
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dark"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar publicaciones, creadores, materias..."
              className="w-full bg-dark-input border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-text-light outline-none font-sans placeholder-text-dark box-border"
            />
          </div>
        </div>

        {/* Filtro por tipo de contenido (Scroll horizontal suave) */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar px-3 py-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 text-[9px] font-extrabold font-mono tracking-wider cursor-pointer border-b-2 transition-all
                ${
                  activeFilter === f.id 
                    ? "border-accent-blue text-accent-blue" 
                    : "border-transparent text-text-dark hover:text-text-muted"
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filtro de materias */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => setShowSubjects(!showSubjects)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-extrabold font-mono tracking-wider cursor-pointer transition-colors
              ${
                activeSubject !== "Todas las Materias"
                  ? "bg-accent-blue/10 border-accent-blue/30 text-accent-blue"
                  : "bg-dark-input border-dark-border text-text-dark hover:text-text-muted"
              }
            `}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {activeSubject === "Todas las Materias" ? "MATERIA" : activeSubject.toUpperCase()}
          </button>

          <span className="text-[9px] text-text-dark font-mono font-bold tracking-widest">
            {filtered.length} RESULTADO{filtered.length !== 1 ? "S" : ""}
          </span>
        </div>

        {/* Dropdown de selección de materia */}
        {showSubjects && (
          <div className="mx-4 mb-3 bg-white border border-dark-border rounded-xl overflow-hidden shadow-xl animate-scale-in">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setActiveSubject(s);
                  setShowSubjects(false);
                }}
                className={`w-full text-left px-4 py-3 border-b border-dark-border/40 last:border-b-0 cursor-pointer text-xs font-sans transition-colors
                  ${
                    activeSubject === s 
                      ? "bg-accent-blue/10 text-accent-blue font-bold" 
                      : "bg-transparent text-text-muted hover:bg-dark-input/50"
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Listado de publicaciones */}
      <div className="p-4 flex flex-col gap-3.5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-xs text-text-dark font-mono tracking-widest leading-relaxed">
            NO SE ENCONTRARON RESULTADOS<br />INTENTA CON OTRA BÚSQUEDA
          </div>
        ) : (
          filtered.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

    </div>
  );
};
