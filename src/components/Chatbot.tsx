import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  ChevronDown,
  Copy,
  Check,
  FileText,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "../i18n";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  sources?: Array<{ docTitle: string; page: number; snippet: string }>;
  timestamp: string;
}

const SUGGESTED_QUESTIONS_ES = [
  "¿Cuáles son los requisitos de matrícula?",
  "¿Cuáles son los derechos de los estudiantes?",
  "¿Cuáles son los deberes de los estudiantes?",
  "¿Cuál es la misión institucional?",
  "¿Cuál es la visión del colegio para el 2030?",
  "¿Qué establece el Manual sobre los uniformes?",
  "¿Cómo funciona el sistema de evaluación (SIEE)?",
  "¿Cuáles son las faltas tipo I, II y III?",
];

const SUGGESTED_QUESTIONS_EN = [
  "What are the enrollment requirements?",
  "What are the rights of students?",
  "What are the duties of students?",
  "What is the institutional mission?",
  "What is the school vision for 2030?",
  "What does the Manual say about uniforms?",
  "How does the evaluation system (SIEE) work?",
  "What are type I, II, and III infractions?",
];

export default function Chatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [unreadBadge, setUnreadBadge] = useState(true);

  const initialGreeting: ChatMessage = {
    id: "welcome-msg",
    sender: "bot",
    text:
      language === "EN"
        ? "👋 **Hello! I am the Institutional Assistant.**\n\nI can help you query official information strictly contained in the **Manual de Convivencia 2026-2027** and the **PEI 2026-2027**.\n\nYou can ask about regulations, rights, duties, enrollment, evaluation, institutional mission, and uniforms.\n\n*How may I assist you today?*"
        : "👋 **¡Hola! Soy el Asistente Institucional.**\n\nPuedo ayudarte a consultar información oficial contenida exclusivamente en el **Manual de Convivencia 2026-2027** y el **PEI 2026-2027**.\n\nPuedes preguntarme sobre normas de convivencia, derechos, deberes, admisiones y matrículas, evaluación, misión, visión y uniformes.\n\n*¿Qué deseas consultar?*",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadBadge(false);
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Build brief history format for backend
      const history = newMessages.slice(-6).map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.response || "No se obtuvo respuesta de los documentos institucionales.",
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Error communicating with chat API:", err);
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text:
          language === "EN"
            ? "⚠️ An error occurred while consulting institutional documents. Please verify your connection and try again."
            : "⚠️ Ocurrió un inconveniente al consultar los documentos institucionales. Por favor verifica tu conexión e intenta de nuevo.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...initialGreeting,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedQuestions = SUGGESTED_QUESTIONS_ES;

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start pointer-events-auto" id="institutional-chatbot-container">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative group"
            >
              {/* Unread Prompt Bubble */}
              {unreadBadge && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-full left-0 mb-3 w-56 p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#C9A961]/40 text-slate-800 text-xs pointer-events-none"
                >
                  <div className="flex items-start gap-2">
                    <span className="p-1 bg-[#1B3A6B]/10 text-[#1B3A6B] rounded-md shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A961]" />
                    </span>
                    <div>
                      <p className="font-bold text-[#1B3A6B] text-[11px] leading-tight">
                        Asistente Institucional
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        ¿Preguntas sobre el Manual o PEI?
                      </p>
                    </div>
                  </div>
                  {/* Speech bubble arrow */}
                  <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white rotate-45 border-r border-b border-[#C9A961]/40" />
                </motion.div>
              )}

              {/* Main Button */}
              <button
                onClick={() => setIsOpen(true)}
                id="chatbot-floating-button"
                className="relative p-3.5 md:p-4 bg-linear-to-tr from-[#0F2444] via-[#1B3A6B] to-[#254d8c] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-[#C9A961]/60 flex items-center justify-center group"
                aria-label="Abrir asistente institucional"
                title="Asistente Institucional (Manual y PEI)"
              >
                {/* Glowing ring */}
                <span className="absolute -inset-1 rounded-full bg-[#C9A961] opacity-30 blur-xs group-hover:opacity-60 transition duration-500 animate-pulse -z-10" />

                <div className="relative flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#C9A961] group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1B3A6B] rounded-full" />
                </div>

                {/* Hover label */}
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:pl-2.5 transition-all duration-300 font-sans text-xs font-semibold text-white tracking-wide whitespace-nowrap hidden sm:inline-block">
                  Asistente Manual y PEI
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Window Dialog */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`fixed z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 ${
                isExpanded
                  ? "inset-4 md:inset-10 w-auto h-auto max-w-5xl mx-auto"
                  : "bottom-4 left-4 md:bottom-6 md:left-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[590px] max-h-[88vh]"
              }`}
              id="chatbot-modal-window"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-[#0F2444] via-[#1B3A6B] to-[#16335f] p-3.5 text-white flex items-center justify-between border-b border-[#C9A961]/30">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-9 h-9 rounded-xl bg-white/10 border border-[#C9A961]/50 p-1 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-[#C9A961]" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1B3A6B] rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold tracking-tight truncate">
                        Asistente Institucional
                      </h3>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#C9A961]/20 text-[#C9A961] border border-[#C9A961]/30">
                        RAG 2026-27
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">
                      Manual de Convivencia y PEI
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 text-slate-300">
                  <button
                    onClick={handleResetChat}
                    className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
                    title="Reiniciar conversación"
                    id="chatbot-reset-btn"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition hidden sm:inline-flex"
                    title={isExpanded ? "Contraer" : "Expandir"}
                    id="chatbot-expand-btn"
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
                    title="Cerrar asistente"
                    id="chatbot-close-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Source Authenticity Banner */}
              <div className="bg-slate-50 border-b border-slate-200/80 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                  <FileText className="w-3.5 h-3.5 text-[#1B3A6B] shrink-0" />
                  <span className="truncate">
                    Fuentes exclusivas: MC_2026-2027_v1.2 y PEI-2026-2027
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                  Verificado
                </span>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50" id="chatbot-messages-scroll">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`relative group max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                        msg.sender === "user"
                          ? "bg-[#1B3A6B] text-white rounded-br-xs"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                      }`}
                    >
                      {msg.sender === "bot" ? (
                        <div className="prose prose-sm prose-slate max-w-none text-slate-800 text-[13px] leading-relaxed [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>h4]:font-bold [&>h4]:text-[#1B3A6B] [&>h4]:mt-2 [&>h4]:mb-1 [&>strong]:text-[#1B3A6B]">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap text-[13px] font-normal">{msg.text}</p>
                      )}

                      {/* Bot sources footer if available */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-[#C9A961]" />
                            Fuentes:
                          </span>
                          {msg.sources.map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded-md border border-slate-200 transition"
                              title={s.snippet}
                            >
                              📄 {s.docTitle} (pág. {s.page})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Copy action on hover for bot messages */}
                      {msg.sender === "bot" && (
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.text)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs"
                          title="Copiar respuesta"
                          aria-label="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 max-w-[85%]"
                  >
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs flex items-center gap-2.5">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#1B3A6B] animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-[#C9A961] animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-[#1B3A6B] animate-bounce" />
                      </div>
                      <span className="text-xs text-slate-500 font-medium italic">
                        Consultando Manual de Convivencia y PEI...
                      </span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions Chips */}
              <div className="bg-white border-t border-slate-100 px-3 py-2">
                <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-slate-500">
                  <HelpCircle className="w-3 h-3 text-[#C9A961]" />
                  <span>Consultas frecuentes:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      disabled={isLoading}
                      className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-[#1B3A6B]/10 hover:text-[#1B3A6B] hover:border-[#1B3A6B]/30 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 transition active:scale-95 shrink-0 disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-end gap-2"
                >
                  <div className="relative flex-1">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Pregunta sobre el Manual o PEI (ej. matrícula, uniforme)..."
                      rows={1}
                      disabled={isLoading}
                      className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50/70 p-2.5 pr-10 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#1B3A6B] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3A6B] transition disabled:opacity-50 max-h-28"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 bg-[#1B3A6B] hover:bg-[#0F2444] text-white rounded-xl transition shadow-md disabled:opacity-40 disabled:pointer-events-none active:scale-95 flex items-center justify-center shrink-0"
                    title="Enviar consulta"
                    id="chatbot-send-button"
                  >
                    <Send className="w-4 h-4 text-[#C9A961]" />
                  </button>
                </form>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>
                    Presiona Enter para enviar, Shift+Enter para nueva línea
                  </span>
                  <span>FCBV 2026-2027</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
