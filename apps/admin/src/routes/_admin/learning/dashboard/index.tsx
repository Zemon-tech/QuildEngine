import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle,
  ClipboardList,
  FileText,
  GraduationCap,
  Layers,
  Plus,
  Tag,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { DashboardChart } from "#/components/admin/dashboard-chart";
import { MetricCard } from "#/components/admin/metric-card";
import { PageHeader } from "#/components/admin/page-header";
import { useLmsStats } from "#/hooks/use-lms-state";

export const Route = createFileRoute("/_admin/learning/dashboard/")({
  component: LmsDashboardPage,
});

const ENROLLMENT_DATA = [
  { label: "Jan", value: 420 },
  { label: "Feb", value: 680 },
  { label: "Mar", value: 910 },
  { label: "Apr", value: 1240 },
  { label: "May", value: 1580 },
  { label: "Jun", value: 1920 },
  { label: "Jul", value: 2340 },
];

const COMPLETION_DATA = [
  { label: "Jan", value: 58 },
  { label: "Feb", value: 62 },
  { label: "Mar", value: 65 },
  { label: "Apr", value: 69 },
  { label: "May", value: 71 },
  { label: "Jun", value: 72 },
  { label: "Jul", value: 75 },
];

const POPULAR_COURSES_DATA = [
  { label: "JS Mastery", value: 3842 },
  { label: "Python DS", value: 2105 },
  { label: "React Native", value: 1247 },
  { label: "System Design", value: 0 },
  { label: "ML Bootcamp", value: 0 },
];

const RECENT_ACTIVITY = [
  {
    icon: BookOpen,
    color: "#6366f1",
    text: 'Course "Complete JavaScript Mastery" updated',
    time: "2 hours ago",
  },
  {
    icon: Video,
    color: "#10b981",
    text: 'Tutorial "Big O Notation" published',
    time: "4 hours ago",
  },
  {
    icon: GraduationCap,
    color: "#f59e0b",
    text: "Certificate issued to 12 students",
    time: "6 hours ago",
  },
  {
    icon: ClipboardList,
    color: "#8b5cf6",
    text: 'Assignment "Scope Explorer" created',
    time: "Yesterday",
  },
  {
    icon: FileText,
    color: "#3b82f6",
    text: 'Module "Async JavaScript" updated',
    time: "Yesterday",
  },
  {
    icon: Users,
    color: "#ec4899",
    text: 'Instructor "Jessica Zhang" added',
    time: "2 days ago",
  },
];

const QUICK_ACTIONS = [
  {
    label: "New Course",
    to: "/learning/courses",
    icon: BookOpen,
    color: "#6366f1",
  },
  {
    label: "New Tutorial",
    to: "/learning/tutorials",
    icon: Video,
    color: "#10b981",
  },
  {
    label: "New Quiz",
    to: "/learning/quizzes",
    icon: ClipboardList,
    color: "#f59e0b",
  },
  {
    label: "Add Instructor",
    to: "/learning/instructors",
    icon: Users,
    color: "#8b5cf6",
  },
  {
    label: "New Assignment",
    to: "/learning/assignments",
    icon: CheckCircle,
    color: "#3b82f6",
  },
  {
    label: "Manage Tags",
    to: "/learning/categories",
    icon: Tag,
    color: "#ec4899",
  },
];

function LmsDashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useLmsStats();

  return (
    <div className="p-6 w-full pb-16 space-y-8">
      <PageHeader
        title="Learning Dashboard"
        description="Complete overview of your LMS platform — content, students, and performance."
        icon={GraduationCap}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Dashboard" },
        ]}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <MetricCard
          title="Total Courses"
          value={stats?.totalCourses}
          icon={BookOpen}
          changePercent={12}
          direction="up"
          comparisonText="vs last month"
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Published"
          value={stats?.publishedCourses}
          icon={CheckCircle}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Draft Courses"
          value={stats?.draftCourses}
          icon={FileText}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Total Modules"
          value={stats?.totalModules}
          icon={Layers}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Total Lessons"
          value={stats?.totalLessons}
          icon={FileText}
          changePercent={8}
          direction="up"
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Total Topics"
          value={stats?.totalTopics}
          icon={Tag}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Tutorials"
          value={stats?.totalTutorials}
          icon={Video}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Total Students"
          value={stats?.totalStudents?.toLocaleString()}
          icon={Users}
          changePercent={24}
          direction="up"
          comparisonText="vs last quarter"
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Active Students"
          value={stats?.activeStudents?.toLocaleString()}
          icon={TrendingUp}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Certificates"
          value={stats?.certificatesIssued}
          icon={Award}
          changePercent={18}
          direction="up"
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Quiz Attempts"
          value={stats?.quizAttempts}
          icon={ClipboardList}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Assignments"
          value={stats?.assignmentSubmissions}
          icon={CheckCircle}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Completion Rate"
          value={`${stats?.completionRate ?? 0}%`}
          icon={TrendingUp}
          changePercent={3}
          direction="up"
          comparisonText="up this month"
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Instructors"
          value={stats?.totalInstructors}
          icon={GraduationCap}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardChart
            title="Student Enrollment Trend"
            description="Monthly new enrollments across all courses"
            data={ENROLLMENT_DATA}
            type="bar"
            color="#6366f1"
          />
        </div>
        <DashboardChart
          title="Completion Rate"
          description="Average course completion rate %"
          data={COMPLETION_DATA}
          type="line"
          color="#10b981"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardChart
          title="Popular Courses by Students"
          description="Top courses ranked by student enrollment"
          data={POPULAR_COURSES_DATA}
          type="bar"
          color="#f59e0b"
        />

        {/* Recent Activity */}
        <div className="island-shell rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Recent Activity
            </span>
            <span
              className="text-[10px] font-medium"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              Last 7 days
            </span>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-3">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${item.color}18`, color: item.color }}
                  >
                    <Icon size={12} />
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className="text-[11px] font-medium leading-snug truncate"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {item.text}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      {item.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <span
          className="text-[11px] font-bold uppercase tracking-wider block mb-3"
          style={{ color: "var(--sb-ink-dim)" }}
        >
          Quick Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className="island-shell rounded-xl p-4 flex flex-col items-center gap-2.5 text-center hover:shadow-md transition-all duration-200 active:scale-[0.97] cursor-pointer group"
              >
                <span
                  className="flex size-9 items-center justify-center rounded-xl"
                  style={{
                    background: `${action.color}18`,
                    color: action.color,
                  }}
                >
                  <Icon size={16} />
                </span>
                <span
                  className="text-[11px] font-semibold leading-tight"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {action.label}
                </span>
                <Plus
                  size={10}
                  className="opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ color: action.color }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
