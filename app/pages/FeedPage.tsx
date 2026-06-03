import React, { useState, useMemo } from "react";
import { Post, ContentType, Screen } from "../utils/types";
import { PostCard } from "../components/PostCard";
import { MOCK_POSTS, CURRENT_USER } from "../utils/data";

interface Props {
  onNavigate: (s: Screen) => void;
}

const FILTERS: { id: ContentType | "all"; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "post", label: "POSTS" },
  { id: "course", label: "COURSES" },
  { id: "book", label: "EBOOKS" },
  { id: "resource", label: "RESOURCES" },
];

const SUBJECTS = ["All Subjects", "Mathematics", "Computer Science", "Data Science", "Statistics", "Physics"];

export const FeedPage: React.FC<Props> = ({ onNavigate }) => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ContentType | "all">("all");
  const [activeSubject, setActiveSubject] = useState("All Subjects");
  const [showSubjects, setShowSubjects] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_POSTS.filter((p) => {
      const matchesType = activeFilter === "all" || p.type === activeFilter;
      const matchesSubject = activeSubject === "All Subjects" || p.subject === activeSubject;
      const matchesSearch =
        !search ||
        p.body.toLowerCase().includes(search.toLowerCase()) ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        p.author.name.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSubject && matchesSearch;
    });
  }, [search, activeFilter, activeSubject]);

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
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#101411",
          borderBottom: "1px solid #1a1e1b",
          paddingBottom: 0,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px 10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "linear-gradient(135deg, #3094FF, #0527FC)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2.5,
                padding: 6,
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.9)", borderRadius: 1.5 }} />
              ))}
            </div>
            <span
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#e8ede9",
                fontFamily: "'DM Serif Display', serif",
                letterSpacing: "-0.02em",
              }}
            >
              Scholar Grid
            </span>
          </div>

          {/* Avatar — tap to go to profile */}
          <button
            onClick={() => onNavigate("profile")}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3094FF33, #3094FF66)",
              border: "1.5px solid #3094FF55",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#3094FF",
              fontFamily: "monospace",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {CURRENT_USER.avatar}
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "0 16px 10px" }}>
          <div style={{ position: "relative" }}>
            <svg
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3a4a3e"
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
              placeholder="Search posts, creators, subjects..."
              style={{
                width: "100%",
                background: "#161b17",
                border: "1px solid #1e2620",
                borderRadius: 9,
                padding: "10px 12px 10px 34px",
                fontSize: 13,
                color: "#c8d8ca",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Type filter tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            overflowX: "auto",
            padding: "0 16px",
            scrollbarWidth: "none",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                flexShrink: 0,
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${activeFilter === f.id ? "#3094FF" : "transparent"}`,
                cursor: "pointer",
                color: activeFilter === f.id ? "#3094FF" : "#3a4a3e",
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.08em",
                transition: "all 0.15s ease",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Subject filter row */}
        <div style={{ padding: "8px 16px 10px", display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setShowSubjects(!showSubjects)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: activeSubject !== "All Subjects" ? "#3094FF18" : "#161b17",
              border: `1px solid ${activeSubject !== "All Subjects" ? "#3094FF44" : "#1e2620"}`,
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
              color: activeSubject !== "All Subjects" ? "#3094FF" : "#4a5a4e",
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: "0.06em",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {activeSubject === "All Subjects" ? "SUBJECT" : activeSubject.toUpperCase()}
          </button>

          <span style={{ fontSize: 10, color: "#2a3a2e", fontFamily: "monospace" }}>
            {filtered.length} RESULT{filtered.length !== 1 ? "S" : ""}
          </span>
        </div>

        {/* Subject dropdown */}
        {showSubjects && (
          <div
            style={{
              margin: "0 16px 10px",
              background: "#161b17",
              border: "1px solid #1e2620",
              borderRadius: 9,
              overflow: "hidden",
            }}
          >
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setActiveSubject(s);
                  setShowSubjects(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: activeSubject === s ? "#3094FF12" : "transparent",
                  border: "none",
                  borderBottom: "1px solid #1a1e1b",
                  padding: "10px 14px",
                  cursor: "pointer",
                  color: activeSubject === s ? "#3094FF" : "#8fa893",
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feed */}
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              paddingTop: 60,
              color: "#2a3a2e",
              fontFamily: "monospace",
              fontSize: 12,
            }}
          >
            NO RESULTS FOUND
          </div>
        ) : (
          filtered.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};