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

  return (
    <div className="min-h-[100dvh] bg-dark-bg flex flex-col px-6 pt-[env(safe-area-inset-top,32px)] pb-12 overflow-y-auto relative no-scrollbar">
      
      {/* Malla decorativa de fondo */}
      <div className="absolute top-0 left-0 right-0 h-[220px] bg-gradient-to-b from-accent-blue/5 to-transparent pointer-events-none z-0" />
      <div 
        className="absolute top-0 left-0 right-0 h-[200px] pointer-events-none opacity-5 z-0"
        style={{
          backgroundImage: "linear-gradient(#1e2620 1px, transparent 1px), linear-gradient(90deg, #1e2620 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 pt-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        
        {/* Logotipo de Scholar Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-deep grid grid-cols-2 gap-0.5 p-1.5 shadow-lg shadow-accent-blue/15">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/85 rounded-[3px]"
                />
              ))}
            </div>
            <span className="text-2xl font-black text-text-light font-serif tracking-tight">
              Scholar Grid
            </span>
          </div>
          <p className="margin-0 text-xs text-text-dark font-sans leading-relaxed">
            La plataforma de contenido académico para estudiantes y creadores universitarios.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-dark-input border border-dark-border rounded-xl p-1 mb-6">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg cursor-pointer font-mono text-[10px] font-bold tracking-wider transition-all duration-200
                ${
                  mode === m 
                    ? "bg-accent-blue text-text-light shadow-md shadow-accent-blue/10" 
                    : "text-text-dark hover:text-text-muted bg-transparent"
                }
              `}
            >
              {m === "login" ? "INICIAR SESIÓN" : "REGISTRARSE"}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <div className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div>
                <label className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-1.5">NOMBRE COMPLETO</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Valentina Cruz"
                  className="w-full bg-dark-input border border-dark-border rounded-xl px-4 py-3 text-xs text-text-light outline-none font-sans box-border placeholder-text-dark"
                />
              </div>
              
              <div>
                <label className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-1.5">UNIVERSIDAD</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="UNAM, IPN, TEC, etc."
                  className="w-full bg-dark-input border border-dark-border rounded-xl px-4 py-3 text-xs text-text-light outline-none font-sans box-border placeholder-text-dark"
                />
              </div>

              <div>
                <label className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-1.5">ROL EN LA PLATAFORMA</label>
                <div className="flex gap-2">
                  {(["student", "creator"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-xl border font-mono text-[10px] font-bold tracking-wider cursor-pointer transition-all duration-150
                        ${
                          role === r 
                            ? "border-accent-blue bg-accent-blue/10 text-accent-blue shadow-sm" 
                            : "border-dark-border bg-dark-input text-text-dark hover:text-text-muted"
                        }
                      `}
                    >
                      {r === "student" ? "ESTUDIANTE" : "CREADOR"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-1.5">CORREO ELECTRÓNICO</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@universidad.edu"
              className="w-full bg-dark-input border border-dark-border rounded-xl px-4 py-3 text-xs text-text-light outline-none font-sans box-border placeholder-text-dark"
            />
          </div>

          <div>
            <label className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-1.5">CONTRASEÑA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-dark-input border border-dark-border rounded-xl px-4 py-3 text-xs text-text-light outline-none font-sans box-border placeholder-text-dark"
            />
          </div>

          {mode === "login" && (
            <div className="text-right -mt-1.5">
              <button
                type="button"
                onClick={() => alert("Simulación de recuperación de contraseña enviada.")}
                className="bg-transparent border-none cursor-pointer text-[9px] text-accent-blue font-mono font-bold hover:underline p-0"
              >
                ¿OLVIDASTE TU CONTRASEÑA?
              </button>
            </div>
          )}

          {/* Botón Principal */}
          <button
            onClick={() => onLogin("feed")}
            className="w-full py-3.5 rounded-xl border-none cursor-pointer bg-gradient-to-r from-accent-blue to-accent-blue-deep text-text-light text-xs font-bold font-mono tracking-wider shadow-lg shadow-accent-blue/15 hover:opacity-95 mt-1.5"
          >
            {mode === "login" ? "INICIAR SESIÓN →" : "CREAR CUENTA →"}
          </button>

          {mode === "signup" && (
            <p className="text-center text-[9px] text-text-dark font-mono leading-relaxed mt-1">
              AL REGISTRARTE ACEPTAS NUESTROS{" "}
              <span className="text-accent-blue hover:underline cursor-pointer">TÉRMINOS DE SERVICIO</span> Y NUESTRAS{" "}
              <span className="text-accent-blue hover:underline cursor-pointer">POLÍTICAS DE PRIVACIDAD</span>
            </p>
          )}
        </div>

        {/* Separador de red social */}
        <div className="flex items-center gap-3.5 my-6">
          <div className="flex-1 h-[1px] bg-dark-border/60" />
          <span className="text-[8px] text-text-dark font-mono font-bold tracking-widest">
            O CONTINÚA CON
          </span>
          <div className="flex-1 h-[1px] bg-dark-border/60" />
        </div>

        {/* Proveedores OAuth */}
        <div className="flex gap-2.5">
          {["GOOGLE", "MICROSOFT"].map((provider) => (
            <button
              key={provider}
              onClick={() => onLogin("feed")}
              className="flex-1 py-2.5 rounded-xl border border-dark-border bg-dark-input text-text-muted hover:text-text-light hover:border-dark-border/60 text-[10px] font-bold font-mono tracking-wider cursor-pointer transition-all"
            >
              {provider}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
