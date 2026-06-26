import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { AdminAppSidebar } from "#/components/sidebar/admin-app-sidebar";
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

    if (!ADMIN_ROLES.includes(session.user.role as (typeof ADMIN_ROLES)[number])) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    return { session };
  },
  component: AdminShell,
});

import { AdminSecondarySidebar } from "#/components/sidebar/admin-secondary-sidebar";

function AdminShell() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "272px",
          "--sidebar-width-icon": "60px",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-screen overflow-hidden bg-transparent">
        <AdminAppSidebar />
        <AdminSecondarySidebar />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-transparent border-0 outline-none">
          <div className="flex-1 overflow-y-auto page-enter">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
