import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthShell,
});

function AuthShell() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--page-bg)" }}
    >
      <Outlet />
    </div>
  );
}
