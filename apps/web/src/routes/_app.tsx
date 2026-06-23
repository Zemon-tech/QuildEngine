import { useEffect, useState } from "react";
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
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
  const isThirdLevelPracticeRoute =
    parts[0] === "practice" &&
    parts.length >= 3 &&
    ["dsa", "interview", "interview-qa", "case-studies", "assessments"].includes(parts[1]);

  // Read initial sidebar state from cookies or default to true
  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(new RegExp('(^| )sidebar_state=([^;]+)'));
      return match ? match[2] === "true" : true;
    }
    return true;
  });

  const [prevPath, setPrevPath] = useState(currentPath);

  useEffect(() => {
    const prevParts = prevPath.split("/").filter(Boolean);
    const wasThirdLevel =
      prevParts[0] === "practice" &&
      prevParts.length >= 3 &&
      ["dsa", "interview", "interview-qa", "case-studies", "assessments"].includes(prevParts[1]);

    if (isThirdLevelPracticeRoute && !wasThirdLevel) {
      setOpen(false);
    } else if (!isThirdLevelPracticeRoute && wasThirdLevel) {
      setOpen(true);
    }

    setPrevPath(currentPath);
  }, [currentPath, isThirdLevelPracticeRoute, prevPath]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={400} skipDelayDuration={100}>
        <div className="flex h-screen w-screen overflow-hidden">
          <AppSidebar />
          <SecondarySidebar />
          <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-transparent border-0 outline-none">
            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto page-enter px-3 py-6 md:px-4 pt-16 md:pt-6">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
