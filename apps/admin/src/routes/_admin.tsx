import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminAppSidebar } from "#/components/sidebar/admin-app-sidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { getSessionFn } from "#/lib/server-fns/auth";

const ADMIN_ROLES = ["superadmin", "admin", "editor", "moderator"] as const;

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    const session = await getSessionFn();

    if (!session || !session.user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    if (
      !ADMIN_ROLES.includes(session.user.role as (typeof ADMIN_ROLES)[number])
    ) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    return { session };
  },
  component: AdminShell,
});

import { useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Keyboard, Mic, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Message, MessageContent } from "#/components/ai-elements/message.tsx";
import { AdminSecondarySidebar } from "#/components/sidebar/admin-secondary-sidebar";
import { cn } from "#/lib/utils";

interface GlobalMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function AdminShell() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<GlobalMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Trigger keyboard hotkey Ctrl + / or Cmd + /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages || loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Initial greeting when opening
  useEffect(() => {
    if (open && messages.length === 0) {
      const getGreetingText = () => {
        if (currentPath.includes("/learning")) {
          return "Hello! I am your LMS Copilot. I can help you draft tutorials, outline new modules, generate practice quizzes, or redirect you to specific management views. What would you like to build?";
        }
        if (currentPath.includes("/ai")) {
          return "Welcome to the AI Center! I can help you audit model token usage, inspect Pinecone vector caches, manage active API keys, or switch settings. What can I assist with?";
        }
        return "Hi there! I am your Quild Copilot. I understand natural language navigation. Try saying 'go to courses', 'show analytics', or 'open settings' to direct me.";
      };

      setMessages([
        {
          id: "initial-greet",
          role: "assistant",
          content: getGreetingText(),
        },
      ]);
    }
  }, [open, currentPath, messages.length]);

  const getSuggestions = () => {
    if (currentPath.includes("/learning")) {
      return [
        { label: "Go to Courses", cmd: "go to courses" },
        { label: "Outline React Lesson", cmd: "outline react lesson" },
        { label: "LMS Analytics Insights", cmd: "show analytics" },
      ];
    }
    if (currentPath.includes("/ai")) {
      return [
        { label: "Show Token Usage", cmd: "show token usage" },
        { label: "Open Settings", cmd: "go to settings" },
        { label: "Background training jobs", cmd: "show active jobs" },
      ];
    }
    return [
      { label: "AI Center Workspace", cmd: "go to AI Center" },
      { label: "LMS Course Management", cmd: "go to courses" },
      { label: "Settings Dashboard", cmd: "go to settings" },
    ];
  };

  const handleCommandNavigation = async (cmd: string) => {
    const norm = cmd.toLowerCase().trim();
    setLoading(true);

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    let reply =
      "I'm processing that prompt. Let me know if you have other commands.";
    let targetRoute = "";

    if (norm.includes("course") || norm.includes("courses")) {
      reply = "Right away! Redirecting you to LMS Courses Manager...";
      targetRoute = "/learning/courses";
    } else if (norm.includes("analytics") || norm.includes("insight")) {
      reply = "Understood. Directing you to the Analytics Dashboard...";
      targetRoute = "/learning/analytics";
    } else if (
      norm.includes("ai center") ||
      norm.includes("ai dashboard") ||
      norm.includes("ai platform")
    ) {
      reply = "Opening the centralized AI Center Workspace...";
      targetRoute = "/ai";
    } else if (norm.includes("settings")) {
      reply = "Opening AI systemic settings panel...";
      targetRoute = "/ai?tab=settings";
    } else if (norm.includes("token")) {
      reply = "Loading real-time token allocation breakdown...";
      targetRoute = "/ai?tab=tokens";
    } else if (
      norm.includes("jobs") ||
      norm.includes("pipelines") ||
      norm.includes("background")
    ) {
      reply = "Opening Fine-tuning Background Pipelines...";
      targetRoute = "/ai?tab=jobs";
    } else if (norm.includes("model") || norm.includes("cpu")) {
      reply = "Opening Routing and Model Management panel...";
      targetRoute = "/ai?tab=models";
    } else if (norm.includes("outline") || norm.includes("lesson")) {
      reply =
        "Drafting lesson layout... Check the LMS editor. I've also opened the Lessons route for you.";
      targetRoute = "/learning/lessons";
    }

    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), role: "assistant", content: reply },
    ]);
    setLoading(false);

    if (targetRoute) {
      setTimeout(() => {
        navigate({ to: targetRoute as any });
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userPrompt = input.trim();
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), role: "user", content: userPrompt },
    ]);
    setInput("");

    await handleCommandNavigation(userPrompt);
  };

  const handleSimulateVoice = () => {
    setVoiceRecording(true);
    setTimeout(() => {
      setVoiceRecording(false);
      setInput("go to course management");
    }, 1500);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "272px",
          "--sidebar-width-icon": "60px",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-screen overflow-hidden bg-[var(--page-bg)] text-[var(--page-ink)] relative">
        <AdminAppSidebar />
        <AdminSecondarySidebar />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-[var(--page-bg)] border-0 outline-none">
          <div className="flex-1 overflow-y-auto page-enter">
            <Outlet />
          </div>
        </SidebarInset>

        {/* Global Floating Assistant Action Button */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          {!open && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/90 text-zinc-400 text-[10px] font-medium backdrop-blur-md shadow-lg"
            >
              <Keyboard size={12} />
              <span>
                Press{" "}
                <kbd className="font-semibold text-zinc-200">Ctrl + /</kbd>
              </span>
            </motion.div>
          )}

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center justify-center size-12 rounded-full bg-amber-500 text-black hover:bg-amber-400 shadow-xl transition-transform active:scale-95 cursor-pointer z-50"
            title="Toggle Quild Copilot"
          >
            {open ? (
              <X size={20} />
            ) : (
              <Sparkles size={20} className="animate-pulse" />
            )}
          </button>
        </div>

        {/* Global Copilot Sliding Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-22 right-6 z-50 w-80 md:w-96 h-[480px] rounded-2xl border border-zinc-800/80 bg-zinc-950/95 backdrop-blur-lg shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Copilot Header */}
              <div className="h-12 shrink-0 border-b border-zinc-800/60 px-4 flex items-center justify-between bg-zinc-900/30">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    Quild Copilot
                  </span>
                </div>
                <div className="text-[9px] text-zinc-500 font-semibold">
                  Ctrl + / to hide
                </div>
              </div>

              {/* Chat Viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
                {messages.map((msg) => (
                  <Message
                    from={msg.role}
                    key={msg.id}
                    className="[&>div]:bg-zinc-900! [&>div]:text-zinc-200! [&>div]:border-zinc-800!"
                  >
                    <MessageContent>
                      <span className="text-xs leading-relaxed">
                        {msg.content}
                      </span>
                    </MessageContent>
                  </Message>
                ))}

                {loading && (
                  <div className="flex items-center gap-1.5 pl-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce delay-0" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce delay-150" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce delay-300" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* suggestions list */}
              <div className="px-4 pb-2 pt-1 border-t border-zinc-900 bg-zinc-950 flex flex-col gap-1.5 shrink-0">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">
                  Quick Actions
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {getSuggestions().map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => {
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: Math.random().toString(),
                            role: "user",
                            content: s.cmd,
                          },
                        ]);
                        handleCommandNavigation(s.cmd);
                      }}
                      className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] text-zinc-300 font-medium border border-zinc-800 transition-all active:scale-[0.97] cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-zinc-800/80 bg-zinc-950 p-3 flex gap-2 items-center shrink-0"
              >
                <button
                  type="button"
                  onClick={handleSimulateVoice}
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-900 cursor-pointer active:scale-95 transition-all",
                    voiceRecording &&
                      "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse",
                  )}
                  title="Simulate Voice Navigation"
                >
                  <Mic size={14} />
                </button>
                <input
                  type="text"
                  placeholder={
                    voiceRecording ? "Listening..." : "Ask Quild Copilot..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={voiceRecording}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-amber-500/50"
                />
                <button
                  type="submit"
                  className="size-8 rounded-lg bg-amber-500 text-black hover:bg-amber-400 flex items-center justify-center cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SidebarProvider>
  );
}
