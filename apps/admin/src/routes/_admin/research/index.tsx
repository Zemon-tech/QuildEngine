import { createFileRoute } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/research/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Research"
        description="Manage research content"
        icon={Rocket}
        breadcrumbs={[{ label: "Admin" }, { label: "Research" }]}
      />
      <EmptyState
        icon={Rocket}
        title="Research coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
