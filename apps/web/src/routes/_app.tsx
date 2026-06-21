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
          <SidebarInset className="flex flex-1 flex-col overflow-y-auto bg-transparent border-0 outline-none">
            <div className="page-enter flex-1 p-6">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
