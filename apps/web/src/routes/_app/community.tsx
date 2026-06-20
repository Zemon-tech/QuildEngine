import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/community")({ component: CommunityPage });

function CommunityPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>Community</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>Interact with other developers, share knowledge, and learn together.</p>
    </div>
  );
}
