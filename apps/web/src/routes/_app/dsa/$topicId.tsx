import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dsa/$topicId")({
  component: RedirectToNewDSATopic,
});

function RedirectToNewDSATopic() {
  const { topicId } = Route.useParams();
  return <Navigate to="/practice/dsa/$topicId" params={{ topicId }} replace />;
}
