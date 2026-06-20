import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_app/profile")({ component: ProfilePage });
function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>Profile</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>Your account, progress, achievements, and certificates.</p>
    </div>
  );
}
