import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminAppSidebar } from "#/components/sidebar/admin-app-sidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { getSessionFn } from "#/lib/server-fns/auth";
import { type Role } from "@quild/contracts";

const ADMIN_ROLES: Role[] = ["admin", "moderator"];

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    const session = await getSessionFn();

    if (!session || !session.user) {
      throw redirect({
        to: "/admin/login" as any,
        search: { redirect: location.href } as any,
      });
    }

    if (!ADMIN_ROLES.includes(session.user.role)) {
      throw redirect({
        to: "/admin/login" as any,
        search: { redirect: location.href } as any,
      });
    }

    return { session };
  },
  component: AdminShell,
});

import { AdminSecondarySidebar } from "#/components/sidebar/admin-secondary-sidebar";
import { AdminGuard } from "../auth/guards/AuthGuard.js";

function AdminShell() {
  return (
    <AdminGuard>
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
    </AdminGuard>
  );
}
