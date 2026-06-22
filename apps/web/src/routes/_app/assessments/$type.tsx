import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/assessments/$type")({
  component: RedirectToNewAssessments,
});

function RedirectToNewAssessments() {
  const { type } = Route.useParams();
  return (
    <Navigate to="/practice/assessments/$type" params={{ type }} replace />
  );
}
