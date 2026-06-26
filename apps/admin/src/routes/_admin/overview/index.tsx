import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Bot,
  Calendar,
  Clock,
  Code2,
  Database,
  DollarSign,
  FileText,
  Layers,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { z } from "zod";
import { DashboardChart } from "#/components/admin/dashboard-chart";
import { MetricCard } from "#/components/admin/metric-card";
import { PageHeader } from "#/components/admin/page-header";
import { StatusBadge } from "#/components/admin/status-badge";
import {
  useAiAnalytics,
  useEventAnalytics,
  useLearningAnalytics,
  usePlatformMetrics,
  usePracticeAnalytics,
  useRecentActivities,
  useResearchAnalytics,
  useUserAnalytics,
} from "#/hooks/use-overview";

// Type-safe search params validation
const overviewSearchSchema = z.object({
  tab: z.enum(["users", "learning", "ai", "events"]).optional().catch("users"),
});

export const Route = createFileRoute("/_admin/overview/")({
  validateSearch: (search) => overviewSearchSchema.parse(search),
  component: OverviewPage,
});

function OverviewPage() {
  const { tab = "users" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const activeTab = tab || "users";

  const setActiveTab = (newTab: "users" | "learning" | "ai" | "events") => {
    navigate({ search: (prev) => ({ ...prev, tab: newTab }) });
  };

  // TanStack Queries
  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsError,
    refetch: refetchMetrics,
  } = usePlatformMetrics();

  const {
    data: userAnalytics,
    isLoading: userLoading,
    isError: userError,
    refetch: refetchUsers,
  } = useUserAnalytics();

  const {
    data: learningAnalytics,
    isLoading: learningLoading,
    isError: learningError,
    refetch: refetchLearning,
  } = useLearningAnalytics();

  const {
    data: practiceAnalytics,
    isLoading: practiceLoading,
    isError: practiceError,
    refetch: refetchPractice,
  } = usePracticeAnalytics();

  const {
    data: researchAnalytics,
    isLoading: researchLoading,
    isError: researchError,
    refetch: refetchResearch,
  } = useResearchAnalytics();

  const {
    data: aiAnalytics,
    isLoading: aiLoading,
    isError: aiError,
    refetch: refetchAi,
  } = useAiAnalytics();

  const {
    data: eventAnalytics,
    isLoading: eventLoading,
    isError: eventError,
    refetch: refetchEvents,
  } = useEventAnalytics();

  const {
    data: activities,
    isLoading: activitiesLoading,
    isError: activitiesError,
    refetch: refetchActivities,
  } = useRecentActivities();

  // Unified refetch for the whole dashboard
  const handleRefreshAll = () => {
    refetchMetrics();
    refetchUsers();
    refetchLearning();
    refetchPractice();
    refetchResearch();
    refetchAi();
    refetchEvents();
    refetchActivities();
  };

  // Quick Action Config
  const QUICK_ACTIONS = [
    {
      label: "Create Course",
      to: "/courses",
      icon: BookOpen,
      description: "Add a learning course",
    },
    {
      label: "Create Roadmap",
      to: "/roadmaps",
      icon: Layers,
      description: "Build interactive path",
    },
    {
      label: "Publish Research",
      to: "/research",
      icon: FileText,
      description: "Write technical paper",
    },
    {
      label: "Add DSA Problem",
      to: "/practice",
      icon: Code2,
      description: "Publish coding challenge",
    },
    {
      label: "Create Event",
      to: "/cms",
      icon: Calendar,
      description: "Schedule workshop/meetup",
    },
    {
      label: "Open AI Dashboard",
      to: "/ai",
      icon: Bot,
      description: "Configure platform models",
    },
    {
      label: "Manage Users",
      to: "/users",
      icon: Users,
      description: "View or invite administrators",
    },
  ];

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Admin Overview"
        description="Unified command center monitoring platform analytics, AI usage, courses, and system health."
        icon={TrendingUp}
        breadcrumbs={[{ label: "Admin" }, { label: "Overview" }]}
        actions={[
          {
            label: "Refresh Dashboard",
            onClick: handleRefreshAll,
            icon: RefreshCw,
            variant: "outline",
          },
        ]}
      />

      {/* 1. Statistics Cards Grid (10 Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers.value}
          changePercent={metrics?.totalUsers.changePercent}
          direction={metrics?.totalUsers.direction}
          comparisonText={metrics?.totalUsers.comparisonText}
          description={metrics?.totalUsers.description}
          icon={Users}
          isLoading={metricsLoading}
          isError={metricsError}
          onRetry={refetchMetrics}
        />
        <MetricCard
          title="Active Users"
          value={metrics?.activeUsers.value}
          changePercent={metrics?.activeUsers.changePercent}
          direction={metrics?.activeUsers.direction}
          comparisonText={metrics?.activeUsers.comparisonText}
          description={metrics?.activeUsers.description}
          icon={Activity}
          isLoading={metricsLoading}
          isError={metricsError}
          onRetry={refetchMetrics}
        />
        <MetricCard
          title="Courses Published"
          value={metrics?.coursesPublished.value}
          changePercent={metrics?.coursesPublished.changePercent}
          direction={metrics?.coursesPublished.direction}
          comparisonText={metrics?.coursesPublished.comparisonText}
          description={metrics?.coursesPublished.description}
          icon={BookOpen}
          isLoading={metricsLoading}
          isError={metricsError}
          onRetry={refetchMetrics}
        />
        <MetricCard
          title="Roadmaps Published"
          value={metrics?.roadmapsPublished.value}
          changePercent={metrics?.roadmapsPublished.changePercent}
          direction={metrics?.roadmapsPublished.direction}
          comparisonText={metrics?.roadmapsPublished.comparisonText}
          description={metrics?.roadmapsPublished.description}
          icon={Layers}
          isLoading={metricsLoading}
          isError={metricsError}
          onRetry={refetchMetrics}
        />
        <MetricCard
          title="Research Articles"
          value={metrics?.researchArticles.value}
          changePercent={metrics?.researchArticles.changePercent}
          direction={metrics?.researchArticles.direction}
          comparisonText={metrics?.researchArticles.comparisonText}
          description={metrics?.researchArticles.description}
          icon={FileText}
          isLoading={metricsLoading}
          isError={metricsError}
          onRetry={refetchMetrics}
        />
        <MetricCard
          title="DSA Problems"
          value={metrics?.dsaProblems.value}
          changePercent={metrics?.dsaProblems.changePercent}
          direction={metrics?.dsaProblems.direction}
          comparisonText={metrics?.dsaProblems.comparisonText}
          description={metrics?.dsaProblems.description}
          icon={Code2}
          isLoading={metricsLoading}
          isError={metricsError}
          onRetry={refetchMetrics}
        />
        <MetricCard
          title="Event Registrations"
          value={metrics?.eventRegistrations.value}
          changePercent={metrics?.eventRegistrations.changePercent}
          direction={metrics?.eventRegistrations.direction}
          comparisonText={metrics?.eventRegistrations.comparisonText}
          description={metrics?.eventRegistrations.description}
          icon={Calendar}
          isLoading={metricsLoading}
          isError={metricsError}
          onRetry={refetchMetrics}
        />
        <MetricCard
          title="Newsletter Subscribers"
          value={metrics?.newsletterSubscribers.value}
          changePercent={metrics?.newsletterSubscribers.changePercent}
          direction={metrics?.newsletterSubscribers.direction}
          comparisonText={metrics?.newsletterSubscribers.comparisonText}
          description={metrics?.newsletterSubscribers.description}
          icon={Database}
          isLoading={metricsLoading}
          isError={metricsError}
          onRetry={refetchMetrics}
        />
        <MetricCard
          title="AI Usage Statistics"
          value={metrics?.aiUsageStats.value}
          changePercent={metrics?.aiUsageStats.changePercent}
          direction={metrics?.aiUsageStats.direction}
          comparisonText={metrics?.aiUsageStats.comparisonText}
          description={metrics?.aiUsageStats.description}
          icon={Sparkles}
          isLoading={metricsLoading}
          isError={metricsError}
          onRetry={refetchMetrics}
        />
        <MetricCard
          title="Revenue Metrics"
          value={metrics?.revenueMetrics.value}
          changePercent={metrics?.revenueMetrics.changePercent}
          direction={metrics?.revenueMetrics.direction}
          comparisonText={metrics?.revenueMetrics.comparisonText}
          description={metrics?.revenueMetrics.description}
          icon={DollarSign}
          isLoading={metricsLoading}
          isError={metricsError}
          onRetry={refetchMetrics}
        />
      </div>

      {/* 2. Main content split layout (3/4 Analytics tabs, 1/4 Interaction feed) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Analytics Tabs Viewport (Column span 3) */}
        <div className="xl:col-span-3 space-y-4">
          {/* Custom Tabs Navigation */}
          <div className="flex border-b border-(--sb-border) gap-2 scrollbar-none overflow-x-auto pb-px">
            {(
              [
                { id: "users", label: "User Analytics", icon: Users },
                {
                  id: "learning",
                  label: "Learning & Practice",
                  icon: BookOpen,
                },
                { id: "ai", label: "AI Center", icon: Sparkles },
                { id: "events", label: "Events & Research", icon: Calendar },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all relative active:scale-[0.98]"
                style={{
                  borderColor:
                    activeTab === t.id ? "var(--sb-accent)" : "transparent",
                  color:
                    activeTab === t.id ? "var(--sb-ink)" : "var(--sb-ink-dim)",
                }}
              >
                <t.icon size={13} />
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: User Analytics */}
          {activeTab === "users" && (
            <div className="grid grid-cols-1 gap-6 stagger-item">
              <div className="island-shell rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3
                      className="text-sm font-bold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      User Growth & Engagement
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Visualizing registration rates over the past week
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold tabular-nums">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        Growth Rate
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {userLoading
                          ? "..."
                          : `+${userAnalytics?.growthRatePercent}%`}
                      </span>
                    </div>
                    <div className="border-l border-(--sb-border) pl-4">
                      <span className="text-[10px] text-muted-foreground block">
                        Retention Rate
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {userLoading
                          ? "..."
                          : `${userAnalytics?.retentionRatePercent}%`}
                      </span>
                    </div>
                  </div>
                </div>

                {userLoading ? (
                  <div className="h-[220px] bg-muted/40 animate-pulse rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                    Generating growth charts...
                  </div>
                ) : userError ? (
                  <div className="h-[220px] flex flex-col items-center justify-center border border-dashed rounded-lg p-6 text-center space-y-2">
                    <span className="text-xs text-destructive font-medium">
                      Failed to render user charts
                    </span>
                    <button
                      type="button"
                      onClick={() => refetchUsers()}
                      className="text-[10px] bg-secondary px-3 py-1 rounded border"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <DashboardChart
                    data={userAnalytics?.growthHistory || []}
                    dataKey="users"
                    labelKey="date"
                    type="line"
                    color="var(--sb-accent)"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Learning & Practice */}
          {activeTab === "learning" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-item">
              {/* Learning stats & popular courses */}
              <div className="island-shell rounded-xl p-5 space-y-4">
                <div>
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    Most Popular Courses
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Highest enrolled learning modules
                  </p>
                </div>

                {learningLoading ? (
                  <div className="space-y-2.5 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 bg-muted rounded" />
                    ))}
                  </div>
                ) : learningError ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg min-h-[200px]">
                    <span className="text-xs text-destructive">
                      Failed to load courses
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-(--sb-border)">
                    {learningAnalytics?.mostPopularCourses.map((c) => (
                      <div
                        key={c.id}
                        className="py-2.5 flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p
                            className="text-xs font-semibold truncate"
                            style={{ color: "var(--sb-ink)" }}
                          >
                            {c.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground">
                            {c.enrolled.toLocaleString()} enrolled
                          </span>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 bg-muted/40 px-2 py-0.5 rounded text-[10px] font-bold">
                          <span>{c.completionRate}% Done</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Course Growth Timeline
                  </h4>
                  <DashboardChart
                    data={learningAnalytics?.courseGrowthHistory || []}
                    dataKey="courses"
                    labelKey="date"
                    type="line"
                    color="oklch(0.58 0.16 142)"
                  />
                </div>
              </div>

              {/* Practice stats & difficulty distribution */}
              <div className="island-shell rounded-xl p-5 space-y-4">
                <div>
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    Practice Analytics
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    DSA Problem solves & difficulty distribution
                  </p>
                </div>

                {practiceLoading ? (
                  <div className="h-40 bg-muted/40 animate-pulse rounded-lg" />
                ) : practiceError ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg min-h-[200px]">
                    <span className="text-xs text-destructive">
                      Failed to load practice analytics
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/10">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                          Easy
                        </span>
                        <span
                          className="text-sm font-bold tabular-nums"
                          style={{ color: "var(--sb-ink)" }}
                        >
                          {practiceAnalytics?.difficultyDistribution.easy}
                        </span>
                      </div>
                      <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/10">
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold">
                          Medium
                        </span>
                        <span
                          className="text-sm font-bold tabular-nums"
                          style={{ color: "var(--sb-ink)" }}
                        >
                          {practiceAnalytics?.difficultyDistribution.medium}
                        </span>
                      </div>
                      <div className="bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/10">
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-semibold">
                          Hard
                        </span>
                        <span
                          className="text-sm font-bold tabular-nums"
                          style={{ color: "var(--sb-ink)" }}
                        >
                          {practiceAnalytics?.difficultyDistribution.hard}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Daily Solves Activity
                      </h4>
                      <DashboardChart
                        data={practiceAnalytics?.dailyProblemSolves || []}
                        dataKey="solves"
                        labelKey="date"
                        type="bar"
                        color="var(--sb-accent)"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AI & Research */}
          {activeTab === "ai" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-item">
              {/* AI request volumes & models */}
              <div className="island-shell rounded-xl p-5 space-y-4">
                <div>
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    AI Request Volumes
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    API calls & request spikes over past 7 days
                  </p>
                </div>

                {aiLoading ? (
                  <div className="h-48 bg-muted/40 animate-pulse rounded-lg" />
                ) : aiError ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg min-h-[200px]">
                    <span className="text-xs text-destructive">
                      Failed to load AI analytics
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <DashboardChart
                      data={aiAnalytics?.aiRequestsHistory || []}
                      dataKey="requests"
                      labelKey="date"
                      type="line"
                      color="oklch(0.6 0.118 184.704)"
                    />

                    <div className="space-y-2 mt-2">
                      <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Model Request Share
                      </h4>
                      {aiAnalytics?.modelUsageDistribution.map((m) => (
                        <div
                          key={m.name}
                          className="flex items-center justify-between text-xs py-1"
                        >
                          <span className="font-semibold text-muted-foreground">
                            {m.name}
                          </span>
                          <span className="font-bold tabular-nums">
                            {m.requests.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Research articles & recently updated documents */}
              <div className="island-shell rounded-xl p-5 space-y-4">
                <div>
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    Research Workspace
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Recently updated platform documents & roadmaps
                  </p>
                </div>

                {researchLoading ? (
                  <div className="space-y-2 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-12 bg-muted rounded" />
                    ))}
                  </div>
                ) : researchError ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg min-h-[200px]">
                    <span className="text-xs text-destructive">
                      Failed to load research articles
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col divide-y divide-(--sb-border)">
                      {researchAnalytics?.recentlyUpdated.map((doc) => (
                        <div
                          key={doc.id}
                          className="py-2.5 flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <p
                              className="text-xs font-semibold truncate"
                              style={{ color: "var(--sb-ink)" }}
                            >
                              {doc.title}
                            </p>
                            <span className="text-[10px] text-muted-foreground">
                              Updated {doc.updatedAt}
                            </span>
                          </div>
                          <StatusBadge
                            status={
                              doc.status === "published" ? "active" : "pending"
                            }
                            className="text-[9px]"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Research Publications
                      </h4>
                      <DashboardChart
                        data={researchAnalytics?.researchActivityHistory || []}
                        dataKey="articles"
                        labelKey="date"
                        type="line"
                        color="var(--sb-accent)"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Events & Registrations */}
          {activeTab === "events" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-item">
              {/* Event registration growth */}
              <div className="island-shell rounded-xl p-5 space-y-4">
                <div>
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    Event Registrations Chart
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Growth rate in event registrations
                  </p>
                </div>

                {eventLoading ? (
                  <div className="h-48 bg-muted/40 animate-pulse rounded-lg" />
                ) : eventError ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg min-h-[200px]">
                    <span className="text-xs text-destructive">
                      Failed to load registration chart
                    </span>
                  </div>
                ) : (
                  <DashboardChart
                    data={eventAnalytics?.eventRegistrationsHistory || []}
                    dataKey="registrations"
                    labelKey="date"
                    type="line"
                    color="oklch(0.646 0.222 41.116)"
                  />
                )}
              </div>

              {/* Event Lists & upcoming activities */}
              <div className="island-shell rounded-xl p-5 space-y-4">
                <div>
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    Upcoming Live Events
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Active schedules pending kickoff
                  </p>
                </div>

                {eventLoading ? (
                  <div className="space-y-2 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-muted rounded" />
                    ))}
                  </div>
                ) : eventError ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg min-h-[200px]">
                    <span className="text-xs text-destructive">
                      Failed to load events list
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-(--sb-border)">
                    {eventAnalytics?.upcomingEventsList.map((e) => (
                      <div
                        key={e.id}
                        className="py-2.5 flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p
                            className="text-xs font-semibold truncate"
                            style={{ color: "var(--sb-ink)" }}
                          >
                            {e.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                            <Clock size={9} />
                            {e.date}
                          </span>
                        </div>
                        <div className="shrink-0 text-[10px] font-bold bg-muted/40 px-2 py-0.5 rounded">
                          {e.registrationsCount} signed up
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Interaction Column (Column span 1) */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="island-shell rounded-xl p-5 space-y-3.5">
            <h3
              className="text-[11px] font-bold uppercase tracking-wider pb-1"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex items-center gap-3 px-3 py-2 rounded-[10px] group transition-all duration-150 active:scale-[0.97]"
                  style={{
                    border: "1px solid var(--sb-border)",
                    background:
                      "color-mix(in oklab, var(--sb-ink) 2%, transparent)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "var(--sb-bg-hover)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      "color-mix(in oklab, var(--sb-ink) 2%, transparent)";
                  }}
                >
                  <span
                    className="flex size-7 items-center justify-center rounded-[8px] shrink-0"
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 6%, transparent)",
                      color: "var(--sb-ink-muted)",
                    }}
                  >
                    <action.icon size={13} />
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {action.label}
                    </span>
                  </div>
                  <ArrowRight
                    size={12}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{ color: "var(--sb-ink-dim)" }}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="island-shell rounded-xl p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-(--sb-border)">
              <h3
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                Recent Activity
              </h3>
              <button
                type="button"
                onClick={() => refetchActivities()}
                className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 hover:text-(--sb-ink) transition-colors active:scale-95"
              >
                <RefreshCw size={8} />
                Refresh
              </button>
            </div>

            {activitiesLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-2 py-2">
                    <div className="size-5 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3.5 bg-muted rounded w-3/4" />
                      <div className="h-2.5 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activitiesError ? (
              <div className="text-center py-4 text-xs text-destructive">
                Failed to load activities.
              </div>
            ) : (
              <div className="flex flex-col gap-2 relative pl-2.5 border-l border-(--sb-border)">
                {activities?.map((act) => (
                  <div
                    key={act.id}
                    className="relative flex flex-col gap-0.5 py-1.5 stagger-item"
                  >
                    {/* Activity node */}
                    <div
                      className="absolute left-[-14.5px] top-[10px] size-2 rounded-full border border-background"
                      style={{
                        backgroundColor:
                          act.type === "user_signup"
                            ? "var(--sb-accent)"
                            : act.type === "course_published"
                              ? "oklch(0.58 0.16 142)"
                              : act.type === "ai_request"
                                ? "oklch(0.6 0.118 184.704)"
                                : "var(--sb-ink-dim)",
                      }}
                    />
                    <p
                      className="font-medium text-xs leading-normal"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {act.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span className="font-semibold">{act.actor}</span>
                      <span>•</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
