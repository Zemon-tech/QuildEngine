import { createFileRoute, Outlet } from "@tanstack/react-router";
import { GuestGuard } from "../auth/guards/AuthGuard.js";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <GuestGuard>
      <div className="flex min-h-screen w-screen items-center justify-center bg-[var(--sb-bg)] p-4 md:p-8">
        <Outlet />
      </div>
    </GuestGuard>
  );
}
