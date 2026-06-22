import { createFileRoute } from "@tanstack/react-router";
import { TopicResources } from "#/components/dsa/topic-resources";

export const Route = createFileRoute("/_app/practice/dsa/$topicId/resources")({
  component: ResourcesTab,
});

/**
 * Study Resources tab — /practice/dsa/$topicId/resources
 */
function ResourcesTab() {
  const { topicId } = Route.useParams();
  return <TopicResources topicId={topicId} />;
}
