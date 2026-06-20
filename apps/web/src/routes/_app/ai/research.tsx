import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";

export const Route = createFileRoute("/_app/ai/research")({ component: AIResearchPage });

function AIResearchPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-3">
        <FlaskConical size={20} style={{ color: "var(--sb-accent)" }} />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>AI Research</h1>
          <p className="text-sm" style={{ color: "var(--sb-ink-muted)" }}>Deep research, source collection, and knowledge synthesis.</p>
        </div>
      </div>
    </div>
  );
}
