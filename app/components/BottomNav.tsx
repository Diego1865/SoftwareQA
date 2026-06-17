import React from "react";
import { Screen } from "../utils/types";

interface Props {
  active: Screen;
  onNavigate: (s: Screen) => void;
}

const NAV_ITEMS: { id: Screen; label: string; icon: React.ReactNode }[] = [
  {
    id: "feed",
    label: "Inicio",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "todo",
    label: "Tareas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    id: "upload",
    label: "Publicar",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Perfil",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export const BottomNav: React.FC<Props> = ({ active, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[64px] bg-dark-bg/85 backdrop-blur-md border-t border-dark-border flex items-center justify-around z-50 pb-[env(safe-area-inset-bottom,0px)] px-4">
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        const isPost = item.id === "upload";
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 active:scale-90
              ${
                isPost
                  ? `h-11 w-11 rounded-full ${
                      isActive 
                        ? "bg-accent-blue-deep text-text-light shadow-lg shadow-accent-blue/40" 
                        : "bg-accent-blue text-text-light hover:bg-accent-blue/90 shadow-md shadow-accent-blue/20"
                    }`
                  : `px-3 py-1.5 rounded-xl ${
                      isActive 
                        ? "text-accent-blue" 
                        : "text-text-dark hover:text-text-muted"
                    }`
              }
            `}
          >
            <div className={`${isPost ? "scale-110" : ""}`}>
              {item.icon}
            </div>
            {!isPost && (
              <span className={`text-[9px] font-mono tracking-wider ${isActive ? "font-bold" : "font-normal"}`}>
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
