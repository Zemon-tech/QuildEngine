import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/analytics/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Analytics"
        description="View platform analytics"
        icon={BarChart3}
        breadcrumbs={[{ label: "Admin" }, { label: "Analytics" }]}
      />
      <EmptyState
        icon={BarChart3}
        title="Analytics coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
