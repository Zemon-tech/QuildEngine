import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TooltipProvider } from "#/components/ui/tooltip";
import { AppSidebar } from "#/components/sidebar/app-sidebar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <TooltipProvider delayDuration={400} skipDelayDuration={100}>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="page-enter flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
