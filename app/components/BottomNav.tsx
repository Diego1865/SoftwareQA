import React from "react";
import { Screen } from "../utils/types";

interface Props {
  active: Screen;
  onNavigate: (s: Screen) => void;
}

const NAV_ITEMS: { id: Screen; label: string; icon: React.ReactNode }[] = [
  {
    id: "feed",
    label: "Feed",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "todo",
    label: "Tasks",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    id: "upload",
    label: "Post",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export const BottomNav: React.FC<Props> = ({ active, onNavigate }) => {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: "#0e1210",
        borderTop: "1px solid #1e2620",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 100,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        const isPost = item.id === "upload";
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              background: isPost
                ? isActive
                  ? "#0527FC"
                  : "#3094FF"
                : "transparent",
              border: "none",
              cursor: "pointer",
              padding: isPost ? "8px 16px" : "6px 12px",
              borderRadius: isPost ? 28 : 8,
              color: isActive ? (isPost ? "#fff" : "#3094FF") : "#4a5a4e",
              transition: "all 0.15s ease",
              minWidth: 48,
            }}
          >
            {item.icon}
            {!isPost && (
              <span style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.08em", fontWeight: isActive ? 700 : 400 }}>
                {item.label.toUpperCase()}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
