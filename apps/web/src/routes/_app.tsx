import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppSidebar } from "#/components/sidebar/app-sidebar";
import { SecondarySidebar, useAppSidebarForcedOpen } from "#/components/sidebar/secondary-sidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { TooltipProvider } from "#/components/ui/tooltip";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isLearningOrResearch =
    currentPath.startsWith("/learn") ||
    currentPath.startsWith("/courses") ||
    currentPath.startsWith("/research") ||
    currentPath.startsWith("/documentation");

  const [appSidebarForcedOpen] = useAppSidebarForcedOpen();

  const showAppSidebar = !isLearningOrResearch || appSidebarForcedOpen;

  const parts = currentPath.split("/").filter(Boolean);
  const isThirdLevelRoute = parts.length >= 3;

  // Read initial sidebar state from cookies or default to true
  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(^| )sidebar_state=([^;]+)/);
      return match ? match[2] === "true" : true;
    }
    return true;
  });

  const [prevPath, setPrevPath] = useState(currentPath);
  const prevSidebarStateRef = useRef<boolean | null>(null);

  const isProblemWorkspace =
    currentPath.includes("/practice/problem/") ||
    currentPath.includes("/practice/problems/");

  useEffect(() => {
    const isProblemRoute =
      currentPath.includes("/practice/problem/") ||
      currentPath.includes("/practice/problems/");
    const wasProblemRoute =
      prevPath.includes("/practice/problem/") ||
      prevPath.includes("/practice/problems/");

    if (isProblemRoute && !wasProblemRoute) {
      // Store previous sidebar state and collapse
      prevSidebarStateRef.current = open;
      setOpen(false);
    } else if (!isProblemRoute && wasProblemRoute) {
      // Restore previous sidebar state
      if (prevSidebarStateRef.current !== null) {
        setOpen(prevSidebarStateRef.current);
        prevSidebarStateRef.current = null;
      } else {
        setOpen(true);
      }
    } else if (!isProblemRoute) {
      // Normal third level collapsing logic for non-problem routes
      const prevParts = prevPath.split("/").filter(Boolean);
      const wasThirdLevel = prevParts.length >= 3;

      if (isThirdLevelRoute && !wasThirdLevel) {
        setOpen(false);
      } else if (!isThirdLevelRoute && wasThirdLevel) {
        setOpen(true);
      }
    }

    setPrevPath(currentPath);
  }, [currentPath, isThirdLevelRoute, prevPath]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={400} skipDelayDuration={100}>
        <div className="flex h-screen w-screen overflow-hidden">
          {showAppSidebar && <AppSidebar />}
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
