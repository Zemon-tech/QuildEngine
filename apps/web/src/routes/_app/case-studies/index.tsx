import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/case-studies/")({
  component: () => <Navigate to="/practice/case-studies" replace />,
});
