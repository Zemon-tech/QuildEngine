import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/cms/newsletter/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Newsletter"
        description="Manage newsletter campaigns"
        icon={Mail}
        breadcrumbs={[{ label: "Admin" }, { label: "Newsletter" }]}
      />
      <EmptyState
        icon={Mail}
        title="Newsletter coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
