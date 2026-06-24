import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppSidebar } from "#/components/sidebar/app-sidebar";
import { SecondarySidebar } from "#/components/sidebar/secondary-sidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { TooltipProvider } from "#/components/ui/tooltip";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const parts = currentPath.split("/").filter(Boolean);
  const isThirdLevelRoute = parts.length >= 3;

  // Read initial sidebar state from cookies/localStorage or default to true
  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const isProblem =
        window.location.pathname.includes("/practice/problem/") ||
        window.location.pathname.includes("/practice/problems/");
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      const is3rd = pathParts.length >= 3 && !isProblem;

      if (isProblem || is3rd) {
        return false;
      }

      const preferred = localStorage.getItem("quild_sidebar_preferred_state");
      if (preferred !== null) {
        return preferred === "true";
      }

      const match = document.cookie.match(/(^| )sidebar_state=([^;]+)/);
      return match ? match[2] === "true" : true;
    }
    return true;
  });

  const isProblemWorkspace =
    currentPath.includes("/practice/problem/") ||
    currentPath.includes("/practice/problems/");

  // Sync sidebar state on path changes
  useEffect(() => {
    if (isProblemWorkspace || isThirdLevelRoute) {
      setOpen(false);
    } else {
      const preferred = localStorage.getItem("quild_sidebar_preferred_state");
      if (preferred !== null) {
        setOpen(preferred === "true");
      } else {
        const match = document.cookie.match(/(^| )sidebar_state=([^;]+)/);
        setOpen(match ? match[2] === "true" : true);
      }
    }
  }, [currentPath, isProblemWorkspace, isThirdLevelRoute]);

  // Intercept open change to save preference
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!isProblemWorkspace && !isThirdLevelRoute) {
      localStorage.setItem("quild_sidebar_preferred_state", String(newOpen));
      document.cookie = `sidebar_state=${newOpen}; path=/; max-age=${60 * 60 * 24 * 7}; path=/`;
    }
  };

  return (
    <SidebarProvider open={open} onOpenChange={handleOpenChange}>
      <TooltipProvider delayDuration={400} skipDelayDuration={100}>
        <div className="flex h-screen w-screen overflow-hidden">
          <AppSidebar />
          <SecondarySidebar />
          <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-transparent border-0 outline-none">
            {/* Scrollable Main Content or Full-Screen Workspace */}
            <div
              className={`flex-1 ${
                isProblemWorkspace
                  ? "flex flex-col h-screen"
                  : "overflow-y-auto page-enter px-3 py-6 md:px-4 pt-16 md:pt-6"
              }`}
            >
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
