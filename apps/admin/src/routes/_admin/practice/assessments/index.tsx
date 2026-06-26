import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { EmptyState } from "#/components/admin/empty-state";
import { PageHeader } from "#/components/admin/page-header";

export const Route = createFileRoute("/_admin/practice/assessments/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
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
