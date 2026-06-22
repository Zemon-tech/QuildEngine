import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dsa/")({
  component: () => <Navigate to="/practice/dsa" replace />,
});
