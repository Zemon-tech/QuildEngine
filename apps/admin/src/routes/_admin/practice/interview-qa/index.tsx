import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { EmptyState } from "#/components/admin/empty-state";

export const Route = createFileRoute("/_admin/practice/interview-qa/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-6 w-full">
      <PageHeader
        title="Interview Q&A"
        description="Manage interview questions"
        icon={MessageSquare}
        breadcrumbs={[{ label: "Admin" }, { label: "Interview Q&A" }]}
      />
      <EmptyState
        icon={MessageSquare}
        title="Interview Q&A coming soon"
        description="This section is under active development."
      />
    </div>
  );
}
