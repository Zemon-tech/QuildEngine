import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/ai/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="AI Center"
        description="Manage AI models and prompts"
        icon={BrainCircuit}
        breadcrumbs={[{ label: "Admin" }, { label: "AI Center" }]}
      />
      <EmptyState
        icon={BrainCircuit}
        title="AI Center coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
