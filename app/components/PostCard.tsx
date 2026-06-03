import React, { useState } from "react";
import { Post } from "../utils/types";

interface Props {
  post: Post;
}

const TYPE_COLORS: Record<string, string> = {
  post: "#232925",
  book: "#1a2340",
  course: "#1c1a40",
  resource: "#1a3030",
};

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

const Avatar: React.FC<{ initials: string; accent: string }> = ({ initials, accent }) => (
  <div
    style={{
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${accent}33, ${accent}66)`,
      border: `1.5px solid ${accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 700,
      color: accent,
      fontFamily: "monospace",
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

export const PostCard: React.FC<Props> = ({ post }) => {
  const [liked, setLiked] = useState(post.liked ?? false);
  const [saved, setSaved] = useState(post.saved ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const accent = TYPE_ACCENT[post.type];

  return (
    <article
      style={{
        background: TYPE_COLORS[post.type],
        border: `1px solid ${accent}22`,
        borderRadius: 12,
        padding: "14px 14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
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
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.12em",
          padding: "3px 8px",
          borderBottomLeftRadius: 8,
          fontFamily: "monospace",
        }}
      >
        {TYPE_LABEL[post.type]}
      </div>

      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <Avatar initials={post.author.avatar} accent={accent} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#e8ede9", fontFamily: "'DM Sans', sans-serif" }}>
              {post.author.name}
            </span>
            <span style={{ fontSize: 10, color: "#4a5a4e", fontFamily: "monospace" }}>
              @{post.author.username}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 9, color: "#4a5a4e", fontFamily: "monospace" }}>
              {post.author.university}
            </span>
            <span style={{ fontSize: 9, color: "#2a3a2e" }}>·</span>
            <span style={{ fontSize: 9, color: "#4a5a4e", fontFamily: "monospace" }}>
              {post.createdAt}
            </span>
          </div>
        </div>
      </div>

      {/* Title if present */}
      {post.title && (
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: "#e8ede9",
            fontFamily: "'DM Serif Display', serif",
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h3>
      )}

      {/* Body */}
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#8fa893",
          lineHeight: 1.55,
          fontFamily: "'DM Sans', sans-serif",
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {post.body}
      </p>

      {/* Subject + Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
        {post.subject && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: accent,
              background: `${accent}18`,
              border: `1px solid ${accent}33`,
              padding: "2px 7px",
              borderRadius: 4,
              fontFamily: "monospace",
              letterSpacing: "0.06em",
            }}
          >
            {post.subject.toUpperCase()}
          </span>
        )}
        {post.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 9,
              color: "#4a5a4e",
              background: "#161a17",
              padding: "2px 6px",
              borderRadius: 4,
              fontFamily: "monospace",
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Premium pricing */}
      {post.isPremium && post.price && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#0a0d0b",
            borderRadius: 8,
            padding: "8px 12px",
            border: `1px solid ${accent}33`,
          }}
        >
          <span style={{ fontSize: 11, color: "#8fa893", fontFamily: "monospace" }}>PREMIUM CONTENT</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#e8ede9", fontFamily: "monospace" }}>
              ${post.price} MXN
            </span>
            <button
              style={{
                background: accent,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "5px 12px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "monospace",
                letterSpacing: "0.04em",
              }}
            >
              GET
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 4,
          borderTop: "1px solid #1e2620",
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          {/* Like */}
          <button
            onClick={() => {
              setLiked(!liked);
              setLikeCount(liked ? likeCount - 1 : likeCount + 1);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: liked ? "#FF6B6B" : "#4a5a4e",
              padding: 0,
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span>{likeCount}</span>
          </button>

          {/* Comment */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#4a5a4e",
              padding: 0,
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span>{post.comments}</span>
          </button>
        </div>

        {/* Save */}
        <button
          onClick={() => setSaved(!saved)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: saved ? "#3094FF" : "#4a5a4e",
            padding: 0,
            fontSize: 12,
            fontFamily: "monospace",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          <span>{post.saves}</span>
        </button>
      </div>
    </article>
  );
};
