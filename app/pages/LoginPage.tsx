import React, { useState } from "react";
import { Screen } from "../utils/types";

interface Props {
  onLogin: (screen: Screen) => void;
}

export const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [role, setRole] = useState<"student" | "creator">("student");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#161b17",
    border: "1px solid #1e2620",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 14,
    color: "#c8d8ca",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    color: "#4a5a4e",
    fontFamily: "monospace",
    letterSpacing: "0.1em",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#101411",
        display: "flex",
        flexDirection: "column",
        padding: "0 24px",
        paddingTop: "env(safe-area-inset-top, 0px)",
        overflowY: "auto",
      }}
    >
      {/* Header grid accent */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 220,
          background:
            "linear-gradient(180deg, #0527FC08 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Grid lines decoration */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          backgroundImage:
            "linear-gradient(#1e262022 1px, transparent 1px), linear-gradient(90deg, #1e262022 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, paddingTop: 64 }}>
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "linear-gradient(135deg, #3094FF, #0527FC)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
                padding: 8,
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{ background: "rgba(255,255,255,0.85)", borderRadius: 2 }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#e8ede9",
                fontFamily: "'DM Serif Display', serif",
                letterSpacing: "-0.02em",
              }}
            >
              Scholar Grid
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#4a5a4e",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.5,
            }}
          >
            The academic content platform for students and creators.
          </p>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            background: "#161b17",
            borderRadius: 10,
            padding: 3,
            marginBottom: 28,
            border: "1px solid #1e2620",
          }}
        >
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                background: mode === m ? "#3094FF" : "transparent",
                color: mode === m ? "#fff" : "#4a5a4e",
                transition: "all 0.15s ease",
              }}
            >
              {m === "login" ? "SIGN IN" : "SIGN UP"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && (
            <>
              <div>
                <label style={labelStyle}>FULL NAME</label>
                <input
                  style={inputStyle}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Valentina Cruz"
                />
              </div>
              <div>
                <label style={labelStyle}>UNIVERSITY</label>
                <input
                  style={inputStyle}
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="UNAM, IPN, TEC..."
                />
              </div>
              <div>
                <label style={labelStyle}>ROLE</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["student", "creator"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 8,
                        border: `1px solid ${role === r ? "#3094FF" : "#1e2620"}`,
                        cursor: "pointer",
                        fontFamily: "monospace",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        background: role === r ? "#3094FF18" : "#161b17",
                        color: role === r ? "#3094FF" : "#4a5a4e",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>EMAIL</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
            />
          </div>

          <div>
            <label style={labelStyle}>PASSWORD</label>
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {mode === "login" && (
            <div style={{ textAlign: "right", marginTop: -8 }}>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  color: "#3094FF",
                  fontFamily: "monospace",
                  padding: 0,
                }}
              >
                FORGOT PASSWORD?
              </button>
            </div>
          )}

          <button
            onClick={() => onLogin("feed")}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #3094FF, #0527FC)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              marginTop: 4,
              boxShadow: "0 4px 20px #3094FF30",
              transition: "opacity 0.15s ease",
            }}
          >
            {mode === "login" ? "SIGN IN →" : "CREATE ACCOUNT →"}
          </button>

          {mode === "signup" && (
            <p
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "#3a4a3e",
                fontFamily: "monospace",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              BY SIGNING UP YOU AGREE TO OUR{" "}
              <span style={{ color: "#3094FF" }}>TERMS OF SERVICE</span> AND{" "}
              <span style={{ color: "#3094FF" }}>PRIVACY POLICY</span>
            </p>
          )}
        </div>

        {/* Social auth divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "28px 0 20px",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#1e2620" }} />
          <span style={{ fontSize: 9, color: "#2a3a2e", fontFamily: "monospace" }}>
            OR CONTINUE WITH
          </span>
          <div style={{ flex: 1, height: 1, background: "#1e2620" }} />
        </div>

        <div style={{ display: "flex", gap: 10, paddingBottom: 40 }}>
          {["GOOGLE", "MICROSOFT"].map((provider) => (
            <button
              key={provider}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 8,
                border: "1px solid #1e2620",
                background: "#161b17",
                color: "#8fa893",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.08em",
                cursor: "pointer",
              }}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
