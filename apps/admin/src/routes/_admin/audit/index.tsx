import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/audit/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Audit Logs"
        description="View admin audit trail"
        icon={History}
        breadcrumbs={[{ label: "Admin" }, { label: "Audit Logs" }]}
      />
      <EmptyState
        icon={History}
        title="Audit Logs coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
