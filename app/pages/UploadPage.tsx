import React, { useState } from "react";
import { ContentType } from "../utils/types";
import { Screen } from "../utils/types";
import { useApp } from "../context/AppContext";

interface Props {
  onNavigate: (s: Screen) => void;
}

const TYPE_OPTIONS: { id: ContentType; label: string; desc: string; accent: string; accentText: string }[] = [
  { id: "post", label: "PUBLICACIÓN", desc: "Comparte hilos, ideas o conocimientos rápidos", accent: "bg-emerald-50 border-emerald-200", accentText: "text-emerald-600" },
  { id: "course", label: "CURSO", desc: "Contenido estructurado de varios módulos", accent: "bg-violet-50 border-violet-200", accentText: "text-violet-600" },
  { id: "book", label: "EBOOK", desc: "Material escrito extenso en PDF o EPUB", accent: "bg-accent-blue/10 border-accent-blue/20", accentText: "text-accent-blue" },
  { id: "resource", label: "RECURSO", desc: "Apuntes, formularios, guías o código", accent: "bg-teal-50 border-teal-200", accentText: "text-teal-600" },
];

const SUBJECTS = [
  "Matemáticas", "Ciencia de la Computación", "Ciencia de Datos", "Estadística",
  "Física", "Química", "Biología", "Economía", "Historia", "Literatura",
];

export const UploadPage: React.FC<Props> = ({ onNavigate }) => {
  const { addPost } = useApp();
  const [type, setType] = useState<ContentType>("post");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const activeOption = TYPE_OPTIONS.find((t) => t.id === type)!;
  const accentTextClass = activeOption.accentText;

  const handlePublish = () => {
    // Convertir etiquetas separadas por coma a un array limpio
    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim().replace("#", ""))
      .filter((tag) => tag.length > 0);

    addPost({
      type,
      title: type !== "post" ? title.trim() : undefined,
      body: body.trim(),
      tags: parsedTags,
      subject: subject || undefined,
      isPremium,
      price: isPremium && price ? parseFloat(price) : undefined,
    });

    onNavigate("feed");
  };

  const isPost = type === "post";

  return (
    <div className="bg-dark-bg min-h-[100dvh] pb-24 pt-[env(safe-area-inset-top,0px)] px-4">
      
      {/* Cabecera */}
      <div className="flex items-center justify-between py-5 border-b border-dark-border/40 mb-4">
        <div>
          <h1 className="margin-0 text-xl font-extrabold text-text-light font-serif">
            {step === 1 ? "Crear Publicación" : "Detalles finales"}
          </h1>
          <p className="margin-0 text-[9px] text-text-dark font-mono font-bold tracking-widest uppercase mt-0.5">
            PASO {step} DE 2
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex gap-1.5">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300
                ${s === step ? `w-5 bg-accent-blue` : "w-1.5 bg-dark-border"}
              `}
            />
          ))}
        </div>
      </div>

      {/* Contenido por Paso */}
      <div className="flex flex-col gap-4">
        {step === 1 ? (
          <>
            {/* Selector de tipo de contenido */}
            <div>
              <span className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-2">TIPO DE CONTENIDO</span>
              <div className="flex flex-col gap-2">
                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`flex items-center gap-3.5 p-3.5 border rounded-xl cursor-pointer text-left transition-all duration-200
                      ${
                        type === t.id 
                          ? `${t.accent} border-dark-border` 
                          : "border-dark-border bg-dark-input hover:border-dark-border/60"
                      }
                    `}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${type === t.id ? `bg-accent-blue scale-110 shadow-md shadow-accent-blue/50` : "bg-text-dark"}`} />
                    <div className="min-w-0">
                      <div className={`text-[10px] font-extrabold font-mono tracking-wider ${type === t.id ? t.accentText : "text-text-muted"}`}>
                        {t.label}
                      </div>
                      <div className="text-[11px] text-text-dark font-sans mt-0.5 truncate leading-relaxed">
                        {t.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Título (para recursos, libros o cursos) */}
            {!isPost && (
              <div className="animate-fade-in">
                <span className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-2">TÍTULO DEL RECURSO</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === "course"
                      ? "ej. Álgebra Lineal: Desde Cero"
                      : type === "book"
                      ? "ej. Guía Práctica de Estructuras de Datos"
                      : "ej. Formulario de Derivadas e Integrales"
                  }
                  className="w-full bg-dark-input border border-dark-border rounded-xl p-3 text-xs text-text-light outline-none font-sans box-border placeholder-text-dark"
                />
              </div>
            )}

            {/* Cuerpo del post / Descripción */}
            <div>
              <span className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-2">
                {isPost ? "CONTENIDO DE LA PUBLICACIÓN" : "DESCRIPCIÓN DEL RECURSO"}
              </span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={
                  isPost
                    ? "Comparte tus conocimientos, apuntes rápidos, hilos académicos..."
                    : "Describe qué aprenderán los estudiantes o qué contiene este material..."
                }
                rows={isPost ? 6 : 4}
                className="w-full bg-dark-input border border-dark-border rounded-xl p-3 text-xs text-text-light outline-none font-sans box-border resize-none leading-relaxed placeholder-text-dark"
              />
            </div>

            {/* Siguiente paso */}
            <button
              onClick={() => setStep(2)}
              disabled={!body.trim() || (!isPost && !title.trim())}
              className={`w-full text-text-light font-bold font-mono text-xs py-3.5 rounded-xl cursor-pointer hover:opacity-95 shadow-md shadow-accent-blue/15 transition-all disabled:opacity-40
                ${
                  body.trim() && (isPost || title.trim())
                    ? "bg-accent-blue"
                    : "bg-dark-border text-text-dark"
                }
              `}
            >
              SIGUIENTE: DETALLES →
            </button>
          </>
        ) : (
          <>
            {/* Materias */}
            <div>
              <span className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-2.5">ÁREA DE ESTUDIO / MATERIA</span>
              <div className="flex flex-wrap gap-1.5">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s === subject ? "" : s)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold font-mono cursor-pointer border transition-all duration-150
                      ${
                        subject === s 
                          ? "bg-accent-blue border-transparent text-text-light"
                          : "border-dark-border text-text-dark hover:text-text-muted bg-dark-input"
                      }
                    `}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Etiquetas (Tags) */}
            <div>
              <span className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-2">ETIQUETAS (separadas por comas)</span>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ej. calculo, fisica, unam, apuntes"
                className="w-full bg-dark-input border border-dark-border rounded-xl p-3 text-xs text-text-light outline-none font-sans box-border placeholder-text-dark"
              />
            </div>

            {/* Monetización (Contenido Premium) */}
            <div className="bg-white border border-dark-border rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-extrabold font-mono text-text-light tracking-wide block">CONTENIDO PREMIUM</span>
                  <p className="text-[10px] text-text-dark font-sans mt-0.5 leading-snug">Cobrar a los usuarios para poder acceder a este archivo.</p>
                </div>
                
                {/* Switcher toggler */}
                <button
                  onClick={() => setIsPremium(!isPremium)}
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200
                    ${isPremium ? "bg-accent-blue" : "bg-dark-input border border-dark-border"}
                  `}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-all duration-200
                      ${isPremium ? "left-5.5" : "left-1"}
                    `}
                  />
                </button>
              </div>

              {isPremium && (
                <div className="animate-fade-in mt-1">
                  <span className="text-[8px] font-bold text-text-dark font-mono tracking-widest block mb-2">PRECIO DE VENTA (MXN)</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="ej. 149"
                    className="w-full bg-dark-input border border-dark-border rounded-lg px-3 py-2 text-xs text-text-light outline-none font-mono box-border placeholder-text-dark"
                  />
                </div>
              )}
            </div>

            {/* Subida de archivo adjunto simulado */}
            {!isPost && (
              <div className="border border-dashed border-accent-blue/30 rounded-xl p-5 text-center bg-accent-blue/5 animate-fade-in">
                <span className="text-[10px] font-bold text-accent-blue font-mono tracking-wider block mb-1">
                  📄 ADJUNTAR ARCHIVO ACADÉMICO
                </span>
                <span className="text-[10px] text-text-dark font-sans leading-relaxed block">
                  Formatos admitidos: PDF, EPUB, ZIP de hasta 50MB
                </span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-dark-border text-text-dark hover:text-text-muted hover:border-dark-border/60 bg-transparent font-bold font-mono text-xs py-3.5 rounded-xl cursor-pointer transition-colors"
              >
                ← VOLVER
              </button>
              <button
                onClick={handlePublish}
                className="flex-[2] bg-gradient-to-r from-accent-blue to-accent-blue-deep text-text-light font-bold font-mono text-xs py-3.5 rounded-xl cursor-pointer hover:opacity-95 shadow-lg shadow-accent-blue/15 transition-all"
              >
                PUBLICAR →
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};
