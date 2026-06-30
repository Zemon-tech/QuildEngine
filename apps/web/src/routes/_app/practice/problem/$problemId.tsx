import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { WorkspaceLayout } from "#/components/workspace/workspace-layout";
import { useWorkspaceStore } from "#/store/use-workspace-store";

export const Route = createFileRoute("/_app/practice/problem/$problemId")({
  component: ProblemWorkspacePage,
});

function ProblemWorkspacePage() {
  const { problemId } = Route.useParams();
  const setLastOpenedProblem = useWorkspaceStore(
    (state) => state.setLastOpenedProblem,
  );

  useEffect(() => {
    setLastOpenedProblem(problemId);
  }, [problemId, setLastOpenedProblem]);

  return <WorkspaceLayout problemId={problemId} />;
}
