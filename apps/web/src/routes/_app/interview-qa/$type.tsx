import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/interview-qa/$type")({
  component: RedirectToNewInterviewQA,
});

function RedirectToNewInterviewQA() {
  const { type } = Route.useParams();
  return (
    <Navigate to="/practice/interview-qa/$type" params={{ type }} replace />
  );
}
