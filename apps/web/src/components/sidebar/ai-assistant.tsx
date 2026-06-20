import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Sparkles,
  Send,
  Code2,
  BookOpen,
  FlaskConical,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import { cn } from "#/lib/utils";

type ChatTab = "general" | "course" | "coding" | "research";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const TAB_CONFIG: { id: ChatTab; label: string; icon: typeof MessageSquare }[] =
  [
    { id: "general", label: "General", icon: MessageSquare },
    { id: "course", label: "Course", icon: BookOpen },
    { id: "coding", label: "Coding", icon: Code2 },
    { id: "research", label: "Research", icon: FlaskConical },
  ];

const WELCOME_MESSAGES: Record<ChatTab, string> = {
  general: "Hi! I'm your Quild AI assistant. Ask me anything about your learning journey, career goals, or any topic you're curious about.",
  course: "Course assistant here. I can help explain concepts, summarize lessons, quiz you on topics, or help you navigate the course material.",
  coding: "Coding assistant ready. Paste code, describe a problem, or ask me to explain any algorithm or data structure.",
  research: "Research mode active. I can help you explore topics in depth, find connections between concepts, and synthesize knowledge from multiple sources.",
};

interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
}

export function AIAssistant({ open, onClose }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>("general");
  const [messages, setMessages] = useState<Record<ChatTab, Message[]>>({
    general: [],
    course: [],
    coding: [],
    research: [],
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentMessages = messages[activeTab];

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 260);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userMsg],
    }));
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: `That's a great question! This is a placeholder response from the ${activeTab} assistant. The real AI integration will be connected to your backend API.`,
      };
      setMessages((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], aiMsg],
      }));
      setIsTyping(false);
    }, 1200);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function clearChat() {
    setMessages((prev) => ({ ...prev, [activeTab]: [] }));
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-4 right-4 z-50 flex flex-col overflow-hidden rounded-2xl"
            style={{
              width: 380,
              height: 540,
              background: "oklch(0.12 0.013 220)",
              border: "1px solid var(--sb-border)",
              boxShadow:
                "0 24px 80px oklch(0 0 0 / 0.5), 0 4px 24px oklch(0 0 0 / 0.3), 0 0 0 1px oklch(1 0 0 / 0.04) inset",
            }}
          >
            {/* Header */}
            <div
              className="flex shrink-0 items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--sb-border)" }}
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  size={15}
                  style={{ color: "var(--sb-accent)" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--sb-ink)" }}
                >
                  AI Assistant
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  className="flex items-center justify-center rounded-md p-1.5 transition-opacity duration-150 hover:opacity-70"
                  style={{ color: "var(--sb-ink-dim)" }}
                  title="Clear chat"
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center justify-center rounded-md p-1.5 transition-opacity duration-150 hover:opacity-70"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div
              className="flex shrink-0 gap-0.5 px-3 py-2"
              style={{ borderBottom: "1px solid var(--sb-border)" }}
            >
              {TAB_CONFIG.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-xs font-medium transition-colors duration-150",
                      "outline-none focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60",
                    )}
                    style={{
                      color: isActive ? "var(--sb-accent)" : "var(--sb-ink-muted)",
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="ai-tab-pill"
                        className="absolute inset-0 rounded-[8px]"
                        style={{ background: "var(--sb-pill)" }}
                        transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
                      />
                    )}
                    <tab.icon size={12} className="relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {currentMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div
                    className="mb-3 flex size-10 items-center justify-center rounded-xl"
                    style={{ background: "var(--sb-pill)" }}
                  >
                    <Sparkles size={18} style={{ color: "var(--sb-accent)" }} />
                  </div>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "var(--sb-ink-muted)", maxWidth: 280 }}
                  >
                    {WELCOME_MESSAGES[activeTab]}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed"
                        style={
                          msg.role === "user"
                            ? {
                                background: "var(--sb-accent)",
                                color: "oklch(0.12 0.01 220)",
                                borderBottomRightRadius: 4,
                              }
                            : {
                                background: "var(--sb-bg-active)",
                                color: "var(--sb-ink)",
                                border: "1px solid var(--sb-border)",
                                borderBottomLeftRadius: 4,
                              }
                        }
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div
                        className="flex items-center gap-1 rounded-2xl px-3.5 py-3"
                        style={{
                          background: "var(--sb-bg-active)",
                          border: "1px solid var(--sb-border)",
                          borderBottomLeftRadius: 4,
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="block size-1.5 rounded-full"
                            style={{ background: "var(--sb-ink-dim)" }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div
              className="shrink-0 px-3 pb-3 pt-2"
              style={{ borderTop: "1px solid var(--sb-border)" }}
            >
              <div
                className="flex items-end gap-2 rounded-[12px] px-3 py-2"
                style={{
                  background: "var(--sb-bg-hover)",
                  border: "1px solid var(--sb-border)",
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-[13px] leading-relaxed outline-none"
                  style={{
                    color: "var(--sb-ink)",
                    maxHeight: 100,
                    fontFamily: "'Inter', 'Manrope', sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={cn(
                    "mb-0.5 flex shrink-0 items-center justify-center rounded-[8px] transition-all duration-150",
                    "disabled:opacity-30",
                    "hover:scale-[1.05] active:scale-[0.96]",
                  )}
                  style={{
                    width: 28,
                    height: 28,
                    background: "var(--sb-accent)",
                    color: "oklch(0.12 0.01 220)",
                  }}
                >
                  <Send size={13} />
                </button>
              </div>
              <p
                className="mt-1.5 text-center text-[10px]"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                ↵ Send · Shift+↵ New line
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
