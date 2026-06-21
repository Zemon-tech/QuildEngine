import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TooltipProvider } from "#/components/ui/tooltip";
import { AppSidebar } from "#/components/sidebar/app-sidebar";
import { GlobalSearchTrigger } from "#/components/search/global-search";
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
            {/* Sticky Header with Global Search */}
            <header
              className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-6 backdrop-blur-md transition-colors"
              style={{
                background: "var(--header-bg)",
                borderColor: "var(--sb-border)",
              }}
            >
              <div className="flex flex-1 justify-center max-w-md mx-auto pl-12 md:pl-0">
                <GlobalSearchTrigger />
              </div>
            </header>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto page-enter p-6">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
