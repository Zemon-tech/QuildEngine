import { createFileRoute } from "@tanstack/react-router";
import { TopicDetailPage } from "#/components/dsa/topic-detail-page";

export const Route = createFileRoute("/_app/dsa/$topicId")({
  component: DSATopicPage,
});

function DSATopicPage() {
  const { topicId } = Route.useParams();
  return <TopicDetailPage topicId={topicId} />;
}
