import { createFileRoute } from "@tanstack/react-router";
import { Map } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/roadmaps/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Roadmaps"
        description="Manage learning roadmaps"
        icon={Map}
        breadcrumbs={[{ label: "Admin" }, { label: "Roadmaps" }]}
      />
      <EmptyState
        icon={Map}
        title="Roadmaps coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
