import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/practice/assessments/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Assessments"
        description="Manage assessments and tests"
        icon={ClipboardList}
        breadcrumbs={[{ label: "Admin" }, { label: "Assessments" }]}
      />
      <EmptyState
        icon={ClipboardList}
        title="Assessments coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
