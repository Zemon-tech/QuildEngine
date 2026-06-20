import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_app/profile/achievements")({ component: AchievementsPage });
function AchievementsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>Achievements</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>Your badges and milestones.</p>
    </div>
  );
}
