import React, { useState } from "react";
import { Post } from "../utils/types";
import { useApp } from "../context/AppContext";

interface Props {
  post: Post;
}

const TYPE_COLORS: Record<string, string> = {
  post: "bg-dark-card border-emerald-500/10",
  book: "bg-blue-950/40 border-blue-500/10",
  course: "bg-violet-950/40 border-violet-500/10",
  resource: "bg-teal-950/40 border-teal-500/10",
};

const TYPE_ACCENT_TEXT: Record<string, string> = {
  post: "text-emerald-400",
  book: "text-accent-blue",
  course: "text-violet-400",
  resource: "text-teal-400",
};

const TYPE_ACCENT_BG: Record<string, string> = {
  post: "bg-emerald-500/10 border-emerald-500/20",
  book: "bg-accent-blue/10 border-accent-blue/20",
  course: "bg-violet-500/10 border-violet-500/20",
  resource: "bg-teal-500/10 border-teal-500/20",
};

const TYPE_LABEL: Record<string, string> = {
  post: "PUBLICACIÓN",
  book: "EBOOK",
  course: "CURSO",
  resource: "RECURSO",
};

export const PostCard: React.FC<Props> = ({ post }) => {
  const { toggleLike, toggleSave, addComment, purchasePost, reportPost, currentUser } = useApp();
  
  // Estados locales para interactividad
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const [showPayModal, setShowPayModal] = useState(false);
  const [payStatus, setPayStatus] = useState<"idle" | "loading" | "success">("idle");
  
  const [showReportMenu, setShowReportMenu] = useState(false);
  
  const accentText = TYPE_ACCENT_TEXT[post.type];
  const accentBg = TYPE_ACCENT_BG[post.type];
  const isAuthor = post.author.id === currentUser.id;

  // Si fue reportado por derechos de autor, se muestra una advertencia de moderación
  if (post.reported) {
    return (
      <article className="bg-dark-card/50 border border-red-500/20 rounded-xl p-4 text-center">
        <svg className="w-8 h-8 text-red-500/60 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-xs font-mono text-red-400 font-bold tracking-wider">CONTENIDO BAJO MODERACIÓN</span>
        <p className="text-xs text-text-muted mt-1 leading-relaxed">
          Esta publicación ha sido reportada por infracción de propiedad intelectual (DMCA) y está bajo revisión comunitaria.
        </p>
      </article>
    );
  }

  // Simular el pago de PayPal
  const handlePayPalPayment = () => {
    setPayStatus("loading");
    setTimeout(() => {
      setPayStatus("success");
      setTimeout(() => {
        purchasePost(post.id);
        setShowPayModal(false);
        setPayStatus("idle");
      }, 1000);
    }, 1500);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText("");
  };

  return (
    <article className={`border rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden transition-all duration-200 hover:border-dark-border ${TYPE_COLORS[post.type]}`}>
      
      {/* Badge de tipo de contenido */}
      <div className={`absolute top-0 right-0 text-[8px] font-mono font-extrabold tracking-widest px-2.5 py-1 rounded-bl-lg text-text-light ${isPremiumColor(post.type)}`}>
        {TYPE_LABEL[post.type]}
      </div>

      {/* Fila del autor */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${accentText} ${accentBg}`}>
            {post.author.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13px] font-bold text-text-light font-sans truncate block max-w-[120px]">
                {post.author.name}
              </span>
              <span className="text-[10px] text-text-dark font-mono">
                @{post.author.username}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-text-dark font-mono">
              <span className="truncate max-w-[100px]">{post.author.university}</span>
              <span>·</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Botón de reporte DMCA */}
        <div className="relative">
          <button 
            onClick={() => setShowReportMenu(!showReportMenu)}
            className="text-text-dark hover:text-text-muted p-1 rounded-lg hover:bg-dark-input/50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          
          {showReportMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-dark-card border border-dark-border rounded-lg shadow-xl z-30 py-1 overflow-hidden animate-fade-in">
              <div className="px-2.5 py-1 text-[8px] font-mono text-text-dark border-b border-dark-border tracking-wider font-bold">MODERACIÓN</div>
              <button
                onClick={() => {
                  reportPost(post.id, "Infracción DMCA / Derechos de Autor");
                  setShowReportMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-[11px] font-mono text-red-400 hover:bg-red-500/10 flex items-center gap-1.5"
              >
                ⚠️ Reportar DMCA
              </button>
              <button
                onClick={() => {
                  reportPost(post.id, "Spam o Publicidad");
                  setShowReportMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-[11px] font-mono text-text-muted hover:bg-dark-input flex items-center gap-1.5"
              >
                🚫 Spam
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Título de la publicación */}
      {post.title && (
        <h3 className="margin-0 text-sm font-bold text-text-light font-serif leading-snug">
          {post.title}
        </h3>
      )}

      {/* Cuerpo del contenido */}
      <p className="margin-0 text-xs text-text-muted leading-relaxed font-sans line-clamp-4">
        {post.body}
      </p>

      {/* Área temática + etiquetas */}
      <div className="flex flex-wrap gap-1.5 items-center mt-0.5">
        {post.subject && (
          <span className={`text-[8px] font-bold font-mono tracking-wider px-2 py-0.5 rounded border ${accentText} ${accentBg}`}>
            {post.subject.toUpperCase()}
          </span>
        )}
        {post.tags.map((tag) => (
          <span key={tag} className="text-[8px] text-text-dark bg-dark-input font-mono px-1.5 py-0.5 rounded border border-dark-border/40">
            #{tag}
          </span>
        ))}
      </div>

      {/* Sección de Monetización Premium con PayPal */}
      {post.isPremium && post.price && (
        <div className="bg-dark-bg/60 border border-yellow-500/10 rounded-lg p-2.5 flex items-center justify-between mt-1">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-yellow-500 font-bold tracking-wider">RECURSO PREMIUM</span>
            <span className="text-xs font-mono font-bold text-text-light mt-0.5">${post.price} MXN</span>
          </div>
          
          <div className="flex items-center gap-2">
            {post.purchased ? (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  ✓ ADQUIRIDO
                </span>
                <button 
                  onClick={() => alert(`Iniciando descarga simulada de: ${post.title}.pdf`)}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold font-mono px-2.5 py-1 rounded cursor-pointer transition-colors"
                >
                  DESCARGAR APUNTES
                </button>
              </div>
            ) : isAuthor ? (
              <span className="text-[9px] text-text-dark font-mono italic">Tu recurso premium</span>
            ) : (
              <button
                onClick={() => setShowPayModal(true)}
                className="bg-yellow-500 text-slate-950 font-extrabold font-mono text-[10px] px-3.5 py-1 rounded hover:bg-yellow-400 cursor-pointer transition-all shadow-md shadow-yellow-500/15"
              >
                OBTENER
              </button>
            )}
          </div>
        </div>
      )}

      {/* Fila de acciones (Likes, Comentarios, Guardado) */}
      <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-dark-border/60">
        <div className="flex gap-4">
          
          {/* Like button */}
          <button
            onClick={() => toggleLike(post.id)}
            className={`flex items-center gap-1 text-[11px] font-mono cursor-pointer transition-colors ${post.liked ? "text-red-400 font-bold" : "text-text-dark hover:text-text-muted"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={post.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span>{post.likes}</span>
          </button>

          {/* Comment button */}
          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-1 text-[11px] font-mono text-text-dark hover:text-text-muted cursor-pointer transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span>{post.comments}</span>
          </button>
        </div>

        {/* Save button */}
        <button
          onClick={() => toggleSave(post.id)}
          className={`flex items-center gap-1 text-[11px] font-mono cursor-pointer transition-colors ${post.saved ? "text-accent-blue font-bold" : "text-text-dark hover:text-text-muted"}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={post.saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          <span>{post.saves}</span>
        </button>
      </div>

      {/* ======================================= */}
      {/* CAJÓN DE COMENTARIOS INFERIOR (Drawer) */}
      {/* ======================================= */}
      {showComments && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end">
          {/* Overlay click para cerrar */}
          <div className="flex-1" onClick={() => setShowComments(false)} />
          
          {/* Contenido del Cajón */}
          <div className="bg-dark-card border-t border-dark-border rounded-t-2xl max-h-[70vh] flex flex-col p-4 animate-slide-up pb-[env(safe-area-inset-bottom,16px)]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-dark-border">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-text-light font-serif">Comentarios</span>
                <span className="text-xs text-text-dark font-mono">({post.commentsList?.length || 0})</span>
              </div>
              <button 
                onClick={() => setShowComments(false)}
                className="text-text-dark hover:text-text-light font-mono text-xs p-1"
              >
                CERRAR
              </button>
            </div>

            {/* Listado de Comentarios */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pr-1 mb-3">
              {!post.commentsList || post.commentsList.length === 0 ? (
                <div className="text-center py-8 text-xs text-text-dark font-mono">
                  SIN COMENTARIOS AÚN. ¡SÉ EL PRIMERO EN OPINAR!
                </div>
              ) : (
                post.commentsList.map((c) => (
                  <div key={c.id} className="bg-dark-input border border-dark-border/50 rounded-xl p-2.5 flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-[10px] font-bold font-mono text-accent-blue flex-shrink-0">
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-[11px] font-bold text-text-light">{c.authorName}</span>
                        <span className="text-[8px] text-text-dark font-mono">{c.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed font-sans">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Formulario para comentar */}
            <form onSubmit={handleSendComment} className="flex gap-2 items-center">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe tu comentario..."
                className="flex-1 bg-dark-input border border-dark-border rounded-lg px-3 py-2 text-xs text-text-light outline-none placeholder-text-dark font-sans"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="bg-accent-blue text-text-light font-bold font-mono text-[11px] px-4 py-2 rounded-lg cursor-pointer transition-opacity disabled:opacity-40"
              >
                PUBLICAR
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL SIMULADO DE PAYPAL                */}
      {/* ======================================= */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in">
            {/* Cabecera PayPal */}
            <div className="bg-[#003087] p-4 text-center relative flex items-center justify-center">
              <span className="text-xl font-black italic tracking-tight text-white flex items-baseline">
                Pay<span className="text-[#0079C1]">Pal</span>
              </span>
              <button 
                onClick={() => setShowPayModal(false)}
                className="absolute right-4 text-white/60 hover:text-white font-mono text-xs"
              >
                Cancelar
              </button>
            </div>

            {/* Contenido Modal */}
            <div className="p-5 flex flex-col items-center">
              
              {payStatus === "idle" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-500 mb-4">
                    🛒
                  </div>
                  <h4 className="text-sm font-bold text-text-light text-center mb-1 font-serif">Confirmar Pago de Recurso</h4>
                  <p className="text-xs text-text-muted text-center max-w-[240px] leading-relaxed mb-4">
                    Estás adquiriendo <span className="font-bold text-text-light">"{post.title}"</span> de {post.author.name}.
                  </p>

                  {/* Facturación */}
                  <div className="w-full bg-dark-input border border-dark-border rounded-lg p-3 flex flex-col gap-1.5 mb-5 font-mono text-xs text-text-muted">
                    <div className="flex justify-between">
                      <span>Concepto:</span>
                      <span className="text-text-light font-bold">Recurso Académico</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Método:</span>
                      <span className="text-yellow-500 font-bold">PayPal Balance</span>
                    </div>
                    <div className="h-[1px] bg-dark-border my-1" />
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-text-light">Total a pagar:</span>
                      <span className="font-bold text-yellow-500">${post.price} MXN</span>
                    </div>
                  </div>

                  {/* Botón de Pago PayPal */}
                  <button
                    onClick={handlePayPalPayment}
                    className="w-full bg-[#FFC439] hover:bg-[#F2B21A] text-slate-900 font-black font-mono text-xs py-3 rounded-xl cursor-pointer transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-1.5"
                  >
                    <span>Pagar con</span>
                    <span className="italic font-black text-blue-900">PayPal</span>
                  </button>
                </>
              )}

              {payStatus === "loading" && (
                <div className="py-10 flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-[#0079C1] border-t-transparent rounded-full animate-spin mb-4" />
                  <span className="text-xs font-mono text-text-muted tracking-wide animate-pulse">PROCESANDO TRANSACCIÓN...</span>
                </div>
              )}

              {payStatus === "success" && (
                <div className="py-8 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 animate-scale-in">
                    ✓
                  </div>
                  <h4 className="text-sm font-bold text-text-light text-center mb-1 font-serif">¡Pago Exitoso!</h4>
                  <p className="text-xs text-emerald-400 font-mono text-center">Recurso desbloqueado con éxito.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </article>
  );
};

// Función auxiliar para determinar badge
function isPremiumColor(type: string): string {
  switch (type) {
    case "post": return "bg-emerald-500 text-white";
    case "book": return "bg-accent-blue text-white";
    case "course": return "bg-violet-600 text-white";
    case "resource": return "bg-teal-600 text-white";
    default: return "bg-accent-blue text-white";
  }
}
