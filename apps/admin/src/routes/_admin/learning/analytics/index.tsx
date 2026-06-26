import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle,
  FileText,
  GraduationCap,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { DashboardChart } from "#/components/admin/dashboard-chart";
import { MetricCard } from "#/components/admin/metric-card";
import { PageHeader } from "#/components/admin/page-header";
import {
  useLmsCourses,
  useLmsInstructors,
  useLmsStats,
} from "#/hooks/use-lms-state";

export const Route = createFileRoute("/_admin/learning/analytics/")({
  component: LmsAnalyticsPage,
});

// Mock analytics trend datasets
const MONTHLY_ENROLLMENT = [
  { label: "Jan", value: 320 },
  { label: "Feb", value: 450 },
  { label: "Mar", value: 680 },
  { label: "Apr", value: 910 },
  { label: "May", value: 1200 },
  { label: "Jun", value: 1450 },
  { label: "Jul", value: 1850 },
];

const COMPLETION_TREND = [
  { label: "Jan", value: 60 },
  { label: "Feb", value: 62 },
  { label: "Mar", value: 65 },
  { label: "Apr", value: 68 },
  { label: "May", value: 70 },
  { label: "Jun", value: 71 },
  { label: "Jul", value: 74 },
];

const WEEKLY_LEARNING_HOURS = [
  { label: "Mon", value: 142 },
  { label: "Tue", value: 198 },
  { label: "Wed", value: 245 },
  { label: "Thu", value: 210 },
  { label: "Fri", value: 185 },
  { label: "Sat", value: 310 },
  { label: "Sun", value: 345 },
];

function LmsAnalyticsPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError,
    refetch,
  } = useLmsStats();
  const { data: courses = [], isLoading: coursesLoading } = useLmsCourses();
  const { data: instructors = [], isLoading: instructorsLoading } =
    useLmsInstructors();

  const isLoading = statsLoading || coursesLoading || instructorsLoading;

  // Prepare popular courses ranking for chart
  const popularCoursesData = useMemo(() => {
    return courses
      .map((c) => ({ label: c.title.substring(0, 15), value: c.studentsCount }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [courses]);

  return (
    <div className="p-6 w-full pb-16 space-y-8">
      <PageHeader
        title="LMS Analytics"
        description="Comprehensive insights into user engagement, course completions, assessment results, and instructor efficiency."
        icon={BarChart3}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Analytics" },
        ]}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Enrollments"
          value={stats?.totalStudents?.toLocaleString()}
          icon={Users}
          changePercent={18}
          direction="up"
          comparisonText="vs last month"
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Avg Completion Rate"
          value={`${stats?.completionRate ?? 0}%`}
          icon={TrendingUp}
          changePercent={4}
          direction="up"
          comparisonText="vs last quarter"
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Certificates Issued"
          value={stats?.certificatesIssued}
          icon={Award}
          changePercent={22}
          direction="up"
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <MetricCard
          title="Active Students Ratio"
          value="68%"
          icon={CheckCircle}
          comparisonText="Daily Active users"
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardChart
            title="Enrollment Velocity"
            description="Cumulative new student course enrollments"
            data={MONTHLY_ENROLLMENT}
            type="bar"
            color="#6366f1"
          />
        </div>
        <DashboardChart
          title="Curriculum Completion Trend"
          description="Average course completion progress percentage"
          data={COMPLETION_TREND}
          type="line"
          color="#10b981"
        />
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {popularCoursesData.length > 0 && (
          <DashboardChart
            title="Popular Courses by Students"
            description="Enrollment counts across top 5 courses"
            data={popularCoursesData}
            type="bar"
            color="#3b82f6"
          />
        )}
        <DashboardChart
          title="Weekly Study Hours Distribution"
          description="Accumulated hours logged by all active learners"
          data={WEEKLY_LEARNING_HOURS}
          type="line"
          color="#f59e0b"
        />
      </div>

      {/* Bottom Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instructor efficiency table */}
        <div
          className="lg:col-span-2 island-shell rounded-xl p-5 border space-y-4"
          style={{ borderColor: "var(--sb-border)", background: "transparent" }}
        >
          <div>
            <h3
              className="font-bold text-xs text-foreground"
              style={{ color: "var(--sb-ink)" }}
            >
              Instructor Performance & Ratings
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Review rating averages and active learner numbers assigned to
              instructors.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr
                  className="border-b text-[9px] uppercase font-semibold text-muted-foreground"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <th className="pb-2">Instructor Name</th>
                  <th className="pb-2">Subject Expertise</th>
                  <th className="pb-2 text-center">Assigned Courses</th>
                  <th className="pb-2 text-right">Student Reach</th>
                  <th className="pb-2 text-right">Avg Rating</th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ divideColor: "var(--sb-border)" }}
              >
                {instructors.map((ins) => (
                  <tr
                    key={ins.id}
                    className="hover:bg-muted/30"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    <td className="py-2.5 font-medium flex items-center gap-2">
                      <div className="size-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-[9px]">
                        {ins.name.charAt(0)}
                      </div>
                      <span>{ins.name}</span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex gap-1">
                        {ins.expertise.slice(0, 2).map((exp) => (
                          <span
                            key={exp}
                            className="px-1.5 py-0.2 bg-muted text-muted-foreground text-[8px] rounded"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 text-center">
                      {ins.courseIds?.length ?? 0}
                    </td>
                    <td className="py-2.5 text-right font-medium">
                      {ins.studentsCount?.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
                        <Star
                          size={10}
                          className="fill-amber-400 text-amber-400"
                        />
                        {ins.rating?.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assessment and Quizzes completions */}
        <div
          className="island-shell rounded-xl p-5 border space-y-4"
          style={{ borderColor: "var(--sb-border)", background: "transparent" }}
        >
          <div>
            <h3
              className="font-bold text-xs text-foreground"
              style={{ color: "var(--sb-ink)" }}
            >
              Assessment Metric Summaries
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              General stats on homework submissions and quizzes.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <div
                className="flex items-center justify-between text-[11px] font-medium"
                style={{ color: "var(--sb-ink)" }}
              >
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-emerald-500" />
                  Quiz Completion Rate
                </span>
                <span>84%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: "84%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div
                className="flex items-center justify-between text-[11px] font-medium"
                style={{ color: "var(--sb-ink)" }}
              >
                <span className="flex items-center gap-1">
                  <FileText size={12} className="text-indigo-500" />
                  Assignment Completion Rate
                </span>
                <span>76%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full"
                  style={{ width: "76%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div
                className="flex items-center justify-between text-[11px] font-medium"
                style={{ color: "var(--sb-ink)" }}
              >
                <span className="flex items-center gap-1">
                  <GraduationCap size={12} className="text-amber-500" />
                  Auto-Grading Accuracy Ratio
                </span>
                <span>99.2%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full"
                  style={{ width: "99%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div
                className="flex items-center justify-between text-[11px] font-medium"
                style={{ color: "var(--sb-ink)" }}
              >
                <span className="flex items-center gap-1">
                  <BookOpen size={12} className="text-blue-500" />
                  Average Course Rating
                </span>
                <span>4.75 / 5.00</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: "95%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
