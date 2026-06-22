import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/case-studies/$type")({
  component: RedirectToNewCaseStudies,
});

function RedirectToNewCaseStudies() {
  const { type } = Route.useParams();
  return (
    <Navigate to="/practice/case-studies/$type" params={{ type }} replace />
  );
}
