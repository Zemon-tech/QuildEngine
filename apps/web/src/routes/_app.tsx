import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TooltipProvider } from "#/components/ui/tooltip";
import { AppSidebar } from "#/components/sidebar/app-sidebar";
import { SecondarySidebar } from "#/components/sidebar/secondary-sidebar";
import { SidebarProvider, SidebarInset } from "#/components/ui/sidebar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <TooltipProvider delayDuration={400} skipDelayDuration={100}>
        <div className="flex h-screen w-screen overflow-hidden">
          <AppSidebar />
          <SecondarySidebar />
          <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-transparent border-0 outline-none">
            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto page-enter p-6 pt-16 md:pt-6">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
