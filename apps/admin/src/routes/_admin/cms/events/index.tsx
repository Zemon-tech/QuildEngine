import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/cms/events/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Events"
        description="Manage events and sessions"
        icon={Calendar}
        breadcrumbs={[{ label: "Admin" }, { label: "Events" }]}
      />
      <EmptyState
        icon={Calendar}
        title="Events coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
