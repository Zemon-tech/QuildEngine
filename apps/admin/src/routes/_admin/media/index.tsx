import { createFileRoute } from "@tanstack/react-router";
import { Image } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/media/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Media Library"
        description="Manage media assets"
        icon={Image}
        breadcrumbs={[{ label: "Admin" }, { label: "Media Library" }]}
      />
      <EmptyState
        icon={Image}
        title="Media Library coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
