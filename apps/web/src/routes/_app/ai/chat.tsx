import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Code2, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/ai/chat")({
  component: AIChatPage,
});

const modes = [
  { icon: MessageSquare, label: "General", desc: "Ask anything" },
  { icon: BookOpen, label: "Course Assistant", desc: "Help with your courses" },
  {
    icon: Code2,
    label: "Coding Assistant",
    desc: "Debug, explain, and review code",
  },
];

function AIChatPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-3">
        <Sparkles size={20} style={{ color: "var(--sb-accent)" }} />
        <div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: "var(--sb-ink)",
              fontFamily: "'Fraunces', Georgia, serif",
            }}
          >
            AI Chat
          </h1>
          <p className="text-sm" style={{ color: "var(--sb-ink-muted)" }}>
            Choose a mode and start a conversation.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {modes.map(({ icon: Icon, label, desc }) => (
          <button
            key={label}
            type="button"
            className="stagger-item flex flex-col gap-3 rounded-xl p-4 text-left transition-opacity duration-150 hover:opacity-80"
            style={{
              background: "oklch(1 0 0 / 0.04)",
              border: "1px solid oklch(1 0 0 / 0.08)",
            }}
          >
            <div
              className="flex size-9 items-center justify-center rounded-lg"
              style={{ background: "var(--sb-pill)" }}
            >
              <Icon size={16} style={{ color: "var(--sb-accent)" }} />
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--sb-ink)" }}>
                {label}
              </p>
              <p className="text-sm" style={{ color: "var(--sb-ink-muted)" }}>
                {desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
