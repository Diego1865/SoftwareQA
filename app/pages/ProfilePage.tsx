"use client";

import React, { useState } from "react";
import { Screen } from "../utils/types";
import { useApp } from "../context/AppContext";

interface Props {
  onNavigate: (s: Screen) => void;
}

const TABS = [
  { id: "posts", label: "PUBLICACIONES" },
  { id: "saved", label: "GUARDADOS" },
  { id: "activity", label: "ACTIVIDAD" },
] as const;

type Tab = (typeof TABS)[number]["id"];

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  student: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-accent-blue", border: "border-accent-blue/30" },
  creator: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
  moderator: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
};

const ROLE_SPANISH: Record<string, string> = {
  student: "ESTUDIANTE",
  creator: "CREADOR",
  moderator: "MODERADOR",
};

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  like: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  save: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  ),
  comment: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  publish: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12l7-7 7 7" />
    </svg>
  ),
  follow: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  ),
};

const StatCard: React.FC<{ value: string | number; label: string; accentClass: string }> = ({
  value,
  label,
  accentClass,
}) => (
  <div className="flex-1 bg-dark-card border border-dark-border rounded-xl py-3 px-2 text-center shadow-sm">
    <div className={`text-xl font-extrabold font-mono tracking-tight leading-none mb-1.5 ${accentClass}`}>
      {value}
    </div>
    <div className="text-[8px] text-text-dark font-mono font-bold tracking-widest leading-none">
      {label}
    </div>
  </div>
);

const MiniPostCard: React.FC<{ post: any }> = ({ post }) => {
  const TYPE_ACCENT_TEXT: Record<string, string> = {
    post: "text-emerald-400",
    book: "text-accent-blue",
    course: "text-purple-400",
    resource: "text-teal-400",
  };
  const TYPE_LABEL: Record<string, string> = {
    post: "PUBLICACIÓN",
    book: "EBOOK",
    course: "CURSO",
    resource: "RECURSO",
  };
  const accentText = TYPE_ACCENT_TEXT[post.type];

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-3.5 flex flex-col gap-2 relative overflow-hidden transition-all duration-200 hover:border-dark-border/60">
      
      {/* Badge de tipo de contenido */}
      <div className={`absolute top-0 right-0 text-[7px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-bl-lg text-text-light bg-dark-border/50 border-l border-b border-dark-border/30`}>
        {TYPE_LABEL[post.type]}
      </div>

      {post.title && (
        <div className="text-xs font-bold text-text-light font-serif leading-snug pr-12 truncate">
          {post.title}
        </div>
      )}
      <div className="text-xs text-text-muted leading-relaxed font-sans line-clamp-2">
        {post.body}
      </div>

      <div className="flex gap-3.5 items-center mt-1">
        <span className="text-[9px] text-text-dark font-mono font-semibold">
          ♥ {post.likes}
        </span>
        <span className="text-[9px] text-text-dark font-mono font-semibold">
          ✦ {post.saves}
        </span>
        <span className="text-[8px] text-text-dark font-mono ml-auto">
          {post.createdAt}
        </span>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC<Props> = ({ onNavigate }) => {
  const { currentUser, posts, activityLog, updateBio, logoutUser } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [editBio, setEditBio] = useState(false);
  const [tempBio, setTempBio] = useState(currentUser?.bio ?? "");

  // ProfilePage is only ever rendered once app/page.tsx has confirmed a
  // logged-in user, so this should never actually trigger — it's just here
  // so TypeScript (and any future caller) can't render this with no user.
  if (!currentUser) return null;

  const rc = ROLE_COLORS[currentUser.role] || ROLE_COLORS.student;

  const userPosts = posts.filter((p) => p.author.id === currentUser.id && !p.reported);
  const savedPosts = posts.filter((p) => p.saved && !p.reported);

  const handleSaveBio = () => {
    updateBio(tempBio);
    setEditBio(false);
  };

  return (
    <div className="bg-dark-bg min-h-[100dvh] pb-24 pt-[env(safe-area-inset-top,0px)]">
      
      {/* Cabecera del Perfil (Hero) */}
      <div className="relative overflow-hidden px-4">
        {/* Fondo con malla decorativa */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-transparent pointer-events-none" />
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: "linear-gradient(#1e2620 1px, transparent 1px), linear-gradient(90deg, #1e2620 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Fila superior de controles */}
        <div className="relative flex items-center justify-between pt-5">
          <button
            onClick={() => onNavigate("feed")}
            className="bg-transparent border-none cursor-pointer text-text-dark hover:text-text-muted p-1 flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            <span className="text-[9px] font-mono font-bold tracking-widest">INICIO</span>
          </button>

          <button
            onClick={() => {
              if (editBio) {
                handleSaveBio();
              } else {
                setTempBio(currentUser.bio);
                setEditBio(true);
              }
            }}
            className={`rounded-lg px-4 py-1.5 cursor-pointer text-[10px] font-bold font-mono tracking-wider transition-all duration-200 border
              ${
                editBio 
                  ? "bg-accent-blue border-transparent text-text-light shadow-md shadow-accent-blue/20" 
                  : "bg-dark-card border-dark-border text-text-muted hover:text-text-light hover:border-dark-border/80"
              }
            `}
          >
            {editBio ? "GUARDAR" : "EDITAR BIO"}
          </button>
        </div>

        {/* Identidad del usuario */}
        <div className="relative pt-6 pb-4 flex gap-4.5 items-start">
          <div className="w-[68px] h-[68px] rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-blue-deep/20 border-2 border-accent-blue/30 flex items-center justify-center text-xl font-black font-mono text-accent-blue flex-shrink-0 shadow-lg shadow-accent-blue/5">
            {currentUser.avatar}
          </div>

          <div className="min-w-0 pt-0.5">
            <h1 className="margin-0 text-lg font-extrabold text-text-light font-serif tracking-tight truncate leading-none mb-1.5">
              {currentUser.name}
            </h1>

            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] text-text-dark font-mono">
                @{currentUser.username}
              </span>
              <span className="text-dark-border text-[8px] font-mono font-bold">·</span>
              <span className={`text-[8px] font-extrabold font-mono tracking-wider px-2 py-0.5 rounded border ${rc.bg} ${rc.text} ${rc.border}`}>
                {ROLE_SPANISH[currentUser.role]}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-text-dark font-mono">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span>{currentUser.university}</span>
            </div>
          </div>
        </div>

        {/* Biografía */}
        <div className="pb-5">
          {editBio ? (
            <textarea
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
              rows={3}
              autoFocus
              className="w-full bg-dark-input border border-accent-blue/30 rounded-xl p-3 text-xs text-text-light outline-none resize-none leading-relaxed font-sans box-border"
            />
          ) : (
            <p className="margin-0 text-xs text-text-muted leading-relaxed font-sans">
              {currentUser.bio}
            </p>
          )}
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="flex gap-2 pb-5">
          <StatCard value={currentUser.followers} label="SEGUIDORES" accentClass="text-accent-blue" />
          <StatCard value={currentUser.following} label="SEGUIDOS" accentClass="text-purple-400" />
          <StatCard value={userPosts.length} label="PUBLICACIONES" accentClass="text-teal-400" />
          <StatCard value={savedPosts.length} label="GUARDADOS" accentClass="text-amber-400" />
        </div>

        {/* Divisor */}
        <div className="h-[1px] bg-dark-border/40" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-border/40 sticky top-0 bg-dark-bg/95 backdrop-blur-md z-10 px-2 mt-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-center text-[9px] font-extrabold font-mono tracking-widest cursor-pointer border-b-2 transition-all duration-150
              ${
                activeTab === tab.id 
                  ? "border-accent-blue text-accent-blue" 
                  : "border-transparent text-text-dark hover:text-text-muted"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="p-4 flex flex-col gap-3">
        
        {/* PUBLICACIONES pestaña */}
        {activeTab === "posts" && (
          <>
            {userPosts.length === 0 ? (
              <div className="text-center py-10 text-xs text-text-dark font-mono tracking-widest">
                NO TIENES PUBLICACIONES AÚN
              </div>
            ) : (
              userPosts.map((post) => <MiniPostCard key={post.id} post={post} />)
            )}

            {/* CTA para crear un nuevo post */}
            <button
              onClick={() => onNavigate("upload")}
              className="w-full py-3.5 rounded-xl border border-dashed border-dark-border/80 hover:border-dark-border bg-transparent text-text-dark hover:text-text-muted font-bold font-mono text-[10px] tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors mt-2"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              CREAR NUEVO CONTENIDO
            </button>
          </>
        )}

        {/* GUARDADOS pestaña */}
        {activeTab === "saved" && (
          <>
            {savedPosts.length === 0 ? (
              <div className="text-center py-10 text-xs text-text-dark font-mono tracking-widest">
                SIN CONTENIDO GUARDADO AÚN
              </div>
            ) : (
              savedPosts.map((post) => <MiniPostCard key={post.id} post={post} />)
            )}
          </>
        )}

        {/* ACTIVIDAD pestaña */}
        {activeTab === "activity" && (
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-sm">
            {activityLog.length === 0 ? (
              <div className="text-center py-10 text-xs text-text-dark font-mono tracking-widest">
                SIN ACTIVIDAD RECIENTE
              </div>
            ) : (
              activityLog.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3.5 border-dark-border/40
                    ${i < activityLog.length - 1 ? "border-b" : ""}
                  `}
                >
                  {/* Icono de actividad */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border"
                    style={{
                      backgroundColor: `${item.accent}12`,
                      borderColor: `${item.accent}25`,
                      color: item.accent,
                    }}
                  >
                    {ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.like}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-text-muted font-sans leading-relaxed">
                      {item.text}
                    </div>
                    <div className="text-[8px] text-text-dark font-mono mt-0.5 font-bold">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Sección inferior de configuración */}
      <div className="px-4 mt-2">
        <div className="h-[1px] bg-dark-border/40 mb-5" />
        <div className="mb-2">
          <span className="text-[8px] font-bold text-text-dark font-mono tracking-widest block uppercase">
            Ajustes de cuenta
          </span>
        </div>

        {[
          {
            label: "Notificaciones",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            ),
          },
          {
            label: "Privacidad y Seguridad",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            ),
          },
          {
            label: "Pagos e Ingresos",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            ),
          },
          {
            label: "Ayuda y Soporte",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ),
          },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => alert(`Ajuste simulado: ${item.label}`)}
            className="w-full flex items-center justify-between bg-transparent border-b border-dark-border/40 py-3 cursor-pointer text-text-muted hover:text-text-light transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-text-dark">{item.icon}</span>
              <span className="text-xs font-sans font-medium">{item.label}</span>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2a3a2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}

        {/* Cerrar Sesión */}
        <button
          onClick={logoutUser}
          className="w-full flex items-center gap-3 bg-transparent border-none py-4 cursor-pointer text-red-400 hover:text-red-300 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-xs font-sans font-semibold">Cerrar Sesión</span>
        </button>
      </div>

    </div>
  );
};
