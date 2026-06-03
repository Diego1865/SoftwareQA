"use client";

import React, { useState } from "react";
import { Screen } from "../utils/types";
import { CURRENT_USER, MOCK_POSTS } from "../utils/data";

interface Props {
  onNavigate: (s: Screen) => void;
}

const TABS = [
  { id: "posts", label: "POSTS" },
  { id: "saved", label: "SAVED" },
  { id: "activity", label: "ACTIVITY" },
] as const;

type Tab = (typeof TABS)[number]["id"];

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  student: { bg: "#1c2e40", text: "#3094FF", border: "#3094FF33" },
  creator: { bg: "#251c2e", text: "#9B59B6", border: "#9B59B633" },
  moderator: { bg: "#1e2e1e", text: "#4CAF50", border: "#4CAF5033" },
};

const ACTIVITY_LOG = [
  { id: "a1", type: "like", text: "Liked Diego's Fourier Transform post", time: "2h ago", accent: "#FF6B6B" },
  { id: "a2", type: "save", text: "Saved Intro to Data Science course", time: "5h ago", accent: "#3094FF" },
  { id: "a3", type: "comment", text: "Commented on Algorithm Cheat Sheet", time: "1d ago", accent: "#4CAF50" },
  { id: "a4", type: "publish", text: "Published Algorithms Cheat Sheet resource", time: "1d ago", accent: "#20B2AA" },
  { id: "a5", type: "follow", text: "Started following Sofia Herrera", time: "3d ago", accent: "#7B68EE" },
  { id: "a6", type: "like", text: "Liked statistics resources post", time: "3d ago", accent: "#FF6B6B" },
];

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

const userPosts = MOCK_POSTS.filter((p) => p.author.id === CURRENT_USER.id);
const savedPosts = MOCK_POSTS.filter((p) => p.saved);

const StatCard: React.FC<{ value: string | number; label: string; accent?: string }> = ({
  value,
  label,
  accent = "#3094FF",
}) => (
  <div
    style={{
      flex: 1,
      background: "#161b17",
      border: "1px solid #1e2620",
      borderRadius: 10,
      padding: "12px 8px",
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontSize: 20,
        fontWeight: 800,
        color: accent,
        fontFamily: "monospace",
        letterSpacing: "-0.02em",
        lineHeight: 1,
        marginBottom: 4,
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 9, color: "#4a5a4e", fontFamily: "monospace", letterSpacing: "0.08em" }}>
      {label}
    </div>
  </div>
);

const MiniPostCard: React.FC<{ post: (typeof MOCK_POSTS)[0] }> = ({ post }) => {
  const TYPE_ACCENT: Record<string, string> = {
    post: "#4a7a55",
    book: "#3094FF",
    course: "#7B68EE",
    resource: "#20B2AA",
  };
  const TYPE_LABEL: Record<string, string> = {
    post: "POST",
    book: "EBOOK",
    course: "COURSE",
    resource: "RESOURCE",
  };
  const accent = TYPE_ACCENT[post.type];

  return (
    <div
      style={{
        background: "#161b17",
        border: `1px solid ${accent}22`,
        borderRadius: 10,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Type badge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: accent,
          color: "#fff",
          fontSize: 7,
          fontWeight: 800,
          letterSpacing: "0.12em",
          padding: "3px 8px",
          borderBottomLeftRadius: 7,
          fontFamily: "monospace",
        }}
      >
        {TYPE_LABEL[post.type]}
      </div>

      {post.title && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#e8ede9",
            fontFamily: "'DM Serif Display', serif",
            lineHeight: 1.3,
            paddingRight: 48,
          }}
        >
          {post.title}
        </div>
      )}
      <div
        style={{
          fontSize: 12,
          color: "#8fa893",
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {post.body}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 9, color: "#4a5a4e", fontFamily: "monospace" }}>
          ♥ {post.likes}
        </span>
        <span style={{ fontSize: 9, color: "#4a5a4e", fontFamily: "monospace" }}>
          ✦ {post.saves}
        </span>
        <span style={{ fontSize: 9, color: "#3a4a3e", fontFamily: "monospace", marginLeft: "auto" }}>
          {post.createdAt}
        </span>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [editBio, setEditBio] = useState(false);
  const [bio, setBio] = useState(CURRENT_USER.bio);
  const [tempBio, setTempBio] = useState(CURRENT_USER.bio);

  const rc = ROLE_COLORS[CURRENT_USER.role];

  return (
    <div
      style={{
        background: "#101411",
        minHeight: "100dvh",
        paddingBottom: 90,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Hero header */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient mesh */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #0527FC08 0%, #3094FF06 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#1e262014 1px, transparent 1px), linear-gradient(90deg, #1e262014 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 16px 0",
          }}
        >
          <button
            onClick={() => onNavigate("feed")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#4a5a4e",
              padding: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            <span style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.08em" }}>
              BACK
            </span>
          </button>

          <button
            onClick={() => {
              setEditBio(!editBio);
              if (editBio) setBio(tempBio);
            }}
            style={{
              background: editBio ? "linear-gradient(135deg, #3094FF, #0527FC)" : "#161b17",
              border: editBio ? "none" : "1px solid #1e2620",
              borderRadius: 7,
              padding: "7px 14px",
              cursor: "pointer",
              color: editBio ? "#fff" : "#8fa893",
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              transition: "all 0.15s ease",
            }}
          >
            {editBio ? "SAVE" : "EDIT"}
          </button>
        </div>

        {/* Avatar + identity */}
        <div
          style={{
            position: "relative",
            padding: "20px 16px 24px",
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          {/* Large avatar */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #3094FF44, #0527FC44)",
              border: "2px solid #3094FF44",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              color: "#3094FF",
              fontFamily: "monospace",
              flexShrink: 0,
              boxShadow: "0 8px 32px #3094FF18",
            }}
          >
            {CURRENT_USER.avatar}
          </div>

          <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#e8ede9",
                  fontFamily: "'DM Serif Display', serif",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {CURRENT_USER.name}
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#4a5a4e", fontFamily: "monospace" }}>
                @{CURRENT_USER.username}
              </span>
              <span style={{ color: "#1e2620", fontSize: 10 }}>·</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: rc.text,
                  background: rc.bg,
                  border: `1px solid ${rc.border}`,
                  padding: "2px 7px",
                  borderRadius: 4,
                  fontFamily: "monospace",
                  letterSpacing: "0.06em",
                }}
              >
                {CURRENT_USER.role.toUpperCase()}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                color: "#4a5a4e",
                fontFamily: "monospace",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              {CURRENT_USER.university}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ padding: "0 16px 16px" }}>
          {editBio ? (
            <textarea
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
              rows={3}
              autoFocus
              style={{
                width: "100%",
                background: "#161b17",
                border: "1px solid #3094FF44",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 13,
                color: "#c8d8ca",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
                lineHeight: 1.55,
              }}
            />
          ) : (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#8fa893",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.6,
              }}
            >
              {bio}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div style={{ padding: "0 16px 20px", display: "flex", gap: 8 }}>
          <StatCard value={CURRENT_USER.followers} label="FOLLOWERS" accent="#3094FF" />
          <StatCard value={CURRENT_USER.following} label="FOLLOWING" accent="#7B68EE" />
          <StatCard value={userPosts.length} label="POSTS" accent="#20B2AA" />
          <StatCard value={savedPosts.length} label="SAVED" accent="#FFD700" />
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1a1e1b", margin: "0 16px" }} />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #1a1e1b",
          position: "sticky",
          top: 0,
          background: "#101411",
          zIndex: 10,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${activeTab === tab.id ? "#3094FF" : "transparent"}`,
              cursor: "pointer",
              color: activeTab === tab.id ? "#3094FF" : "#3a4a3e",
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* POSTS tab */}
        {activeTab === "posts" && (
          <>
            {userPosts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  paddingTop: 48,
                  color: "#2a3a2e",
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
              >
                NO POSTS YET
              </div>
            ) : (
              userPosts.map((post) => <MiniPostCard key={post.id} post={post} />)
            )}

            {/* CTA to create post */}
            <button
              onClick={() => onNavigate("upload")}
              style={{
                width: "100%",
                padding: "13px 0",
                borderRadius: 10,
                border: "1.5px dashed #1e2620",
                cursor: "pointer",
                background: "transparent",
                color: "#3a4a3e",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.08em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              CREATE NEW POST
            </button>
          </>
        )}

        {/* SAVED tab */}
        {activeTab === "saved" && (
          <>
            {savedPosts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  paddingTop: 48,
                  color: "#2a3a2e",
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
              >
                NO SAVED CONTENT YET
              </div>
            ) : (
              savedPosts.map((post) => <MiniPostCard key={post.id} post={post} />)
            )}
          </>
        )}

        {/* ACTIVITY tab */}
        {activeTab === "activity" && (
          <div
            style={{
              background: "#161b17",
              border: "1px solid #1e2620",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {ACTIVITY_LOG.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderBottom: i < ACTIVITY_LOG.length - 1 ? "1px solid #1a1e1b" : "none",
                }}
              >
                {/* Icon bubble */}
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: `${item.accent}18`,
                    border: `1px solid ${item.accent}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.accent,
                    flexShrink: 0,
                  }}
                >
                  {ACTIVITY_ICONS[item.type]}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#c8d8ca",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.text}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#3a4a3e",
                      fontFamily: "monospace",
                      marginTop: 2,
                    }}
                  >
                    {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings section at bottom */}
      <div style={{ padding: "4px 16px 0" }}>
        <div style={{ height: 1, background: "#1a1e1b", marginBottom: 16 }} />
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#2a3a2e", fontFamily: "monospace", letterSpacing: "0.1em" }}>
            ACCOUNT
          </span>
        </div>

        {[
          {
            label: "Notifications",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            ),
          },
          {
            label: "Privacy & Security",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            ),
          },
          {
            label: "Payment & Earnings",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            ),
          },
          {
            label: "Help & Support",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ),
          },
        ].map((item) => (
          <button
            key={item.label}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #1a1e1b",
              padding: "13px 0",
              cursor: "pointer",
              color: "#8fa893",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#4a5a4e" }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                {item.label}
              </span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a3a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}

        {/* Sign out */}
        <button
          onClick={() => onNavigate("feed")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: "none",
            padding: "14px 0",
            cursor: "pointer",
            color: "#FF6B6B",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
};