import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { EmptyState } from "#/components/admin/empty-state";
import { PageHeader } from "#/components/admin/page-header";

export const Route = createFileRoute("/_admin/practice/case-studies/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Case Studies"
        description="Manage case study content"
        icon={Briefcase}
        breadcrumbs={[{ label: "Admin" }, { label: "Case Studies" }]}
      />
      <EmptyState
        icon={Briefcase}
        title="Case Studies coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
