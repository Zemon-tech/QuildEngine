import { createFileRoute } from "@tanstack/react-router";
import { TopicRevisionPanel } from "#/components/dsa/topic-revision-panel";

export const Route = createFileRoute("/_app/practice/dsa/$topicId/revision")({
  component: RevisionTab,
});

/**
 * Revision Sheet tab — /practice/dsa/$topicId/revision
 */
function RevisionTab() {
  const { topicId } = Route.useParams();
  return <TopicRevisionPanel topicId={topicId} />;
}
