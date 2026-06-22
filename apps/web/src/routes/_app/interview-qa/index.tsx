import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/interview-qa/")({
  component: () => <Navigate to="/practice/interview-qa" replace />,
});
