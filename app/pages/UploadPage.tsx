import React, { useState } from "react";
import { ContentType } from "../utils/types";
import { Screen } from "../utils/types";

interface Props {
  onNavigate: (s: Screen) => void;
}

const TYPE_OPTIONS: { id: ContentType; label: string; desc: string; accent: string }[] = [
  { id: "post", label: "POST", desc: "Share knowledge, threads, ideas", accent: "#4a7a55" },
  { id: "course", label: "COURSE", desc: "Structured multi-module content", accent: "#7B68EE" },
  { id: "book", label: "EBOOK", desc: "Long-form written material", accent: "#3094FF" },
  { id: "resource", label: "RESOURCE", desc: "Files, cheat sheets, references", accent: "#20B2AA" },
];

const SUBJECTS = [
  "Mathematics", "Computer Science", "Data Science", "Statistics",
  "Physics", "Chemistry", "Biology", "Economics", "History", "Literature",
];

export const UploadPage: React.FC<Props> = ({ onNavigate }) => {
  const [type, setType] = useState<ContentType>("post");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const accent = TYPE_OPTIONS.find((t) => t.id === type)?.accent ?? "#3094FF";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#161b17",
    border: "1px solid #1e2620",
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: 13,
    color: "#c8d8ca",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    color: "#4a5a4e",
    fontFamily: "monospace",
    letterSpacing: "0.1em",
    display: "block",
    marginBottom: 6,
  };

  const isPost = type === "post";

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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 16px 14px",
          borderBottom: "1px solid #1a1e1b",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 2px",
              fontSize: 20,
              fontWeight: 800,
              color: "#e8ede9",
              fontFamily: "'DM Serif Display', serif",
            }}
          >
            {step === 1 ? "Create Post" : "Details"}
          </h1>
          <p style={{ margin: 0, fontSize: 10, color: "#4a5a4e", fontFamily: "monospace" }}>
            STEP {step} OF 2
          </p>
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", gap: 5 }}>
          {[1, 2].map((s) => (
            <div
              key={s}
              style={{
                width: s <= step ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background: s <= step ? accent : "#1e2620",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {step === 1 ? (
          <>
            {/* Content type selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>CONTENT TYPE</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      background: type === t.id ? `${t.accent}10` : "#161b17",
                      border: `1px solid ${type === t.id ? t.accent + "44" : "#1e2620"}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: t.accent,
                        flexShrink: 0,
                        boxShadow: type === t.id ? `0 0 8px ${t.accent}80` : "none",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: type === t.id ? t.accent : "#8fa893",
                          fontFamily: "monospace",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {t.label}
                      </div>
                      <div style={{ fontSize: 11, color: "#4a5a4e", fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>
                        {t.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title (for non-post) */}
            {!isPost && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>TITLE</label>
                <input
                  style={inputStyle}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === "course"
                      ? "e.g. Intro to Machine Learning 2025"
                      : type === "book"
                      ? "e.g. Linear Algebra: Intuition First"
                      : "e.g. Algorithm Complexity Cheat Sheet"
                  }
                />
              </div>
            )}

            {/* Body */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>{isPost ? "CONTENT" : "DESCRIPTION"}</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={
                  isPost
                    ? "Share your knowledge, ideas, threads..."
                    : "Describe what learners will get from this..."
                }
                rows={isPost ? 6 : 4}
                style={{
                  ...inputStyle,
                  resize: "none",
                  lineHeight: 1.6,
                }}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!body.trim() && !title.trim()}
              style={{
                width: "100%",
                padding: "13px 0",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: body.trim() || title.trim()
                  ? `linear-gradient(135deg, ${accent}, ${accent}cc)`
                  : "#1e2620",
                color: body.trim() || title.trim() ? "#fff" : "#3a4a3e",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.08em",
                transition: "all 0.15s ease",
              }}
            >
              NEXT: DETAILS →
            </button>
          </>
        ) : (
          <>
            {/* Subject */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>SUBJECT AREA</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s === subject ? "" : s)}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 6,
                      border: `1px solid ${subject === s ? accent + "55" : "#1e2620"}`,
                      background: subject === s ? accent + "18" : "#161b17",
                      color: subject === s ? accent : "#4a5a4e",
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: "monospace",
                      cursor: "pointer",
                      transition: "all 0.12s ease",
                    }}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>TAGS (comma separated)</label>
              <input
                style={inputStyle}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. algorithms, cs, interview"
              />
            </div>

            {/* Monetization */}
            <div
              style={{
                background: "#161b17",
                border: "1px solid #1e2620",
                borderRadius: 10,
                padding: 14,
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isPremium ? 12 : 0 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#c8d8ca", fontFamily: "monospace", letterSpacing: "0.06em" }}>
                    PREMIUM CONTENT
                  </div>
                  <div style={{ fontSize: 11, color: "#4a5a4e", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                    Charge users to access this content
                  </div>
                </div>
                <button
                  onClick={() => setIsPremium(!isPremium)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    border: "none",
                    background: isPremium ? accent : "#1e2620",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      left: isPremium ? 23 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.2s ease",
                    }}
                  />
                </button>
              </div>

              {isPremium && (
                <div>
                  <label style={labelStyle}>PRICE (MXN)</label>
                  <input
                    style={inputStyle}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 149"
                  />
                </div>
              )}
            </div>

            {/* File upload area */}
            {!isPost && (
              <div
                style={{
                  border: `1.5px dashed ${accent}44`,
                  borderRadius: 10,
                  padding: "24px 16px",
                  textAlign: "center",
                  marginBottom: 16,
                  background: `${accent}06`,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: accent, fontFamily: "monospace", marginBottom: 4 }}>
                  ATTACH FILE
                </div>
                <div style={{ fontSize: 11, color: "#4a5a4e", fontFamily: "'DM Sans', sans-serif" }}>
                  PDF, EPUB, ZIP up to 50MB
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: "13px 0",
                  borderRadius: 10,
                  border: "1px solid #1e2620",
                  cursor: "pointer",
                  background: "transparent",
                  color: "#4a5a4e",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  letterSpacing: "0.08em",
                }}
              >
                ← BACK
              </button>
              <button
                onClick={() => onNavigate("feed")}
                style={{
                  flex: 2,
                  padding: "13px 0",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  letterSpacing: "0.08em",
                  boxShadow: `0 4px 16px ${accent}30`,
                }}
              >
                PUBLISH →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
