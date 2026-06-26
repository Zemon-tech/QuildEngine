import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/cms/blog/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Blog Posts"
        description="Manage blog content"
        icon={FileText}
        breadcrumbs={[{ label: "Admin" }, { label: "Blog Posts" }]}
      />
      <EmptyState
        icon={FileText}
        title="Blog Posts coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
