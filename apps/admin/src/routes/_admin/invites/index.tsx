import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { EmptyState } from "#/components/admin/empty-state";
import { PageHeader } from "#/components/admin/page-header";

export const Route = createFileRoute("/_admin/invites/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Invites"
        description="Manage user invites"
        icon={Mail}
        breadcrumbs={[{ label: "Admin" }, { label: "Invites" }]}
      />
      <EmptyState
        icon={Mail}
        title="Invites coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
