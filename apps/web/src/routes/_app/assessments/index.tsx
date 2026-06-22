import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/assessments/")({
  component: () => <Navigate to="/practice/assessments" replace />,
});
