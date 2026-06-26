import { createFileRoute } from "@tanstack/react-router";
import { Code2 } from "lucide-react";
import { EmptyState } from "#/components/admin/empty-state";
import { PageHeader } from "#/components/admin/page-header";

export const Route = createFileRoute("/_admin/practice/dsa/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="DSA Problems"
        description="Manage algorithms and data structure problems"
        icon={Code2}
        breadcrumbs={[{ label: "Admin" }, { label: "DSA Problems" }]}
      />
      <EmptyState
        icon={Code2}
        title="DSA Problems coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
