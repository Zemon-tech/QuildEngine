import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/learning/")({
  beforeLoad: () => {
    throw redirect({ to: "/learning/dashboard" });
  },
  component: () => null,
});
